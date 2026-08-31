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
import { Plus, Trash2, ArrowLeft, Pencil } from 'lucide-react-native';

interface Subject {
  id: string;
  name: string;
  code: string;
  short_name: string;
}

interface ManageSubjectsProps {
  colors: any;
  onBack: () => void;
}

export default function ManageSubjects({ colors, onBack }: ManageSubjectsProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [shortName, setShortName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      if (error) throw error;
      setSubjects(data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleStartEdit = (sub: Subject) => {
    setEditingSubjectId(sub.id);
    setName(sub.name);
    setCode(sub.code);
    setShortName(sub.short_name);
  };

  const handleCancelEdit = () => {
    setEditingSubjectId(null);
    setName('');
    setCode('');
    setShortName('');
  };

  const handleSaveSubject = async () => {
    if (!name.trim() || !code.trim() || !shortName.trim()) {
      Alert.alert('Validation Error', 'Please fill in Name, Code, and Short Name.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingSubjectId) {
        const { error } = await supabase
          .from('subjects')
          .update({ name: name.trim(), code: code.trim(), short_name: shortName.trim() })
          .eq('id', editingSubjectId);
        if (error) throw error;
        Alert.alert('Success', 'Subject updated successfully!');
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert({ name: name.trim(), code: code.trim(), short_name: shortName.trim() });
        if (error) throw error;
        Alert.alert('Success', 'Subject added successfully!');
      }

      handleCancelEdit();
      fetchSubjects();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save subject');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Delete subject "${name}"? This will delete all timetable entries associated with this subject.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', id);
              if (error) throw error;
              Alert.alert('Success', 'Subject deleted');
              if (editingSubjectId === id) handleCancelEdit();
              fetchSubjects();
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

      {/* Add / Edit Subject Form */}
      <Text style={styles.title}>{editingSubjectId ? '✏️ Edit Subject' : '📘 Create Subject'}</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Subject Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Advanced Operating Systems"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Subject Code</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="e.g. CS-301"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Abbreviation / Short Name</Text>
        <TextInput
          value={shortName}
          onChangeText={setShortName}
          placeholder="e.g. AOS"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {editingSubjectId && (
            <TouchableOpacity onPress={handleCancelEdit} style={[styles.btn, { backgroundColor: colors.border, flex: 1 }]}>
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSaveSubject} disabled={submitting} style={[styles.btn, { flex: 2 }]}>
            {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : (
              <>
                {editingSubjectId ? <Pencil size={16} color="#FFFFFF" /> : <Plus size={16} color="#FFFFFF" />}
                <Text style={styles.btnText}>{editingSubjectId ? 'Update Subject' : 'Add Subject'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Subjects List */}
      <Text style={styles.title}>📋 Existing Subjects</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : subjects.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, textAlign: 'center', marginTop: -2 }}>No subjects configured yet.</Text>
        </View>
      ) : (
        subjects.map((sub) => (
          <View key={sub.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }]}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>{sub.name}</Text>
              <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, marginTop: -2 }}>Code: {sub.code} • Abbrev: {sub.short_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TouchableOpacity onPress={() => handleStartEdit(sub)} style={{ padding: 6 }}>
                <Pencil size={16} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSubject(sub.id, sub.name)} style={{ padding: 6 }}>
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
