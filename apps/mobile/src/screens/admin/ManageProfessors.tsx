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

interface Professor {
  id: string;
  name: string;
  email: string;
  short_name: string;
}

interface ManageProfessorsProps {
  colors: any;
  onBack: () => void;
}

export default function ManageProfessors({ colors, onBack }: ManageProfessorsProps) {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfId, setEditingProfId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shortName, setShortName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProfessors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .order('name');
      if (error) throw error;
      setProfessors(data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleStartEdit = (prof: Professor) => {
    setEditingProfId(prof.id);
    setName(prof.name);
    setEmail(prof.email);
    setShortName(prof.short_name);
  };

  const handleCancelEdit = () => {
    setEditingProfId(null);
    setName('');
    setEmail('');
    setShortName('');
  };

  const handleSaveProfessor = async () => {
    if (!name.trim() || !email.trim() || !shortName.trim()) {
      Alert.alert('Validation Error', 'Please fill in Name, Email, and Short Name.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingProfId) {
        const { error } = await supabase
          .from('professors')
          .update({ name: name.trim(), email: email.trim(), short_name: shortName.trim() })
          .eq('id', editingProfId);
        if (error) throw error;
        Alert.alert('Success', 'Professor profile updated successfully!');
      } else {
        const { error } = await supabase
          .from('professors')
          .insert({ name: name.trim(), email: email.trim(), short_name: shortName.trim() });
        if (error) throw error;
        Alert.alert('Success', 'Professor added successfully!');
      }

      handleCancelEdit();
      fetchProfessors();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save professor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfessor = async (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Delete professor "${name}"? Timetable entries taught by them will lose their professor assignment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('professors')
                .delete()
                .eq('id', id);
              if (error) throw error;
              Alert.alert('Success', 'Professor deleted');
              if (editingProfId === id) handleCancelEdit();
              fetchProfessors();
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

      {/* Add / Edit Professor Form */}
      <Text style={styles.title}>{editingProfId ? '✏️ Edit Professor Profile' : '👨‍🏫 Create Professor / Teacher Profile'}</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Dr. Jane Smith"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="e.g. janesmith@university.edu"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Initials / Short Name</Text>
        <TextInput
          value={shortName}
          onChangeText={setShortName}
          placeholder="e.g. JS"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {editingProfId && (
            <TouchableOpacity onPress={handleCancelEdit} style={[styles.btn, { backgroundColor: colors.border, flex: 1 }]}>
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSaveProfessor} disabled={submitting} style={[styles.btn, { flex: 2 }]}>
            {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : (
              <>
                {editingProfId ? <Pencil size={16} color="#FFFFFF" /> : <Plus size={16} color="#FFFFFF" />}
                <Text style={styles.btnText}>{editingProfId ? 'Update Professor' : 'Add Professor'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Professors List */}
      <Text style={styles.title}>📋 Existing Professors</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : professors.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, textAlign: 'center', marginTop: -2 }}>No professors configured yet.</Text>
        </View>
      ) : (
        professors.map((prof) => (
          <View key={prof.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }]}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>{prof.name}</Text>
              <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, marginTop: -2 }}>{prof.email} • Initials: {prof.short_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TouchableOpacity onPress={() => handleStartEdit(prof)} style={{ padding: 6 }}>
                <Pencil size={16} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteProfessor(prof.id, prof.name)} style={{ padding: 6 }}>
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
