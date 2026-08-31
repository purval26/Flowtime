import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Bell, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface OnBoardingProps {
  colors: any;
  themeMode: 'light' | 'dark' | 'system';
  handleThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onComplete: (userName: string) => void;
}

export default function OnBoarding({
  colors,
  themeMode,
  handleThemeChange,
  onComplete
}: OnBoardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleNext = async () => {
    if (step === 0) {
      if (!name.trim()) return;
      // Save name to local storage
      try {
        await AsyncStorage.setItem('flowtime_user_name', name.trim());
      } catch (e) {
        console.error('Failed to save name', e);
      }
      goToStep(1);
    } else if (step === 1) {
      goToStep(2);
    } else if (step === 2) {
      // Complete onboarding
      try {
        await AsyncStorage.setItem('flowtime_has_onboarded', 'true');
      } catch (e) {
        console.error('Failed to save onboarding status', e);
      }
      onComplete(name.trim());
    }
  };

  const handleBack = () => {
    if (step > 0) {
      goToStep(step - 1);
    }
  };

  const goToStep = (targetStep: number) => {
    setStep(targetStep);
    Animated.timing(slideAnim, {
      toValue: -targetStep * width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setPermissionStatus('granted');
          } else {
            setPermissionStatus('denied');
          }
        } else {
          setPermissionStatus('granted');
        }
      } catch (err) {
        console.warn(err);
        setPermissionStatus('error');
      }
    } else {
      setPermissionStatus('granted');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    slideContainer: {
      flexDirection: 'row',
      width: width * 3,
      flex: 1,
    },
    slide: {
      width: width,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontFamily: colors.fontFamilyBold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 12,
      marginTop: -2
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 32,
      paddingHorizontal: 16,
      marginTop: -2,
      fontFamily: colors.fontFamily
    },
    input: {
      width: '100%',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 20,
      fontFamily: colors.fontFamily
    },
    card: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    selectedCard: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    cardLabel: {
      fontSize: 15,
      fontFamily: colors.fontFamilyBold,
      color: colors.textPrimary,
    },
    bottomBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    btnNext: {
      backgroundColor: colors.accent,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    btnDisabled: {
      opacity: 0.5,
    },
    btnBack: {
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    indicatorContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    activeIndicator: {
      backgroundColor: colors.accent,
      width: 20,
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Sliding Views container */}
      <Animated.View style={[styles.slideContainer, { transform: [{ translateX: slideAnim }] }]}>
        
        {/* SLIDE 1: WELCOME & NAME INPUT */}
        <View style={styles.slide}>
          <Text style={{ fontSize: 44, marginBottom: 16, marginTop: -2 }}>👋</Text>
          <Text style={styles.title}>Welcome to Flowtime</Text>
          <Text style={styles.subtitle}>
            Let's personalize your schedule. What should we call you in the app?
          </Text>
          
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            maxLength={25}
          />
        </View>

        {/* SLIDE 2: THEME SELECTION */}
        <View style={styles.slide}>
          <Text style={{ fontSize: 44, marginBottom: 16, marginTop: -2 }}>🎨</Text>
          <Text style={styles.title}>Choose Your Appearance</Text>
          <Text style={styles.subtitle}>
            Select your preferred visual style. You can also customize this in Settings later.
          </Text>

          {[
            { id: 'light', name: 'Light Mode', icon: Sun },
            { id: 'dark', name: 'Dark Mode', icon: Moon },
            { id: 'system', name: 'System Settings', icon: Monitor }
          ].map((theme) => {
            const isSelected = themeMode === theme.id;
            const Icon = theme.icon;
            return (
              <TouchableOpacity
                key={theme.id}
                onPress={() => handleThemeChange(theme.id as any)}
                style={[styles.card, isSelected && styles.selectedCard]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Icon size={20} color={isSelected ? colors.accent : colors.textSecondary} />
                  <Text style={[styles.cardLabel, isSelected && { color: colors.accent },{ marginTop: -2}]}>
                    {theme.name}
                  </Text>
                </View>
                {isSelected && (
                  <CheckCircle2 size={18} color={colors.accent} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SLIDE 3: NOTIFICATION PERMISSIONS */}
        <View style={styles.slide}>
          <Text style={{ fontSize: 44, marginBottom: 16, marginTop: -2 }}>🔔</Text>
          <Text style={styles.title}>Stay in the Loop</Text>
          <Text style={styles.subtitle}>
            Get alerts before classes start, timetable updates, and broadcasts from your section.
          </Text>

          <TouchableOpacity
            onPress={requestNotificationPermission}
            style={[
              styles.card, 
              permissionStatus === 'granted' && styles.selectedCard,
              { justifyContent: 'center', paddingVertical: 20, borderStyle: 'dashed' }
            ]}
          >
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Bell size={24} color={permissionStatus === 'granted' ? colors.accent : colors.textSecondary} />
              <Text style={[
                styles.cardLabel, 
                { fontSize: 16 , marginTop: -2},
                permissionStatus === 'granted' && { color: colors.accent }
              ]}>
                {permissionStatus === 'granted' ? 'Notifications Enabled!' : 'Enable Notifications'}
              </Text>
              {permissionStatus === 'denied' && (
                <Text style={{ fontSize: 11, color: colors.danger, fontFamily: colors.fontFamilySemiBold, marginTop: -2 }}>Permission Denied</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

      </Animated.View>

      {/* BOTTOM ACTIONS BAR */}
      <View style={styles.bottomBar}>
        {/* Back Button */}
        {step > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.btnBack}>
            <ArrowLeft size={16} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontFamily: colors.fontFamilyBold, marginTop: -2 }}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}

        {/* Progress Step Indicators */}
        <View style={styles.indicatorContainer}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                step === i && styles.activeIndicator
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={step === 0 && !name.trim()}
          style={[styles.btnNext, step === 0 && !name.trim() && styles.btnDisabled]}
        >
          <Text style={{ color: '#FFFFFF', fontFamily: colors.fontFamilyBold, marginTop: -2 }}>
            {step === 2 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
