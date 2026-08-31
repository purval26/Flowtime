import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput,
  View, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Platform,
  StatusBar,
  useColorScheme,
  LogBox,
  Alert,
  RefreshControl,
  BackHandler,
  Animated
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './src/lib/supabase';
import { 
  getMessaging, 
  getToken, 
  requestPermission, 
  subscribeToTopic, 
  unsubscribeFromTopic, 
  onMessage,
  AuthorizationStatus 
} from '@react-native-firebase/messaging';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { Class, TimetableEntry, Announcement } from '@flowtime/types';
import { 
  Home, 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon, 
  Layers,
  CloudOff,
  Shield
} from 'lucide-react-native';

// Import Modular Screen Components
import DashboardScreen from './src/screens/DashboardScreen';
import TimetableScreen from './src/screens/TimetableScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AdminScreen from './src/screens/AdminScreen';
import OnBoarding from './src/screens/OnBoarding';
import AnnouncementScreen from './src/screens/AnnouncementScreen';

type TabName = 'dashboard' | 'timetable' | 'settings' | 'admin';
type ThemeMode = 'light' | 'dark' | 'system';

const ACCENT_COLORS = {
  indigo: {
    label: 'Indigo (Default)',
    light: { accent: '#5E59E6', accentSoft: '#EEF2FF' },
    dark: { accent: '#818CF8', accentSoft: '#312E81' }
  },
  emerald: {
    label: 'Emerald Green',
    light: { accent: '#10B981', accentSoft: '#D1FAE5' },
    dark: { accent: '#34D399', accentSoft: '#064E3B' }
  },
  orange: {
    label: 'Sunset Orange',
    light: { accent: '#F97316', accentSoft: '#FFEDD5' },
    dark: { accent: '#FB923C', accentSoft: '#7C2D12' }
  },
  crimson: {
    label: 'Crimson Red',
    light: { accent: '#E11D48', accentSoft: '#FFE4E6' },
    dark: { accent: '#FB7185', accentSoft: '#881337' }
  },
  violet: {
    label: 'Amethyst Violet',
    light: { accent: '#8B5CF6', accentSoft: '#EDE9FE' },
    dark: { accent: '#A78BFA', accentSoft: '#4C1D95' }
  }
};

// Set global default font family for Text and TextInput
const defaultFont = Platform.OS === 'android' ? 'PlusJakartaSans' : 'Plus Jakarta Sans';
try {
  if (Text && (Text as any).defaultProps) {
    (Text as any).defaultProps.style = [{ fontFamily: defaultFont }, (Text as any).defaultProps.style];
  } else if (Text) {
    (Text as any).defaultProps = { style: { fontFamily: defaultFont } };
  }
} catch (e) {
  // Ignore fallback if defaultProps is read-only in newer React Native versions
}

try {
  if (TextInput && (TextInput as any).defaultProps) {
    (TextInput as any).defaultProps.style = [{ fontFamily: defaultFont }, (TextInput as any).defaultProps.style];
  } else if (TextInput) {
    (TextInput as any).defaultProps = { style: { fontFamily: defaultFont } };
  }
} catch (e) {
  // Ignore fallback if defaultProps is read-only
}

// Ignore specific yellowbox warnings if any
LogBox.ignoreLogs(['Setting a timer']);

const firebaseAnalytics = getAnalytics();
const firebaseMessaging = getMessaging();

