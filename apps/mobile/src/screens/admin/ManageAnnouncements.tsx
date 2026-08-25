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
import { Class, Announcement } from '@flowtime/types';
import { Plus, Trash2, ArrowLeft } from 'lucide-react-native';

interface ManageAnnouncementsProps {
  colors: any;
  onBack: () => void;
}

export default function ManageAnnouncements({ colors, onBack }: ManageAnnouncementsProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeClassId, setNewNoticeClassId] = useState<string>('global');
  const [broadcasting, setBroadcasting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classRes, announceRes] = await Promise.all([
        supabase.from('classes').select('*').order('name'),
        supabase.from('announcements').select('*').order('created_at', { ascending: false })
      ]);
      setClasses(classRes.data || []);
      setAnnouncements(announceRes.data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNotice = async () => {
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      Alert.alert('Form Error', 'Please fill in both a title and details.');
      return;
    }
    setBroadcasting(true);
    try {
      const classIdVal = newNoticeClassId === 'global' ? null : newNoticeClassId;
      const { error } = await supabase.from('announcements').insert({
        title: newNoticeTitle.trim(),
        content: newNoticeContent.trim(),
        class_id: classIdVal
      });
      if (error) throw error;

      Alert.alert('Broadcast Success', 'Notice sent successfully!');
      setNewNoticeTitle('');
      setNewNoticeContent('');
      loadData();
    } catch (err: any) {
      Alert.alert('Broadcast Failure', err.message || 'Error occurred');
    } finally {
      setBroadcasting(false);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this notice?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('announcements').delete().eq('id', noticeId);
            if (error) throw error;
            Alert.alert('Success', 'Notice deleted');
            loadData();
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        }
      }
    ]);
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
    badgeOption: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    badgeOptionSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
    badgeTextSelected: {
      color: '#FFFFFF',
    },
    btn: {
      backgroundColor: colors.accent,
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
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

      {/* Announcements Notice Broadcaster Form */}
      <Text style={styles.title}>📢 Broadcast Notice</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Notice Headline</Text>
        <TextInput
          value={newNoticeTitle}
          onChangeText={setNewNoticeTitle}
          placeholder="e.g. CAS Lecture rescheduled today"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Target Division</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => setNewNoticeClassId('global')}
            style={[styles.badgeOption, newNoticeClassId === 'global' && styles.badgeOptionSelected, { marginRight: 8 }]}
          >
            <Text style={[styles.badgeText, newNoticeClassId === 'global' && styles.badgeTextSelected]}>🌐 All Batches</Text>
          </TouchableOpacity>
          {classes.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              onPress={() => setNewNoticeClassId(cls.id)}
              style={[styles.badgeOption, newNoticeClassId === cls.id && styles.badgeOptionSelected, { marginRight: 8 }]}
            >
              <Text style={[styles.badgeText, newNoticeClassId === cls.id && styles.badgeTextSelected]}>🏫 {cls.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Details / Description</Text>
        <TextInput
          value={newNoticeContent}
          onChangeText={setNewNoticeContent}
          placeholder="Enter announcements details here..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        />

        <TouchableOpacity 
          onPress={handleCreateNotice}
          disabled={broadcasting}
          style={styles.btn}
        >
          {broadcasting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.btnText}>Broadcast Notice</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Manage Existing Notices */}
      <Text style={styles.title}>📝 Active Notices</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : announcements.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>No active notices found.</Text>
        </View>
      ) : (
        announcements.map((item) => (
          <View key={item.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.textPrimary }}>{item.title}</Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
                {item.class_id ? 'Class Specific' : 'Global Broadcast'} • {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteNotice(item.id)} style={{ padding: 6 }}>
              <Trash2 size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}
