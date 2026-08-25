import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { TimetableEntry } from '@flowtime/types';
import { 
  Clock, 
  MapPin, 
  Users
} from 'lucide-react-native';

const DAYS_OF_WEEK = [
  { value: 1, name: 'Mon' },
  { value: 2, name: 'Tue' },
  { value: 3, name: 'Wed' },
  { value: 4, name: 'Thu' },
  { value: 5, name: 'Fri' },
];

interface TimetableScreenProps {
  timetableMode: 'tabs' | 'all';
  setTimetableMode: (mode: 'tabs' | 'all') => void;
  timetableDay: number;
  setTimetableDay: (day: number) => void;
  entries: TimetableEntry[];
  colors: any;
  isDark: boolean;
  sortedTimeSlots: { start: string; end: string }[];
}

export default function TimetableScreen({
  timetableMode,
  setTimetableMode,
  timetableDay,
  setTimetableDay,
  entries,
  colors,
  isDark,
  sortedTimeSlots
}: TimetableScreenProps) {
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
    },
    toggleBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    }
  });

  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Header Toggle */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.title}>Timetable Layout</Text>
        
        <View style={{ flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 2 }}>
          <TouchableOpacity 
            onPress={() => setTimetableMode('tabs')}
            style={[styles.toggleBtn, timetableMode === 'tabs' && { backgroundColor: colors.accent, borderColor: colors.accent }]}
          >
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: timetableMode === 'tabs' ? '#FFFFFF' : colors.textSecondary }}>Single Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setTimetableMode('all')}
            style={[styles.toggleBtn, timetableMode === 'all' && { backgroundColor: colors.accent, borderColor: colors.accent }]}
          >
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: timetableMode === 'all' ? '#FFFFFF' : colors.textSecondary }}>All Days</Text>
          </TouchableOpacity>
        </View>
      </View>

      {timetableMode === 'tabs' ? (
        /* SINGLE DAY LAYOUT */
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {DAYS_OF_WEEK.map((d) => (
              <TouchableOpacity
                key={d.value}
                onPress={() => setTimetableDay(d.value)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: timetableDay === d.value ? colors.accent : colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginRight: 8,
                }}
              >
                <Text style={{ 
                  fontSize: 13, 
                  fontWeight: 'bold', 
                  color: timetableDay === d.value ? '#FFFFFF' : colors.textSecondary 
                }}>
                  {d.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.title}>Timetable Slots</Text>
          {entries.filter((e) => e.day_of_week === timetableDay).length === 0 ? (
            <View style={styles.card}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center' }}>
                No lectures scheduled for this day.
              </Text>
            </View>
          ) : (
            entries.filter((e) => e.day_of_week === timetableDay)
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map((item) => {
                const isBreak = item.type === 'break';
                return (
                  <View key={item.id} style={[styles.card, isBreak && { backgroundColor: colors.background, borderStyle: 'dashed' }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: colors.textPrimary }}>
                          {isBreak ? '☕ Daily Break' : item.subject?.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                          {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                        </Text>
                        {!isBreak && (
                          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <MapPin size={12} color={colors.textSecondary} />
                              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                                Room {item.room?.name}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Users size={12} color={colors.textSecondary} />
                              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                                {item.professor?.short_name}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
          )}
        </View>
      ) : (
        /* ALL DAYS WEEKLY MATRIX GRID TABLE */
        <View style={styles.card}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={{ width: 750 }}>
              {/* Grid Header */}
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8, backgroundColor: colors.background + '20' }}>
                <View style={{ width: 100, padding: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase' }}>Time Slot</Text>
                </View>
                {DAYS_OF_WEEK.map((day) => (
                  <View key={day.value} style={{ width: 130, padding: 6, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase' }}>{day.name}</Text>
                  </View>
                ))}
              </View>

              {/* Grid Body Time Rows */}
              {sortedTimeSlots.length === 0 ? (
                <Text style={{ padding: 20, textAlign: 'center', color: colors.textSecondary, fontStyle: 'italic', fontSize: 12 }}>No classes scheduled for the week.</Text>
              ) : (
                sortedTimeSlots.map((slot) => (
                  <View key={`${slot.start}-${slot.end}`} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, minHeight: 65, alignItems: 'center' }}>
                    {/* Time boundary column */}
                    <View style={{ width: 100, padding: 6 }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.textPrimary }}>{slot.start} - {slot.end}</Text>
                    </View>

                    {/* Mon-Fri columns */}
                    {DAYS_OF_WEEK.map((day) => {
                      const cellEntries = entries.filter((e) => {
                        const entryStart = e.start_time.slice(0, 5);
                        const entryEnd = e.end_time.slice(0, 5);
                        return e.day_of_week === day.value && entryStart < slot.end && entryEnd > slot.start;
                      });

                      return (
                        <View key={day.value} style={{ width: 130, padding: 4, justifyContent: 'center' }}>
                          {cellEntries.map((entry) => {
                            const isBreak = entry.type === 'break';
                            const isLab = entry.type === 'lab';
                            return (
                              <View 
                                key={entry.id} 
                                style={{
                                  padding: 6,
                                  borderRadius: 4,
                                  borderWidth: 1,
                                  borderColor: isBreak ? 'rgba(217,119,6,0.3)' : isLab ? 'rgba(147,51,234,0.3)' : 'rgba(37,99,235,0.3)',
                                  backgroundColor: isBreak ? 'rgba(217,119,6,0.05)' : isLab ? 'rgba(147,51,234,0.05)' : 'rgba(37,99,235,0.05)',
                                  marginVertical: 2,
                                  width: 122,
                                }}
                              >
                                <Text style={{ fontSize: 8, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase' }} numberOfLines={1}>
                                  {entry.type} {entry.room ? `• 📍${entry.room.name}` : ''}
                                </Text>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.textPrimary, marginTop: 1 }} numberOfLines={1}>
                                  {isBreak ? (entry.label || 'Break') : (entry.subject?.short_name || 'Class')}
                                </Text>
                                {!isBreak && entry.professor && (
                                  <Text style={{ fontSize: 8, color: colors.textMuted, marginTop: 1 }} numberOfLines={1}>
                                    👨‍🏫 {entry.professor.short_name || entry.professor.name}
                                  </Text>
                                )}
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
