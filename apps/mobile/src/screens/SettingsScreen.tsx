import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback
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
  Check
} from 'lucide-react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsScreenProps {
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
  const [showClassModal, setShowClassModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAccentModal, setShowAccentModal] = useState(false);

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
      fontWeight: '500',
    },
    rowValue: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    title: {
      fontSize: 11,
      fontWeight: 'bold',
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
      fontWeight: 'bold',
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
    },
    modalItemTextSelected: {
      fontWeight: 'bold',
      color: colors.accent,
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>
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
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.textPrimary }}>Purval Radadiya</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>purval@example.com</Text>
            </View>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </View>

        {/* Division Selection Row */}
        <TouchableOpacity onPress={() => setShowClassModal(true)} style={[styles.row, { alignItems: 'center' }]}>
          <View style={styles.rowLeft}>
            <View style={styles.iconWrapper}>
              <BookOpen size={16} color={colors.textSecondary} />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={styles.rowLabel}>Class Section</Text>
              <Text style={[styles.rowValue, { fontSize: 12, color: colors.textSecondary }]}>{classLabel}</Text>
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
              <Text style={styles.rowLabel}>Appearance</Text>
              <Text style={[styles.rowValue, { fontSize: 12, color: colors.textSecondary }]}>
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
            <Text style={styles.rowLabel}>Notifications</Text>
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
              <Text style={styles.rowLabel}>Accent Color</Text>
              <Text style={[styles.rowValue, { fontSize: 12, color: colors.textSecondary }]}>
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
        }}
      >
        <LogOut size={16} color="#DC2626" />
        <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 14 }}>Reset / Logout</Text>
      </TouchableOpacity>

      {/* Class Selection Modal */}
      <Modal
        visible={showClassModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClassModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowClassModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose Class Section</Text>
                  <TouchableOpacity onPress={() => setShowClassModal(false)}>
                    <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500' }}>Cancel</Text>
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
                          isSelected && styles.modalItemTextSelected
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowThemeModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose Appearance</Text>
                  <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                    <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500' }}>Cancel</Text>
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
                            isSelected && styles.modalItemTextSelected
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Accent Color Selection Modal */}
      <Modal
        visible={showAccentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAccentModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAccentModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose Accent Color</Text>
                  <TouchableOpacity onPress={() => setShowAccentModal(false)}>
                    <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500' }}>Cancel</Text>
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
                            isSelected && styles.modalItemTextSelected
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
