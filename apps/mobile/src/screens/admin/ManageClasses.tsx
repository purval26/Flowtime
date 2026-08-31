import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Class } from '@flowtime/types';
import { Plus, Trash2, ArrowLeft, Pencil } from 'lucide-react-native';

interface ManageClassesProps {
  colors: any;
  onBack: () => void;
}

export default function ManageClasses({ colors, onBack }: ManageClassesProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [className, setClassName] = useState('');
  const [classSection, setClassSection] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      if (error) throw error;
      setClasses(data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleStartEdit = (cls: Class) => {
    setEditingClassId(cls.id);
    setClassName(cls.name);
    setClassSection(cls.section);
  };

  const handleCancelEdit = () => {
    setEditingClassId(null);
    setClassName('');
    setClassSection('');
  };

  const handleSaveClass = async () => {
    if (!className.trim() || !classSection.trim()) {
      Alert.alert('Validation Error', 'Please enter both class name and section.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingClassId) {
        const { error } = await supabase
          .from('classes')
          .update({ name: className.trim(), section: classSection.trim() })
          .eq('id', editingClassId);
        if (error) throw error;
        Alert.alert('Success', 'Class batch updated successfully!');
      } else {
        const { error } = await supabase
          .from('classes')
          .insert({ name: className.trim(), section: classSection.trim() });
        if (error) throw error;
        Alert.alert('Success', 'Class batch added successfully!');
      }

      handleCancelEdit();
      fetchClasses();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (id: string, name: string, sec: string) => {
    Alert.alert(
      'Confirm Delete',
      `Delete class ${name} (${sec})? This will delete all associated timetables and schedules.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('classes')
                .delete()
                .eq('id', id);
              if (error) throw error;
              Alert.alert('Success', 'Class deleted');
              if (editingClassId === id) handleCancelEdit();
              fetchClasses();
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    input: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 6,
      padding: 10,
      color: colors.textPrimary,
      marginBottom: 12,
      fontSize: 14,
    },
    btn: {
      backgroundColor: colors.accent,
      padding: 12,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    btnText: {
      color: '#FFFFFF',
      fontFamily: colors.fontFamilyBold,
      fontSize: 14,
      marginTop: -2,
    },
    title: {
      fontSize: 15,
      fontFamily: colors.fontFamilyBold,
      color: colors.textPrimary,
      marginBottom: 12,
      marginTop: -2,
    }
  });

  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Back Header */}
      <TouchableOpacity 
        onPress={onBack} 
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}
      >
        <ArrowLeft size={16} color={colors.accent} />
        <Text style={{ fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.accent, marginTop: -2 }}>Back to Admin Menu</Text>
      </TouchableOpacity>

      {/* Add / Edit Class Form */}
      <Text style={styles.title}>{editingClassId ? '✏️ Edit Class Batch' : '🏫 Create Class Batch'}</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Class Name / Division</Text>
        <TextInput
          value={className}
          onChangeText={setClassName}
          placeholder="e.g. BTech CSE 3rd Year"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Section / Division Code</Text>
        <TextInput
          value={classSection}
          onChangeText={setClassSection}
          placeholder="e.g. A"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {editingClassId && (
            <TouchableOpacity onPress={handleCancelEdit} style={[styles.btn, { backgroundColor: colors.border, flex: 1 }]}>
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSaveClass} disabled={submitting} style={[styles.btn, { flex: 2 }]}>
            {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : (
              <>
                {editingClassId ? <Pencil size={16} color="#FFFFFF" /> : <Plus size={16} color="#FFFFFF" />}
                <Text style={styles.btnText}>{editingClassId ? 'Update Class' : 'Add Class'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Classes List */}
      <Text style={styles.title}>📋 Existing Classes</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : classes.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, textAlign: 'center', marginTop: -2 }}>No classes configured yet.</Text>
        </View>
      ) : (
        classes.map((cls) => (
          <View key={cls.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }]}>
            <View>
              <Text style={{ fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>{cls.name}</Text>
              <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, marginTop: -2 }}>Section: {cls.section}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TouchableOpacity onPress={() => handleStartEdit(cls)} style={{ padding: 6 }}>
                <Pencil size={16} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteClass(cls.id, cls.name, cls.section)} style={{ padding: 6 }}>
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
