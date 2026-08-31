import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
  Linking
} from 'react-native';
import { Class } from '@flowtime/types';
import {
  Sun,
  Moon,
  Monitor,
  User,
  ChevronRight,
  BookOpen,
  Palette,
  ArrowLeft,
  LogOut,
  Bell,
  Check,
  PenLineIcon,
  Info,
  Instagram,
  ExternalLink
} from 'lucide-react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsScreenProps {
  userName: string;
  handleUserNameChange: (name: string) => void;
  classes: Class[];
  selectedClassId: string | null;
  handleClassChange: (id: string) => void;
  themeMode: ThemeMode;
  handleThemeChange: (theme: ThemeMode) => void;
  colors: any;
  notificationsEnabled: boolean;
  handleToggleNotifications: (enabled: boolean) => void;
  accentColor: string;
  handleAccentChange: (newAccent: any) => void;
  accentColorsList: any;
  onHeaderTap?: () => void;
}

export default function SettingsScreen({
  userName,
  handleUserNameChange,
  classes,
  selectedClassId,
  handleClassChange,
  themeMode,
  handleThemeChange,
  colors,
  notificationsEnabled,
  handleToggleNotifications,
  accentColor,
  handleAccentChange,
  accentColorsList,
  onHeaderTap
}: SettingsScreenProps) {
  const [showEditUserNameModal, setShowEditUserNameModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAccentModal, setShowAccentModal] = useState(false);
  const [tempUserName, setTempUserName] = useState(userName);

  // Sync tempUserName when modal opens
  useEffect(() => {
    if (showEditUserNameModal) {
      setTempUserName(userName);
    }
  }, [showEditUserNameModal, userName]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconWrapper: {
      width: 28,
      height: 28,
      borderRadius: 6,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowLabel: {
      fontSize: 14,
      color: colors.textPrimary,
      fontFamily: colors.fontFamilyMedium,
    },
    rowValue: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    title: {
      fontSize: 11,
      fontFamily: colors.fontFamilyBold,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
      marginLeft: 4,
      marginTop: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalContainer: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    modalHeader: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 16,
      fontFamily: colors.fontFamilyBold,
      color: colors.textPrimary,
    },
    modalContent: {
      maxHeight: 300,
    },
    modalItem: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalItemText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontFamily: colors.fontFamily
    },
    modalItemTextSelected: {
      fontFamily: colors.fontFamilyBold,
      color: colors.accent,
    },
    textInput: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      margin: 20,
      fontSize: 14,
      color: colors.textPrimary,
      fontFamily: colors.fontFamily
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 20,
      gap: 12,
    },
    buttonSave: {
      backgroundColor: colors.accent,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    buttonSaveText: {
      color: '#FFFFFF',
      fontFamily: colors.fontFamilyBold,
      fontSize: 14,
    },
    buttonCancel: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    buttonCancelText: {
      color: colors.textSecondary,
      fontFamily: colors.fontFamilyMedium,
      fontSize: 14,
    },
  });

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classLabel = selectedClass ? `${selectedClass.name} (${selectedClass.section})` : 'Select Class';

  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Centered Header Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16 }}>
        <TouchableOpacity style={{ padding: 4 }}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={onHeaderTap}>
          <View>
            <Text style={{ fontSize: 18, fontFamily: colors.fontFamilyBold, color: colors.textPrimary }}>
              Settings
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ width: 24 }} />
      </View>

      {/* ACCOUNT Section */}
      <Text style={styles.title}>ACCOUNT</Text>
      <View style={styles.card}>
        {/* User Card Row */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>{userName}</Text>
              {/* <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>purval@example.com</Text> */}
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowEditUserNameModal(true)}>
            <PenLineIcon size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Division Selection Row */}
        <TouchableOpacity onPress={() => setShowClassModal(true)} style={[styles.row, { alignItems: 'center' }]}>
          <View style={styles.rowLeft}>
            <View style={styles.iconWrapper}>
              <BookOpen size={16} color={colors.textSecondary} />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={[styles.rowLabel,{ marginTop: -2}]}>Class Section</Text>
              <Text style={[styles.rowValue, { fontSize: 12, color: colors.textSecondary, fontFamily: colors.fontFamily, marginTop: -2 }]}>{classLabel}</Text>
            </View>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* PREFERENCES Section */}
      <Text style={styles.title}>PREFERENCES</Text>
      <View style={styles.card}>
        {/* Appearance Mode */}
        <TouchableOpacity onPress={() => setShowThemeModal(true)} style={[styles.row, { alignItems: 'center' }]}>
          <View style={styles.rowLeft}>
            <View style={styles.iconWrapper}>
              {themeMode === 'light' ? (
                <Sun size={16} color={colors.textSecondary} />
              ) : themeMode === 'dark' ? (
                <Moon size={16} color={colors.textSecondary} />
              ) : (
                <Monitor size={16} color={colors.textSecondary} />
              )}
            </View>
            <View style={{ gap: 2 }}>
              <Text style={[styles.rowLabel,{ marginTop: -2}]}>Appearance</Text>
              <Text style={[styles.rowValue, { fontSize: 12, color: colors.textSecondary, fontFamily: colors.fontFamily , marginTop: -2}]}>
                {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Notifications Toggle */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.iconWrapper}>
              <Bell size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.rowLabel,{ marginTop: -2}]}>Notifications</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleToggleNotifications(!notificationsEnabled)}
            activeOpacity={0.8}
            style={{
              width: 40,
              height: 22,
              borderRadius: 11,
              backgroundColor: notificationsEnabled ? colors.accent : colors.border,
              padding: 2,
              justifyContent: 'center',
              alignItems: notificationsEnabled ? 'flex-end' : 'flex-start'
            }}
          >
            <View style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: '#FFFFFF',
            }} />
          </TouchableOpacity>
        </View>

        {/* Accent Color display */}
        <TouchableOpacity onPress={() => setShowAccentModal(true)} style={[styles.row, { borderBottomWidth: 0, alignItems: 'center' }]}>
          <View style={styles.rowLeft}>
            <View style={styles.iconWrapper}>
              <Palette size={16} color={colors.textSecondary} />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={[styles.rowLabel,{ marginTop: -2}]}>Accent Color</Text>
              <Text style={[styles.rowValue, { fontSize: 12, color: colors.textSecondary, fontFamily: colors.fontFamily, marginTop: -2 }]}>
                {accentColorsList[accentColor]?.label || 'Indigo'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: colors.accent }} />
            <ChevronRight size={16} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>

      {/* ABOUT Section */}
      <Text style={styles.title}>ABOUT</Text>
      <View style={styles.card}>
        {/* Version Info Row */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.iconWrapper}>
              <Info size={16} color={colors.textSecondary} />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={[styles.rowLabel, { marginTop: -2 }]}>App Version</Text>
              <Text style={[styles.rowValue, { fontSize: 12, color: colors.textSecondary, fontFamily: colors.fontFamily, marginTop: -2 }]}>
                v1.2 (Build 2 • arm64-v8a)
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
            <Text style={{ fontSize: 11, fontFamily: colors.fontFamilyBold, color: colors.accent, marginTop: -2 }}>Latest</Text>
          </View>
        </View>

        {/* Developer / Instagram Link Row */}
        <TouchableOpacity
          onPress={() => Linking.openURL('https://instagram.com/rntxpurval')}
          style={[styles.row, { borderBottomWidth: 0, alignItems: 'center' }]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.accentSoft }]}>
              <Instagram size={16} color={colors.accent} />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={[styles.rowLabel, { marginTop: -2 }]}>Developer</Text>
              <Text style={[styles.rowValue, { fontSize: 12, color: colors.textSecondary, fontFamily: colors.fontFamily, marginTop: -2 }]}>
                @rntxpurval (Purval)
              </Text>
            </View>
          </View>
          <ExternalLink size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Logout Row at Bottom */}
      <TouchableOpacity
        onPress={() => handleClassChange('')}
        style={{
          backgroundColor: '#FEE2E2',
          borderColor: '#FECACA',
          borderWidth: 1,
          borderRadius: 16,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          marginTop: 8,
          marginBottom: 16,
        }}
      >
        <LogOut size={16} color="#DC2626" />
        <Text style={{ color: '#DC2626', fontFamily: colors.fontFamilyBold, fontSize: 14, marginTop: -2 }}>Reset / Logout</Text>
      </TouchableOpacity>

      {/* Footer Branding matching Website */}
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 8 }}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://instagram.com/rntxpurval')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, marginTop: -2 }}>
            Made with ❤️ by
          </Text>
          <Instagram size={13} color={colors.accent} />
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamilyBold, color: colors.accent, marginTop: -2 }}>
            Purval
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* User Name Modal */}
      <Modal
        visible={showEditUserNameModal}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
        onRequestClose={() => setShowEditUserNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowEditUserNameModal(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle,{ marginTop: -2}]}>Edit User Name</Text>
              <TouchableOpacity onPress={() => setShowEditUserNameModal(false)}>
                <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: colors.fontFamilyMedium, marginTop: -2 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textInput}
              value={tempUserName}
              onChangeText={setTempUserName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textMuted}
              autoFocus={true}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={() => setShowEditUserNameModal(false)}
              >
                <Text style={[styles.buttonCancelText,{ marginTop: -2}]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSave}
                onPress={() => {
                  if (tempUserName.trim()) {
                    handleUserNameChange(tempUserName.trim());
                    setShowEditUserNameModal(false);
                  }
                }}
              >
                <Text style={[styles.buttonSaveText,{ marginTop: -2}]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Class Selection Modal */}
      <Modal
        visible={showClassModal}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
        onRequestClose={() => setShowClassModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowClassModal(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle,{ marginTop: -2}]}>Choose Class Section</Text>
              <TouchableOpacity onPress={() => setShowClassModal(false)}>
                <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: colors.fontFamilyMedium, marginTop: -2 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {classes.map((cls) => {
                const isSelected = cls.id === selectedClassId;
                return (
                  <TouchableOpacity
                    key={cls.id}
                    onPress={() => {
                      handleClassChange(cls.id);
                      setShowClassModal(false);
                    }}
                    style={styles.modalItem}
                  >
                    <Text style={[
                      styles.modalItemText,
                      isSelected && styles.modalItemTextSelected,{ marginTop: -2}
                    ]}>
                      {cls.name} ({cls.section})
                    </Text>
                    {isSelected && (
                      <Check size={16} color={colors.accent} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowThemeModal(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle,{ marginTop: -2}]}>Choose Appearance</Text>
              <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: colors.fontFamilyMedium, marginTop: -2 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              {([
                { value: 'light', label: 'Light Mode', icon: Sun },
                { value: 'dark', label: 'Dark Mode', icon: Moon },
                { value: 'system', label: 'System Default', icon: Monitor },
              ] as const).map((item) => {
                const isSelected = themeMode === item.value;
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      handleThemeChange(item.value);
                      setShowThemeModal(false);
                    }}
                    style={styles.modalItem}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <IconComponent size={16} color={isSelected ? colors.accent : colors.textSecondary} />
                      <Text style={[
                        styles.modalItemText,
                        isSelected && styles.modalItemTextSelected,{ marginTop: -2}
                      ]}>
                        {item.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Check size={16} color={colors.accent} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Accent Color Selection Modal */}
      <Modal
        visible={showAccentModal}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
        onRequestClose={() => setShowAccentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowAccentModal(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle,{ marginTop: -2}]}>Choose Accent Color</Text>
              <TouchableOpacity onPress={() => setShowAccentModal(false)}>
                <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: colors.fontFamilyMedium, marginTop: -2 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              {Object.entries(accentColorsList).map(([key, item]: [string, any]) => {
                const isSelected = key === accentColor;
                const isDarkModeActive = colors.background === '#0F172A';
                const previewColor = isDarkModeActive ? item.dark.accent : item.light.accent;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      handleAccentChange(key);
                      setShowAccentModal(false);
                    }}
                    style={styles.modalItem}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: previewColor }} />
                      <Text style={[
                        styles.modalItemText,
                        isSelected && styles.modalItemTextSelected,{ marginTop: -2}
                      ]}>
                        {item.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Check size={16} color={colors.accent} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
