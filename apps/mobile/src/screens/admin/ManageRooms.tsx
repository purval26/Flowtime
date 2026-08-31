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

interface Room {
  id: string;
  name: string;
  building: string;
  capacity?: number;
}

interface ManageRoomsProps {
  colors: any;
  onBack: () => void;
}

export default function ManageRooms({ colors, onBack }: ManageRoomsProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');
      if (error) throw error;
      setRooms(data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleStartEdit = (room: Room) => {
    setEditingRoomId(room.id);
    setName(room.name);
    setBuilding(room.building);
    setCapacity(room.capacity ? room.capacity.toString() : '');
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setName('');
    setBuilding('');
    setCapacity('');
  };

  const handleSaveRoom = async () => {
    if (!name.trim() || !building.trim()) {
      Alert.alert('Validation Error', 'Please enter Room Name and Building.');
      return;
    }
    setSubmitting(true);
    try {
      const capInt = capacity ? parseInt(capacity, 10) : null;
      if (editingRoomId) {
        const { error } = await supabase
          .from('rooms')
          .update({ name: name.trim(), building: building.trim(), capacity: capInt })
          .eq('id', editingRoomId);
        if (error) throw error;
        Alert.alert('Success', 'Classroom room updated successfully!');
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert({ name: name.trim(), building: building.trim(), capacity: capInt });
        if (error) throw error;
        Alert.alert('Success', 'Classroom room added successfully!');
      }

      handleCancelEdit();
      fetchRooms();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Delete room "${name}"? Timetable entries in this room will lose their room assignment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('rooms')
                .delete()
                .eq('id', id);
              if (error) throw error;
              Alert.alert('Success', 'Room deleted');
              if (editingRoomId === id) handleCancelEdit();
              fetchRooms();
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

      {/* Add / Edit Room Form */}
      <Text style={styles.title}>{editingRoomId ? '✏️ Edit Room / Lab' : '📍 Create Room / Lab'}</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Room Name / Number</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Lab 3A or Room 402"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Building / Block</Text>
        <TextInput
          value={building}
          onChangeText={setBuilding}
          placeholder="e.g. Main Block"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={{ fontSize: 12, fontFamily: colors.fontFamilySemiBold, color: colors.textSecondary, marginBottom: 6, marginTop: -2 }}>Seating Capacity (Optional)</Text>
        <TextInput
          value={capacity}
          onChangeText={setCapacity}
          placeholder="e.g. 60"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {editingRoomId && (
            <TouchableOpacity onPress={handleCancelEdit} style={[styles.btn, { backgroundColor: colors.border, flex: 1 }]}>
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSaveRoom} disabled={submitting} style={[styles.btn, { flex: 2 }]}>
            {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : (
              <>
                {editingRoomId ? <Pencil size={16} color="#FFFFFF" /> : <Plus size={16} color="#FFFFFF" />}
                <Text style={styles.btnText}>{editingRoomId ? 'Update Room' : 'Add Room'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Rooms List */}
      <Text style={styles.title}>📋 Existing Rooms</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : rooms.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, textAlign: 'center', marginTop: -2 }}>No rooms configured yet.</Text>
        </View>
      ) : (
        rooms.map((room) => (
          <View key={room.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }]}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>{room.name}</Text>
              <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, marginTop: -2 }}>Building: {room.building} {room.capacity ? `• Capacity: ${room.capacity}` : ''}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TouchableOpacity onPress={() => handleStartEdit(room)} style={{ padding: 6 }}>
                <Pencil size={16} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteRoom(room.id, room.name)} style={{ padding: 6 }}>
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
