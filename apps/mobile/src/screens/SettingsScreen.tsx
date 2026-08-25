import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity
} from 'react-native';
import { Class } from '@flowtime/types';
import { 
  Sun,
  Moon,
  Monitor
} from 'lucide-react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsScreenProps {
  classes: Class[];
  selectedClassId: string | null;
  handleClassChange: (id: string) => void;
  themeMode: ThemeMode;
  handleThemeChange: (theme: ThemeMode) => void;
  colors: any;
}

export default function SettingsScreen({
  classes,
  selectedClassId,
  handleClassChange,
  themeMode,
  handleThemeChange,
  colors
}: SettingsScreenProps) {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    title: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
      marginTop: 8,
    }
  });

  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Class Selector Picker */}
      <Text style={styles.title}>Select Class Section</Text>
      <View style={styles.card}>
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          return (
            <TouchableOpacity
              key={cls.id}
              onPress={() => handleClassChange(cls.id)}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ 
                fontSize: 14, 
                fontWeight: isSelected ? 'bold' : 'normal',
                color: isSelected ? colors.accent : colors.textPrimary
              }}>
                {cls.name} ({cls.section})
              </Text>
              {isSelected && <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 13 }}>Active</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Theme Settings Selector */}
      <Text style={styles.title}>Preferences</Text>
      <View style={styles.card}>
        {[
          { id: 'light', name: 'Light Mode', icon: Sun },
          { id: 'dark', name: 'Dark Mode', icon: Moon },
          { id: 'system', name: 'System Settings', icon: Monitor },
        ].map((item) => {
          const isSelected = item.id === themeMode;
          const IconComp = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleThemeChange(item.id as ThemeMode)}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <IconComp size={16} color={isSelected ? colors.accent : colors.textSecondary} />
                <Text style={{ 
                  fontSize: 14, 
                  color: isSelected ? colors.textPrimary : colors.textSecondary,
                  fontWeight: isSelected ? 'bold' : 'normal'
                }}>
                  {item.name}
                </Text>
              </View>
              {isSelected && <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 13 }}>Selected</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Branding tag */}
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <Text style={{ fontSize: 11, color: colors.textMuted }}>Made with ❤️ by Purval</Text>
      </View>
    </View>
  );
}
