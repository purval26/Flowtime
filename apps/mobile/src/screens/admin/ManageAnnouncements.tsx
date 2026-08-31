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
import { Plus, Trash2, ArrowLeft, Pencil, X } from 'lucide-react-native';

interface ManageAnnouncementsProps {
  colors: any;
  onBack: () => void;
}

export default function ManageAnnouncements({ colors, onBack }: ManageAnnouncementsProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
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

  const handleStartEdit = (notice: Announcement) => {
    setEditingNoticeId(notice.id);
    setNewNoticeTitle(notice.title);
    setNewNoticeContent(notice.content);
    setNewNoticeClassId(notice.class_id || 'global');
  };

  const handleCancelEdit = () => {
    setEditingNoticeId(null);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeClassId('global');
  };

  const handleSaveNotice = async () => {
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      Alert.alert('Form Error', 'Please fill in both a title and details.');
      return;
    }
    setBroadcasting(true);
    try {
      const classIdVal = newNoticeClassId === 'global' ? null : newNoticeClassId;
      if (editingNoticeId) {
        const { error } = await supabase.from('announcements').update({
          title: newNoticeTitle.trim(),
          content: newNoticeContent.trim(),
          class_id: classIdVal
        }).eq('id', editingNoticeId);
        if (error) throw error;
        Alert.alert('Success', 'Notice updated successfully!');
      } else {
        const { error } = await supabase.from('announcements').insert({
          title: newNoticeTitle.trim(),
          content: newNoticeContent.trim(),
          class_id: classIdVal
        });
        if (error) throw error;
        Alert.alert('Broadcast Success', 'Notice sent successfully!');
      }

      handleCancelEdit();
      loadData();
    } catch (err: any) {
      Alert.alert('Save Failure', err.message || 'Error occurred');
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
            if (editingNoticeId === noticeId) handleCancelEdit();
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
      fontFamily: colors.fontFamilyBold,
      color: colors.textSecondary,
      marginTop: -2,
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

      {/* Announcements Notice Broadcaster Form */}
      <Text style={styles.title}>{editingNoticeId ? '✏️ Edit Notice' : '📢 Broadcast Notice'}</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Notice Headline</Text>
        <TextInput
          value={newNoticeTitle}
          onChangeText={setNewNoticeTitle}
          placeholder="e.g. CAS Lecture rescheduled today"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Target Division</Text>
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

        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Details / Description</Text>
        <TextInput
          value={newNoticeContent}
          onChangeText={setNewNoticeContent}
          placeholder="Enter announcements details here..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {editingNoticeId && (
            <TouchableOpacity 
              onPress={handleCancelEdit}
              style={[styles.btn, { backgroundColor: colors.border, flex: 1 }]}
            >
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={handleSaveNotice}
            disabled={broadcasting}
            style={[styles.btn, { flex: 2 }]}
          >
            {broadcasting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.btnText}>{editingNoticeId ? 'Update Notice' : 'Broadcast Notice'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Manage Existing Notices */}
      <Text style={styles.title}>📝 Active Notices</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : announcements.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, textAlign: 'center', marginTop: -2 }}>No active notices found.</Text>
        </View>
      ) : (
        announcements.map((item) => (
          <View key={item.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={{ fontSize: 13, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>{item.title}</Text>
              <Text style={{ fontSize: 10, fontFamily: colors.fontFamily, color: colors.textMuted, marginTop: -2 }}>
                {item.class_id ? 'Class Specific' : 'Global Broadcast'} • {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TouchableOpacity onPress={() => handleStartEdit(item)} style={{ padding: 6 }}>
                <Pencil size={16} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteNotice(item.id)} style={{ padding: 6 }}>
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