export default function App() {
  // Navigation & Preferences State
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [accentColor, setAccentColor] = useState<keyof typeof ACCENT_COLORS>('indigo');
  const [showAdminTabOverride, setShowAdminTabOverride] = useState(false);
  const [settingsHeaderTaps, setSettingsHeaderTaps] = useState(0);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>([]);
  const [isViewingAnnouncements, setIsViewingAnnouncements] = useState(false);
  const systemColorScheme = useColorScheme();

  // Timetable layout mode: single day vs weekly grid matrix
  const [timetableMode, setTimetableMode] = useState<'tabs' | 'all'>('tabs');

  // Supabase Auth and Admin session states
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Stats / Audit states for Admin Dashboard
  const [stats, setStats] = useState({ subjects: 0, rooms: 0, professors: 0 });

  // Core Timetable / Announcement Data States
  const [classes, setClasses] = useState<Class[]>([]);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  // Time tracker for active countdowns (Fixed to Monday, Aug 24, 2026 at 11:15:00 for UI styling)
  // const [currentTime, setCurrentTime] = useState(new Date('2026-08-25T11:50:00'));
  const [currentTime, setCurrentTime] = useState(new Date());

  // Weekday tabs for Timetable View (Default to today's weekday on opening)
  const [timetableDay, setTimetableDay] = useState(() => {
    const day = new Date().getDay();
    return day === 0 ? 1 : day; // Default Sunday (0) to Monday (1)
  });

  // Tab Bar Sliding Animation & Layout Width
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const activeTabAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const currentTabs = [
      'dashboard',
      'timetable',
      ...((isAdmin || showAdminTabOverride) ? ['admin'] : []),
      'settings',
    ];
    const targetIdx = currentTabs.indexOf(activeTab);
    if (targetIdx !== -1) {
      Animated.spring(activeTabAnim, {
        toValue: targetIdx,
        useNativeDriver: true,
        tension: 70,
        friction: 11,
      }).start();
    }
  }, [activeTab, isAdmin, showAdminTabOverride]);

  // Dynamic Theme Colors Resolution
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const activeAccent = ACCENT_COLORS[accentColor] || ACCENT_COLORS.indigo;
  const fontRegular = 'PlusJakartaSans-Regular';
  const fontBold = 'PlusJakartaSans-Bold';
  const fontMedium = 'PlusJakartaSans-Medium';
  const fontSemiBold = 'PlusJakartaSans-SemiBold';

  const colors = isDark ? {
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    accent: activeAccent.dark.accent,
    accentSoft: activeAccent.dark.accentSoft,
    fontFamily: fontRegular,
    fontFamilyBold: fontBold,
    fontFamilyMedium: fontMedium,
    fontFamilySemiBold: fontSemiBold,
    success: '#34D399', // Green/Teal for Dark Mode
    successSoft: '#064E3B',
    danger: '#F87171',
    dangerSoft: '#7F1D1D',
    cardShadow: '#000000',
  } : {
    background: '#F3F4F6', // Off-white background as shown in image
    surface: '#FFFFFF',    // Pure white cards as shown in image
    border: '#E5E7EB',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    accent: activeAccent.light.accent,
    accentSoft: activeAccent.light.accentSoft,
    fontFamily: fontRegular,
    fontFamilyBold: fontBold,
    fontFamilyMedium: fontMedium,
    fontFamilySemiBold: fontSemiBold,
    success: '#10B981', // Emerald green for LIVE dot and checkmarks
    successSoft: '#D1FAE5', // Soft green bg
    danger: '#EF4444',
    dangerSoft: '#FEE2E2',
    cardShadow: '#E5E7EB',
  };

  // Check user role in Supabase user_roles table matching web hook
  const checkAdminRole = async (userSession: any) => {
    if (!userSession) {
      setIsAdmin(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles (
            name
          )
        `)
        .eq('user_id', userSession.user.id);
      
      if (error) throw error;
      
      if (data) {
        const roleNames = data
          .map((item: any) => item.roles?.name)
          .filter(Boolean) as string[];
        
        // Allow access if they are owner, admin, or editor (staff roles)
        const isStaff = roleNames.some(role => ['owner', 'admin', 'editor'].includes(role));
        setIsAdmin(isStaff);
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      setIsAdmin(false);
    }
  };

  // 1. Initial Load Preferences, Data and Auth State
  useEffect(() => {
    async function loadPreferences() {
      try {
        const savedClassId = await AsyncStorage.getItem('flowtime_selected_class_id');
        const savedTheme = await AsyncStorage.getItem('flowtime_theme') as ThemeMode | null;
        const savedAccent = await AsyncStorage.getItem('flowtime_accent_color');
        const savedName = await AsyncStorage.getItem('flowtime_user_name');
        const onboarded = await AsyncStorage.getItem('flowtime_has_onboarded');
        const savedNotifications = await AsyncStorage.getItem('flowtime_notifications_enabled');
        const savedReadIds = await AsyncStorage.getItem('flowtime_read_announcements');

        if (savedClassId) setSelectedClassId(savedClassId);
        if (savedTheme) setThemeMode(savedTheme);
        if (savedAccent && savedAccent in ACCENT_COLORS) {
          setAccentColor(savedAccent as keyof typeof ACCENT_COLORS);
        }
        if (savedName) setUserName(savedName);
        setHasOnboarded(onboarded === 'true');
        
        if (savedNotifications !== null) {
          setNotificationsEnabled(savedNotifications === 'true');
        }
        if (savedReadIds) {
          setReadAnnouncementIds(JSON.parse(savedReadIds));
        }
      } catch (e) {
        console.log('Failed loading cache preferences:', e);
        setHasOnboarded(false);
      } finally {
        setPreferencesLoaded(true);
      }
    }
    loadPreferences();

    // Listen to Supabase Auth State
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdminRole(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdminRole(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Hardware Back Button for Announcements and Tab Navigation
  useEffect(() => {
    const onBackPress = () => {
      if (isViewingAnnouncements) {
        setIsViewingAnnouncements(false);
        return true;
      }
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isViewingAnnouncements, activeTab]);

  // 2. Real-time timer ticker (Disabled for static visual editing)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Telemetry Log Helper
  const logTelemetry = async (type: string, metadata: object = {}) => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: type,
        platform: 'mobile',
        metadata: metadata
      });
      // Mirror to Firebase Analytics
      await logEvent(firebaseAnalytics, type, metadata);
    } catch (e) {
      // Fail silently for telemetry
    }
  };

  // Log page view when switching tabs
  useEffect(() => {
    logTelemetry('page_view', { tab: activeTab });
  }, [activeTab]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData(true);
    setRefreshing(false);
  };

  // 4. Fetch / Cache Timetable & Announcements
  const refreshData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      // A. Fetch Classes
      const { data: classData, error: classErr } = await supabase
        .from('classes')
        .select('*')
        .order('name');

      if (classErr) throw classErr;

      const resolvedClasses = (classData || []) as Class[];
      setClasses(resolvedClasses);
      await AsyncStorage.setItem('flowtime_cached_classes', JSON.stringify(resolvedClasses));

      // Use first class as default if none selected
      let activeClassId = selectedClassId;
      if (!activeClassId && resolvedClasses.length > 0) {
        activeClassId = resolvedClasses[0].id;
        setSelectedClassId(activeClassId);
        await AsyncStorage.setItem('flowtime_selected_class_id', activeClassId);
      }

      if (activeClassId) {
        // B. Fetch Timetable Entries
        const { data: timetableData } = await supabase
          .from('timetables')
          .select('id')
          .eq('class_id', activeClassId)
          .eq('is_active', true)
          .maybeSingle();

        if (timetableData?.id) {
          const { data: entriesData, error: entriesErr } = await supabase
            .from('timetable_entries')
            .select(`
              *,
              subject:subjects (*),
              room:rooms (*),
              professor:professors (*)
            `)
            .eq('timetable_id', timetableData.id);

          if (entriesErr) throw entriesErr;
          const resolvedEntries = (entriesData || []) as TimetableEntry[];
          setEntries(resolvedEntries);
          await AsyncStorage.setItem(`flowtime_cached_entries_${activeClassId}`, JSON.stringify(resolvedEntries));
        } else {
          setEntries([]);
        }

        // C. Fetch Announcements
        const { data: announceData, error: announceErr } = await supabase
          .from('announcements')
          .select('*')
          .or(`class_id.is.null,class_id.eq.${activeClassId}`)
          .order('created_at', { ascending: false });

        if (announceErr) throw announceErr;
        const resolvedAnnounce = (announceData || []) as Announcement[];
        setAnnouncements(resolvedAnnounce);
        await AsyncStorage.setItem(`flowtime_cached_announce_${activeClassId}`, JSON.stringify(resolvedAnnounce));
      }

      // D. Admin Stats
      const [subjectsCount, roomsCount, professorsCount] = await Promise.all([
        supabase.from('subjects').select('*', { count: 'exact', head: true }),
        supabase.from('rooms').select('*', { count: 'exact', head: true }),
        supabase.from('professors').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        subjects: subjectsCount.count || 0,
        rooms: roomsCount.count || 0,
        professors: professorsCount.count || 0
      });

      setOffline(false);
    } catch (err) {
      // Offline Fallback
      setOffline(true);
      console.log('Offline: loading cached local files...');
      
      const cachedClasses = await AsyncStorage.getItem('flowtime_cached_classes');
      if (cachedClasses) setClasses(JSON.parse(cachedClasses));

      const activeClassId = selectedClassId;
      if (activeClassId) {
        const cachedEntries = await AsyncStorage.getItem(`flowtime_cached_entries_${activeClassId}`);
        if (cachedEntries) setEntries(JSON.parse(cachedEntries));

        const cachedAnnounce = await AsyncStorage.getItem(`flowtime_cached_announce_${activeClassId}`);
        if (cachedAnnounce) setAnnouncements(JSON.parse(cachedAnnounce));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (preferencesLoaded) {
      refreshData();
    }
  }, [selectedClassId, preferencesLoaded]);

  // Subscribe to Real-Time Announcements for Foreground local Alerts
  useEffect(() => {
    const channel = supabase
      .channel('mobile-announcements-notifications-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        async (payload) => {
          const newNotice = payload.new as Announcement;
          
          // Re-fetch data silently to reflect in UI unread counters
          if (!newNotice.class_id || newNotice.class_id === selectedClassId) {
            refreshData(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClassId]);

  // Subscribe to Firebase Cloud Messaging (FCM) push notifications
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const authStatus = await requestPermission(firebaseMessaging);
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await getToken(firebaseMessaging);
          console.log('FCM Device Token:', token);
          logTelemetry('fcm_token_registered', { token });

          // Subscribe to global topic
          await subscribeToTopic(firebaseMessaging, 'announcements');

          // Handle selected class subscriptions dynamically
          if (selectedClassId) {
            const lastClassId = await AsyncStorage.getItem('flowtime_last_subscribed_class_id');
            if (lastClassId && lastClassId !== selectedClassId) {
              await unsubscribeFromTopic(firebaseMessaging, `class_${lastClassId}`);
            }
            await subscribeToTopic(firebaseMessaging, `class_${selectedClassId}`);
            await AsyncStorage.setItem('flowtime_last_subscribed_class_id', selectedClassId);
          }
        }
      } catch (e) {
        console.log('Error requesting FCM permissions:', e);
      }
    };

    if (notificationsEnabled) {
      setupFCM();
    }

    // Listen to foreground notifications
    const unsubscribeFCM = onMessage(firebaseMessaging, async (remoteMessage) => {
      if (notificationsEnabled) {
        // Silently refresh the cached state to update the unread counters and badge in real-time
        refreshData(true);
      }
    });

    return () => {
      unsubscribeFCM();
    };
  }, [notificationsEnabled, selectedClassId]);

  // 5. Math logic for dashboard countdown
  const selectedClassDetails = classes.find((c) => c.id === selectedClassId);
  const todayDayOfWeek = currentTime.getDay() === 0 ? 7 : currentTime.getDay();
  // Filter breaks or lectures
  const todaySchedule = entries.filter((e) => e.day_of_week === todayDayOfWeek)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Determine current active and next lectures
  const timeStr = currentTime.toTimeString().slice(0, 8);
  
  const activeLecture = todaySchedule.find(
    (e) => e.start_time <= timeStr && e.end_time > timeStr
  );
  const nextLecture = todaySchedule.find(
    (e) => e.start_time > timeStr
  );

  // Formatting remaining time countdown e.g. "Ends in 32 min 14 sec"
  const getFormattedRemainingTime = (entry: TimetableEntry) => {
    const [eh, em, es] = entry.end_time.split(':').map(Number);
    const endSeconds = eh * 3600 + em * 60 + (es || 0);
    const currentSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
    const totalRemainingSeconds = endSeconds - currentSeconds;
    
    if (totalRemainingSeconds <= 0) return 'Class finished';
    
    const h = Math.floor(totalRemainingSeconds / 3600);
    const m = Math.floor((totalRemainingSeconds % 3600) / 60);
    const s = totalRemainingSeconds % 60;
    
    if (h > 0) return `Ends in ${h}h ${m}m ${s}s`;
    return `Ends in ${m}m ${s}s`;
  };

  // Formatting time until next class countdown e.g. "Starts in 1h 2m"
  const getFormattedTimeUntilNext = (entry: TimetableEntry) => {
    const [sh, sm, ss] = entry.start_time.split(':').map(Number);
    const startSeconds = sh * 3600 + sm * 60 + (ss || 0);
    const currentSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
    const totalRemainingSeconds = startSeconds - currentSeconds;
    
    if (totalRemainingSeconds <= 0) return 'Starting now';
    
    const h = Math.floor(totalRemainingSeconds / 3600);
    const m = Math.floor((totalRemainingSeconds % 3600) / 60);
    const s = totalRemainingSeconds % 60;
    
    if (h > 0) return `Starts in ${h}h ${m}m`;
    return `Starts in ${m}m ${s}s`;
  };

  // Calculate progress bar percent (0 to 100)
  const getProgressBarPercentage = (entry: TimetableEntry) => {
    const [sh, sm, ss] = entry.start_time.split(':').map(Number);
    const [eh, em, es] = entry.end_time.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const totalDuration = end - start;
    if (totalDuration <= 0) return 0;
    
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const elapsedMinutes = currentMinutes - start;
    const elapsedSeconds = elapsedMinutes * 60 + currentTime.getSeconds();
    const totalSeconds = totalDuration * 60;
    
    return Math.min(100, Math.max(0, (elapsedSeconds / totalSeconds) * 100));
  };

  // Check lecture completion status matching web
  const getClassStatus = (entry: TimetableEntry) => {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [sh, sm] = entry.start_time.split(':').map(Number);
    const [eh, em] = entry.end_time.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    if (currentMinutes >= end) return 'COMPLETED';
    if (currentMinutes >= start && currentMinutes < end) return 'CURRENT';
    return 'UPCOMING';
  };

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };
  const getUserName = () => {
    return userName || 'Purval';
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Extract all unique start/end time boundaries for All Days Grid View
  const boundariesSet = new Set<string>();
  entries.forEach((entry) => {
    boundariesSet.add(entry.start_time.slice(0, 5));
    boundariesSet.add(entry.end_time.slice(0, 5));
  });
  const sortedBoundaries = Array.from(boundariesSet).sort();
  const sortedTimeSlots: { start: string; end: string }[] = [];
  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    sortedTimeSlots.push({
      start: sortedBoundaries[i],
      end: sortedBoundaries[i + 1],
    });
  }

  // Handle Class Selector
  const handleClassChange = async (id: string) => {
    setSelectedClassId(id);
    await AsyncStorage.setItem('flowtime_selected_class_id', id);
    logTelemetry('class_selected', { class_id: id });
  };

  // Handle Username Change
  const handleUserNameChange = async (newName: string) => {
    setUserName(newName);
    await AsyncStorage.setItem('flowtime_user_name', newName);
  };

  // Handle Theme Toggle
  const handleThemeChange = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem('flowtime_theme', mode);
    logTelemetry('theme_toggled', { theme: mode });
  };

  // Handle Accent Toggle
  const handleAccentChange = async (newAccent: keyof typeof ACCENT_COLORS) => {
    setAccentColor(newAccent);
    await AsyncStorage.setItem('flowtime_accent_color', newAccent);
    logTelemetry('accent_color_changed', { accent: newAccent });
  };

  // Handle Easter Egg settings header tap
  const handleSettingsHeaderTap = () => {
    setSettingsHeaderTaps((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowAdminTabOverride(true);
        Alert.alert('🔑 Admin Portal Unlocked', 'You can now access the Admin tab in the navigation bar!');
        return 0;
      }
      return next;
    });
  };

  // Handle Notifications Toggle
  const handleToggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    await AsyncStorage.setItem('flowtime_notifications_enabled', enabled ? 'true' : 'false');
    logTelemetry('notifications_toggled', { enabled });
  };

  // Open Announcements View and clear read state
  const handleOpenAnnouncements = async () => {
    setIsViewingAnnouncements(true);
    const allIds = announcements.map(a => a.id);
    setReadAnnouncementIds(allIds);
    await AsyncStorage.setItem('flowtime_read_announcements', JSON.stringify(allIds));
  };

  const unreadCount = announcements.filter(a => !readAnnouncementIds.includes(a.id)).length;

  // Handle Admin Portal Sign In
  const handleAdminSignIn = async () => {
    if (!adminEmail.trim() || !adminPassword.trim()) {
      Alert.alert('Form Error', 'Please enter email and password.');
      return;
    }
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword.trim(),
      });
      if (error) throw error;
      
      // Check roles matching web logic
      const { data: roleData, error: rolesErr } = await supabase
        .from('user_roles')
        .select(`
          roles (
            name
          )
        `)
        .eq('user_id', data.user.id);
        
      if (rolesErr || !roleData) throw new Error('Could not fetch user roles.');
      
      const roleNames = roleData
        .map((item: any) => item.roles?.name)
        .filter(Boolean) as string[];
        
      const isStaff = roleNames.some(role => ['owner', 'admin', 'editor'].includes(role));
      
      if (!isStaff) {
        await supabase.auth.signOut();
        Alert.alert('Access Denied', 'You do not have staff/owner access privileges.');
        return;
      }
      
      setIsAdmin(true);
      setAdminEmail('');
      setAdminPassword('');
      Alert.alert('Login Success', 'Welcome to the Flowtime Admin Portal!');
      refreshData();
    } catch (err: any) {
      Alert.alert('Login Error', err.message || 'Incorrect credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Admin Sign Out
  const handleAdminSignOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setSession(null);
    Alert.alert('Signed Out', 'Logged out of Admin Portal successfully.');
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      // SafeArea top padding fix for Android devices
      // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    },
    header: {
      height: 60,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: colors.fontFamilyBold,
      color: colors.textPrimary,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: colors.fontFamilySemiBold,
    },
    offlineBanner: {
      backgroundColor: colors.dangerSoft,
      borderBottomWidth: 1,
      borderBottomColor: colors.danger + '20',
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    offlineText: {
      fontSize: 11,
      color: colors.danger,
      fontFamily: colors.fontFamilyBold,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 8
    },
    tabBar: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 28 : 20,
      left: 16,
      right: 16,
      height: 64,
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 32,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      borderRadius: 26,
      zIndex: 2,
    },
    tabText: {
      fontSize: 10,
      fontFamily: colors.fontFamilySemiBold,
      marginTop: 2,
    }
  });

  if (hasOnboarded === null) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={dynamicStyles.container}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!hasOnboarded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={dynamicStyles.container}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
          <OnBoarding
            colors={colors}
            themeMode={themeMode}
            handleThemeChange={handleThemeChange}
            onComplete={(name) => {
              setUserName(name);
              setHasOnboarded(true);
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (isViewingAnnouncements) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={dynamicStyles.container}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
          <AnnouncementScreen
            announcements={announcements}
            readIds={readAnnouncementIds}
            colors={colors}
            isDark={isDark}
            onBack={() => setIsViewingAnnouncements(false)}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={dynamicStyles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
        
        {/* Offline Status indicator */}
        {offline && (
          <View style={dynamicStyles.offlineBanner}>
            <CloudOff size={12} color={colors.danger} />
            <Text style={dynamicStyles.offlineText}>OFFLINE MODE — LOADING LOCAL SCHEDULE CACHE</Text>
          </View>
        )}

        {/* Main Tab Renderings */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <ScrollView 
            style={dynamicStyles.content}
            contentContainerStyle={{ paddingBottom: 110 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.accent]}
                tintColor={colors.accent}
                progressBackgroundColor={colors.surface}
              />
            }
          >
            {activeTab === 'dashboard' && (
              <DashboardScreen
                currentTime={currentTime}
                announcements={announcements}
                readAnnouncementIds={readAnnouncementIds}
                todaySchedule={todaySchedule}
                activeLecture={activeLecture}
                nextLecture={nextLecture}
                colors={colors}
                isDark={isDark}
                getGreeting={getGreeting}
                getUserName={getUserName}
                formattedDate={formattedDate}
                getFormattedRemainingTime={getFormattedRemainingTime}
                getFormattedTimeUntilNext={getFormattedTimeUntilNext}
                getProgressBarPercentage={getProgressBarPercentage}
                getClassStatus={getClassStatus}
                unreadCount={unreadCount}
                onOpenAnnouncements={handleOpenAnnouncements}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'timetable' && (
              <TimetableScreen
                timetableMode={timetableMode}
                setTimetableMode={setTimetableMode}
                timetableDay={timetableDay}
                setTimetableDay={setTimetableDay}
                entries={entries}
                colors={colors}
                isDark={isDark}
                sortedTimeSlots={sortedTimeSlots}
                currentTime={currentTime}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen
                userName={userName}
                handleUserNameChange={handleUserNameChange}
                classes={classes}
                selectedClassId={selectedClassId}
                handleClassChange={handleClassChange}
                themeMode={themeMode}
                handleThemeChange={handleThemeChange}
                colors={colors}
                notificationsEnabled={notificationsEnabled}
                handleToggleNotifications={handleToggleNotifications}
                accentColor={accentColor}
                handleAccentChange={handleAccentChange}
                accentColorsList={ACCENT_COLORS}
                onHeaderTap={handleSettingsHeaderTap}
              />
            )}

            {activeTab === 'admin' && (
              <AdminScreen
                isAdmin={isAdmin}
                adminEmail={adminEmail}
                setAdminEmail={setAdminEmail}
                adminPassword={adminPassword}
                setAdminPassword={setAdminPassword}
                authLoading={authLoading}
                handleAdminSignIn={handleAdminSignIn}
                handleAdminSignOut={handleAdminSignOut}
                classes={classes}
                stats={stats}
                colors={colors}
                isDark={isDark}
              />
            )}
          </ScrollView>
        )}

        {/* Tab Navigation Bar */}
        {(() => {
          const navigationTabs = [
            { key: 'dashboard', name: 'Dashboard', icon: Home },
            { key: 'timetable', name: 'Timetable', icon: CalendarIcon },
            ...((isAdmin || showAdminTabOverride) ? [{ key: 'admin', name: 'Admin', icon: Shield }] : []),
            { key: 'settings', name: 'Settings', icon: SettingsIcon },
          ];

          const activeIndex = navigationTabs.findIndex((t) => t.key === activeTab);

          return (
            <View 
              style={dynamicStyles.tabBar}
              onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}
            >
              {/* iOS 26 Active Sliding Pill Background */}
              {tabBarWidth > 0 && (() => {
                const innerWidth = tabBarWidth - 16; // 8px horizontal padding on each side
                const tabItemWidth = innerWidth / navigationTabs.length;
                const pillTranslateX = activeTabAnim.interpolate({
                  inputRange: navigationTabs.map((_, i) => i),
                  outputRange: navigationTabs.map((_, i) => i * tabItemWidth),
                });

                return (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      left: 8,
                      top: 6,
                      bottom: 6,
                      width: tabItemWidth,
                      borderRadius: 26,
                      backgroundColor: isDark ? `${colors.accent}33` : `${colors.accent}1F`,
                      borderWidth: 1,
                      borderColor: isDark ? `${colors.accent}66` : `${colors.accent}40`,
                      transform: [{ translateX: pillTranslateX }],
                      zIndex: 1,
                    }}
                  />
                );
              })()}

              {/* Navigation Tab Buttons */}
              {navigationTabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const TabIcon = tab.icon;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => {
                      const targetIndex = navigationTabs.findIndex((t) => t.key === tab.key);
                      if (targetIndex !== -1) {
                        Animated.spring(activeTabAnim, {
                          toValue: targetIndex,
                          useNativeDriver: true,
                          tension: 70,
                          friction: 11,
                        }).start();
                      }
                      setActiveTab(tab.key as TabName);
                    }}
                    activeOpacity={0.7}
                    style={dynamicStyles.tabButton}
                  >
                    <TabIcon 
                      size={20} 
                      color={isActive ? colors.accent : colors.textSecondary} 
                      fill={isActive ? colors.accent : 'none'} 
                    />
                    <Text style={[
                      dynamicStyles.tabText, 
                      { 
                        color: isActive ? colors.accent : colors.textSecondary,
                        fontFamily: isActive ? colors.fontFamilyBold : colors.fontFamilySemiBold
                      }
                    ]}>
                      {tab.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
