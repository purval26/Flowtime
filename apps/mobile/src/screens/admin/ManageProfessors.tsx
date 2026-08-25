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
import { Plus, Trash2, ArrowLeft } from 'lucide-react-native';

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

  const handleAddProfessor = async () => {
    if (!name.trim() || !email.trim() || !shortName.trim()) {
      Alert.alert('Validation Error', 'Please fill in Name, Email, and Short Name.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('professors')
        .insert({ name: name.trim(), email: email.trim(), short_name: shortName.trim() });
      if (error) throw error;
      Alert.alert('Success', 'Professor added successfully!');
      setName('');
      setEmail('');
      setShortName('');
      fetchProfessors();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add professor');
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

      {/* Add Professor Form */}
      <Text style={styles.title}>👨‍🏫 Create Professor / Teacher Profile</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Dr. Jane Smith"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="e.g. janesmith@university.edu"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Initials / Short Name</Text>
        <TextInput
          value={shortName}
          onChangeText={setShortName}
          placeholder="e.g. JS"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddProfessor} disabled={submitting} style={styles.btn}>
          {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : (
            <>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.btnText}>Add Professor</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Professors List */}
      <Text style={styles.title}>📋 Existing Professors</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : professors.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>No professors configured yet.</Text>
        </View>
      ) : (
        professors.map((prof) => (
          <View key={prof.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }]}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.textPrimary }}>{prof.name}</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>{prof.email} • Initials: {prof.short_name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteProfessor(prof.id, prof.name)} style={{ padding: 6 }}>
              <Trash2 size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}
