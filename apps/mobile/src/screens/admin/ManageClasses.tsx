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
import { Plus, Trash2, ArrowLeft } from 'lucide-react-native';

interface ManageClassesProps {
  colors: any;
  onBack: () => void;
}

export default function ManageClasses({ colors, onBack }: ManageClassesProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleAddClass = async () => {
    if (!className.trim() || !classSection.trim()) {
      Alert.alert('Validation Error', 'Please enter both class name and section.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('classes')
        .insert({ name: className.trim(), section: classSection.trim() });
      if (error) throw error;
      Alert.alert('Success', 'Class batch added successfully!');
      setClassName('');
      setClassSection('');
      fetchClasses();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add class');
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
      fontWeight: 'bold',
      fontSize: 14,
    },
    title: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 12,
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
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.accent }}>Back to Admin Menu</Text>
      </TouchableOpacity>

      {/* Add Class Form */}
      <Text style={styles.title}>🏫 Create Class Batch</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Class Name / Division</Text>
        <TextInput
          value={className}
          onChangeText={setClassName}
          placeholder="e.g. BTech CSE 3rd Year"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Section / Division Code</Text>
        <TextInput
          value={classSection}
          onChangeText={setClassSection}
          placeholder="e.g. A"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddClass} disabled={submitting} style={styles.btn}>
          {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : (
            <>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.btnText}>Add Class</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Classes List */}
      <Text style={styles.title}>📋 Existing Classes</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : classes.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>No classes configured yet.</Text>
        </View>
      ) : (
        classes.map((cls) => (
          <View key={cls.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }]}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.textPrimary }}>{cls.name}</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>Section: {cls.section}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteClass(cls.id, cls.name, cls.section)} style={{ padding: 6 }}>
              <Trash2 size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}
