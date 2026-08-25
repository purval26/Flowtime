import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Switch,
  Platform
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Class, Timetable, TimetableEntry } from '@flowtime/types';
import { Plus, Trash2, ArrowLeft, Calendar, Users, MapPin, Clock } from 'lucide-react-native';

const DAYS_OF_WEEK = [
  { value: 1, name: 'Mon' },
  { value: 2, name: 'Tue' },
  { value: 3, name: 'Wed' },
  { value: 4, name: 'Thu' },
  { value: 5, name: 'Fri' },
];

interface ManageTimetablesProps {
  colors: any;
  onBack: () => void;
}

export default function ManageTimetables({ colors, onBack }: ManageTimetablesProps) {
  // Navigation states
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);

  // Global lists
  const [classes, setClasses] = useState<Class[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Timetable Form states
  const [timetableName, setTimetableName] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Timetable Entry Form states
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [entryDay, setEntryDay] = useState(1);
  const [entryType, setEntryType] = useState<'lecture' | 'lab' | 'break'>('lecture');
  const [startTime, setStartTime] = useState('09:15');
  const [endTime, setEndTime] = useState('10:15');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedProfId, setSelectedProfId] = useState('');
  const [entryLabel, setEntryLabel] = useState('');
  const [addingEntry, setAddingEntry] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classRes, timetableRes, subRes, roomRes, profRes] = await Promise.all([
        supabase.from('classes').select('*').order('name'),
        supabase.from('timetables').select('*').order('created_at', { ascending: false }),
        supabase.from('subjects').select('*').order('name'),
        supabase.from('rooms').select('*').order('name'),
        supabase.from('professors').select('*').order('name'),
      ]);

      setClasses(classRes.data || []);
      setTimetables(timetableRes.data || []);
      setSubjects(subRes.data || []);
      setRooms(roomRes.data || []);
      setProfessors(profRes.data || []);

      if (classRes.data && classRes.data.length > 0) {
        setSelectedClassId(classRes.data[0].id);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async (timetableId: string) => {
    try {
      const { data, error } = await supabase
        .from('timetable_entries')
        .select(`
          *,
          subject:subjects (*),
          room:rooms (*),
          professor:professors (*)
        `)
        .eq('timetable_id', timetableId)
        .order('day_of_week')
        .order('start_time');
      if (error) throw error;
      setEntries(data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load entries');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedTimetable) {
      loadEntries(selectedTimetable.id);
    }
  }, [selectedTimetable]);

  const handleAddTimetable = async () => {
    if (!timetableName.trim() || !selectedClassId) {
      Alert.alert('Validation Error', 'Please enter a name and select a class.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('timetables')
        .insert({
          name: timetableName.trim(),
          class_id: selectedClassId,
          is_active: false,
          effective_from: effectiveFrom
        });
      if (error) throw error;
      Alert.alert('Success', 'Timetable created successfully!');
      setTimetableName('');
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create timetable');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (timetable: Timetable, newValue: boolean) => {
    try {
      if (newValue) {
        // Deactivate other timetables for this class first matching web logic
        await supabase
          .from('timetables')
          .update({ is_active: false })
          .eq('class_id', timetable.class_id);
      }
      
      const { error } = await supabase
        .from('timetables')
        .update({ is_active: newValue })
        .eq('id', timetable.id);

      if (error) throw error;
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleDeleteTimetable = async (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Delete timetable "${name}"? This will clear all schedules within it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('timetables').delete().eq('id', id);
              if (error) throw error;
              loadData();
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          }
        }
      ]
    );
  };

  const handleAddEntry = async () => {
    if (!selectedTimetable) return;
    
    // Add times suffix formatting e.g. "09:15" -> "09:15:00"
    const startFmt = startTime.includes(':') && startTime.split(':').length === 2 ? `${startTime}:00` : startTime;
    const endFmt = endTime.includes(':') && endTime.split(':').length === 2 ? `${endTime}:00` : endTime;

    if (entryType !== 'break' && !selectedSubjectId) {
      Alert.alert('Validation Error', 'Please select a Subject.');
      return;
    }

    setAddingEntry(true);
    try {
      const { error } = await supabase
        .from('timetable_entries')
        .insert({
          timetable_id: selectedTimetable.id,
          day_of_week: entryDay,
          type: entryType,
          start_time: startFmt,
          end_time: endFmt,
          subject_id: entryType === 'break' ? null : selectedSubjectId,
          room_id: entryType === 'break' ? null : (selectedRoomId || null),
          professor_id: entryType === 'break' ? null : (selectedProfId || null),
          label: entryType === 'break' ? (entryLabel.trim() || 'Break') : null
        });

      if (error) throw error;
      Alert.alert('Success', 'Timetable slot added!');
      setEntryLabel('');
      loadEntries(selectedTimetable.id);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add entry');
    } finally {
      setAddingEntry(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase.from('timetable_entries').delete().eq('id', id);
      if (error) throw error;
      if (selectedTimetable) loadEntries(selectedTimetable.id);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
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
    selectContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 12,
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

  if (selectedTimetable) {
    /* SUB-SCREEN: EDIT SPECIFIC TIMETABLE SLOTS */
    const timetableClass = classes.find((c) => c.id === selectedTimetable.class_id);
    
    return (
      <View style={{ paddingBottom: 32 }}>
        <TouchableOpacity 
          onPress={() => setSelectedTimetable(null)} 
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}
        >
          <ArrowLeft size={16} color={colors.accent} />
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.accent }}>Back to Timetables List</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🛠 Edit Schedule: "{selectedTimetable.name}"</Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 16 }}>
          Class Division: {timetableClass?.name} ({timetableClass?.section})
        </Text>

        {/* Add Entry Slot Form */}
        <View style={styles.card}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 10 }}>➕ Add New Schedule Slot</Text>
          
          {/* Select Day */}
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6 }}>Day of Week</Text>
          <View style={styles.selectContainer}>
            {DAYS_OF_WEEK.map((d) => (
              <TouchableOpacity
                key={d.value}
                onPress={() => setEntryDay(d.value)}
                style={[styles.badgeOption, entryDay === d.value && styles.badgeOptionSelected]}
              >
                <Text style={[styles.badgeText, entryDay === d.value && styles.badgeTextSelected]}>{d.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Select Type */}
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6 }}>Class Type</Text>
          <View style={styles.selectContainer}>
            {['lecture', 'lab', 'break'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setEntryType(type as any)}
                style={[styles.badgeOption, entryType === type && styles.badgeOptionSelected]}
              >
                <Text style={[styles.badgeText, entryType === type && styles.badgeTextSelected, { textTransform: 'capitalize', fontSize: 11, color: entryType === type ? '#FFFFFF' : colors.textSecondary }]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start & End Times */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6 }}>Start Time (HH:MM)</Text>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                placeholder="09:15"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6 }}>End Time (HH:MM)</Text>
              <TextInput
                value={endTime}
                onChangeText={setEndTime}
                placeholder="10:15"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          </View>

          {entryType === 'break' ? (
            <View>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6 }}>Break Label (Optional)</Text>
              <TextInput
                value={entryLabel}
                onChangeText={setEntryLabel}
                placeholder="e.g. Lunch Break"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          ) : (
            <View>
              {/* Select Subject */}
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6 }}>Subject</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {subjects.map((sub) => (
                  <TouchableOpacity
                    key={sub.id}
                    onPress={() => setSelectedSubjectId(sub.id)}
                    style={[styles.badgeOption, selectedSubjectId === sub.id && styles.badgeOptionSelected, { marginRight: 6 }]}
                  >
                    <Text style={[styles.badgeText, selectedSubjectId === sub.id && styles.badgeTextSelected]}>{sub.short_name || sub.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Select Room */}
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6 }}>Classroom Room</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => setSelectedRoomId('')}
                  style={[styles.badgeOption, selectedRoomId === '' && styles.badgeOptionSelected, { marginRight: 6 }]}
                >
                  <Text style={[styles.badgeText, selectedRoomId === '' && styles.badgeTextSelected]}>None</Text>
                </TouchableOpacity>
                {rooms.map((room) => (
                  <TouchableOpacity
                    key={room.id}
                    onPress={() => setSelectedRoomId(room.id)}
                    style={[styles.badgeOption, selectedRoomId === room.id && styles.badgeOptionSelected, { marginRight: 6 }]}
                  >
                    <Text style={[styles.badgeText, selectedRoomId === room.id && styles.badgeTextSelected]}>{room.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Select Professor */}
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6 }}>Professor</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => setSelectedProfId('')}
                  style={[styles.badgeOption, selectedProfId === '' && styles.badgeOptionSelected, { marginRight: 6 }]}
                >
                  <Text style={[styles.badgeText, selectedProfId === '' && styles.badgeTextSelected]}>None</Text>
                </TouchableOpacity>
                {professors.map((prof) => (
                  <TouchableOpacity
                    key={prof.id}
                    onPress={() => setSelectedProfId(prof.id)}
                    style={[styles.badgeOption, selectedProfId === prof.id && styles.badgeOptionSelected, { marginRight: 6 }]}
                  >
                    <Text style={[styles.badgeText, selectedProfId === prof.id && styles.badgeTextSelected]}>{prof.short_name || prof.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity onPress={handleAddEntry} disabled={addingEntry} style={styles.btn}>
            {addingEntry ? <ActivityIndicator size="small" color="#FFFFFF" /> : (
              <>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.btnText}>Add Schedule Entry</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Existing Entries List grouped by Day */}
        <Text style={styles.title}>📋 Schedule Slots ({entries.length})</Text>
        {DAYS_OF_WEEK.map((day) => {
          const daySlots = entries.filter((e) => e.day_of_week === day.value);
          return (
            <View key={day.value} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase' }}>
                {day.name} Schedule
              </Text>
              {daySlots.length === 0 ? (
                <View style={[styles.card, { padding: 10 }]}><Text style={{ fontSize: 11, color: colors.textMuted }}>No slots scheduled.</Text></View>
              ) : (
                daySlots.map((item) => {
                  const isBreak = item.type === 'break';
                  return (
                    <View key={item.id} style={[styles.card, { padding: 12, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, isBreak && { borderStyle: 'dashed' }]}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.textPrimary }}>
                          {isBreak ? `☕ Break (${item.label})` : item.subject?.name}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <Clock size={11} color={colors.textSecondary} />
                            <Text style={{ fontSize: 10, color: colors.textSecondary }}>{item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</Text>
                          </View>
                          {!isBreak && item.room && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                              <MapPin size={11} color={colors.textSecondary} />
                              <Text style={{ fontSize: 10, color: colors.textSecondary }}>{item.room.name}</Text>
                            </View>
                          )}
                          {!isBreak && item.professor && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                              <Users size={11} color={colors.textSecondary} />
                              <Text style={{ fontSize: 10, color: colors.textSecondary }}>{item.professor.short_name}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteEntry(item.id)} style={{ padding: 6 }}>
                        <Trash2 size={15} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          );
        })}
      </View>
    );
  }

  /* LIST OF TIMETABLES FOR CLASSES */
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

      {/* Add Timetable Form */}
      <Text style={styles.title}>📅 Create Timetable Version</Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Timetable Name</Text>
        <TextInput
          value={timetableName}
          onChangeText={setTimetableName}
          placeholder="e.g. Fall Semester 2026 V1"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Class Section</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {classes.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              onPress={() => setSelectedClassId(cls.id)}
              style={[styles.badgeOption, selectedClassId === cls.id && styles.badgeOptionSelected, { marginRight: 6 }]}
            >
              <Text style={[styles.badgeText, selectedClassId === cls.id && styles.badgeTextSelected]}>{cls.name} ({cls.section})</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Effective From Date</Text>
        <TextInput
          value={effectiveFrom}
          onChangeText={setEffectiveFrom}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleAddTimetable} disabled={submitting} style={styles.btn}>
          {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : (
            <>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.btnText}>Create Timetable</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Timetables list */}
      <Text style={styles.title}>📋 Timetables Configured</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : timetables.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>No timetables created yet.</Text>
        </View>
      ) : (
        timetables.map((item) => {
          const tClass = classes.find((c) => c.id === item.class_id);
          return (
            <View key={item.id} style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.textPrimary }}>{item.name}</Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                    Class: {tClass?.name || 'Unknown'} ({tClass?.section || '?'}) • Effective: {item.effective_from}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteTimetable(item.id, item.name)} style={{ padding: 6 }}>
                  <Trash2 size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>Active Timetable:</Text>
                  <Switch
                    value={item.is_active}
                    onValueChange={(val) => handleToggleActive(item, val)}
                    thumbColor={Platform.OS === 'android' ? (item.is_active ? colors.accent : '#F3F4F6') : undefined}
                    trackColor={{ false: '#D1D5DB', true: colors.accent + '60' }}
                  />
                </View>
                <TouchableOpacity 
                  onPress={() => setSelectedTimetable(item)}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: colors.accentSoft }}
                >
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.accent }}>Edit Schedule Slots</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
