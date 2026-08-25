import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Platform,
  StatusBar,
  useColorScheme,
  LogBox,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './src/lib/supabase';
import { Class, TimetableEntry, Announcement } from '@flowtime/types';
import * as Notifications from 'expo-notifications';
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

type TabName = 'dashboard' | 'timetable' | 'settings' | 'admin';
type ThemeMode = 'light' | 'dark' | 'system';

LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  // Navigation & Preferences State
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
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

  // Time tracker for active countdowns
  const [currentTime, setCurrentTime] = useState(new Date());

  // Weekday tabs for Timetable View
  const [timetableDay, setTimetableDay] = useState(new Date().getDay() === 0 ? 7 : new Date().getDay());

  // Dynamic Theme Colors Resolution
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? {
    background: '#0B0F19',
    surface: '#151B2C',
    border: '#1F2937',
    textPrimary: '#F3F4F6',
    textSecondary: '#9CA3AF',
    textMuted: '#4B5563',
    accent: '#3B82F6',
    accentSoft: '#1E293B',
    success: '#22C55E',
    successSoft: '#14532D',
    danger: '#EF4444',
    dangerSoft: '#7F1D1D',
    cardShadow: '#000000',
  } : {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    accent: '#2563EB',
    accentSoft: '#EFF6FF',
    success: '#16A34A',
    successSoft: '#F0FDF4',
    danger: '#DC2626',
    dangerSoft: '#FEF2F2',
    cardShadow: '#E2E8F0',
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
        if (savedClassId) setSelectedClassId(savedClassId);
        if (savedTheme) setThemeMode(savedTheme);
      } catch (e) {
        console.log('Failed loading cache preferences:', e);
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

  // 2. Real-time timer ticker
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
    } catch (e) {
      // Fail silently for telemetry
    }
  };

  // Log page view when switching tabs
  useEffect(() => {
    logTelemetry('page_view', { tab: activeTab });
  }, [activeTab]);

  // 4. Fetch / Cache Timetable & Announcements
  const refreshData = async () => {
    setLoading(true);
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
    refreshData();
  }, [selectedClassId]);

  // A. Register for Notifications Permissions and Setup (Android Channel Support)
  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#3B82F6',
          });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.log('Failed to get permissions for notifications!');
          return;
        }
      } catch (e) {
        console.log('Error registering for notifications:', e);
      }
    }

    registerForPushNotificationsAsync();
  }, []);

  // B. Subscribe to Real-Time Announcements for Foreground Local Push Notifications
  useEffect(() => {
    const channel = supabase
      .channel('mobile-announcements-notifications-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        async (payload) => {
          const newNotice = payload.new as Announcement;
          
          // Show local heads-up push notification if global or class matches
          if (!newNotice.class_id || newNotice.class_id === selectedClassId) {
            try {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: `📢 New Notice: ${newNotice.title}`,
                  body: newNotice.content,
                  data: { noticeId: newNotice.id },
                },
                trigger: null, // trigger immediately
              });
            } catch (e) {
              // Fallback to RN alert dialog if push fails
              Alert.alert(`📢 New Notice: ${newNotice.title}`, newNotice.content);
            }
            
            // Re-fetch data to reflect in UI
            refreshData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClassId]);

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

  // Handle Theme Toggle
  const handleThemeChange = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem('flowtime_theme', mode);
    logTelemetry('theme_toggled', { theme: mode });
  };

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
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
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
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
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
      fontWeight: '700',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    tabBar: {
      height: 64,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: Platform.OS === 'ios' ? 10 : 0,
    },
    tabButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    },
    tabText: {
      fontSize: 10,
      fontWeight: '600',
      marginTop: 4,
    }
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      
      {/* App Header */}
      <View style={dynamicStyles.header}>
        <View>
          <Text style={dynamicStyles.headerTitle}>Flowtime</Text>
          {selectedClassDetails && (
            <Text style={dynamicStyles.headerSubtitle}>
              {selectedClassDetails.name} ({selectedClassDetails.section})
            </Text>
          )}
        </View>
        <Layers size={20} color={colors.accent} />
      </View>

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
        <ScrollView style={dynamicStyles.content}>
          {activeTab === 'dashboard' && (
            <DashboardScreen
              currentTime={currentTime}
              announcements={announcements}
              todaySchedule={todaySchedule}
              activeLecture={activeLecture}
              nextLecture={nextLecture}
              colors={colors}
              isDark={isDark}
              getGreeting={getGreeting}
              formattedDate={formattedDate}
              getFormattedRemainingTime={getFormattedRemainingTime}
              getFormattedTimeUntilNext={getFormattedTimeUntilNext}
              getProgressBarPercentage={getProgressBarPercentage}
              getClassStatus={getClassStatus}
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
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              classes={classes}
              selectedClassId={selectedClassId}
              handleClassChange={handleClassChange}
              themeMode={themeMode}
              handleThemeChange={handleThemeChange}
              colors={colors}
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
      <View style={dynamicStyles.tabBar}>
        {[
          { key: 'dashboard', name: 'Dashboard', icon: Home },
          { key: 'timetable', name: 'Timetable', icon: CalendarIcon },
          { key: 'admin', name: 'Admin', icon: Shield },
          { key: 'settings', name: 'Settings', icon: SettingsIcon },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const TabIcon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key as TabName)}
              style={dynamicStyles.tabButton}
            >
              <TabIcon size={22} color={isActive ? colors.accent : colors.textSecondary} />
              <Text style={[dynamicStyles.tabText, { color: isActive ? colors.accent : colors.textSecondary }]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
