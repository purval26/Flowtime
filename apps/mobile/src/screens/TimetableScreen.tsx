import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated
} from 'react-native';
import { TimetableEntry } from '@flowtime/types';
import {
  Clock,
  MapPin,
  Users,
  Filter,
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react-native';

const DAYS_OF_WEEK = [
  { value: 1, name: 'Mon' },
  { value: 2, name: 'Tue' },
  { value: 3, name: 'Wed' },
  { value: 4, name: 'Thu' },
  { value: 5, name: 'Fri' },
  { value: 6, name: 'Sat' },
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
  currentTime: Date;
}

export default function TimetableScreen({
  timetableMode,
  setTimetableMode,
  timetableDay,
  setTimetableDay,
  entries,
  colors,
  isDark,
  sortedTimeSlots,
  currentTime
}: TimetableScreenProps) {
  const activeTabX = React.useRef(new Animated.Value(timetableMode === 'tabs' ? 0 : 98)).current;

  React.useEffect(() => {
    Animated.timing(activeTabX, {
      toValue: timetableMode === 'tabs' ? 0 : 98,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [timetableMode]);
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

  const formatTimeTo12Hour = (time24: string) => {
    if (!time24) return '';
    const [hourStr, minStr] = time24.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minStr} ${ampm}`;
  };

  const getTimetableDateString = () => {
    const today = currentTime;
    const currentDay = today.getDay() === 0 ? 7 : today.getDay();
    const diff = timetableDay - currentDay;
    const targetDate = new Date(today.getTime());
    targetDate.setDate(today.getDate() + diff);
    return targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Centered Header Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 16 }}>
        {/* <View style={{ width: 24 }} /> Spacing placeholder to balance the filter icon */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>
          Timetable
        </Text>
        {/* <TouchableOpacity style={{ padding: 4 }}>
          <Filter size={20} color={colors.textPrimary} />
        </TouchableOpacity> */}
      </View>

      {/* Header Toggle to switch modes */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.title}>Layout View</Text>
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 20,
          padding: 2,
          position: 'relative',
          width: 200,
          height: 34,
          alignItems: 'center'
        }}>
          {/* Animated Sliding Background Pill */}
          <Animated.View style={{
            position: 'absolute',
            left: 2,
            top: 2,
            bottom: 2,
            width: 96,
            borderRadius: 18,
            backgroundColor: colors.accent,
            transform: [{ translateX: activeTabX }]
          }} />

          <TouchableOpacity
            onPress={() => setTimetableMode('tabs')}
            activeOpacity={0.8}
            style={{
              flex: 1,
              height: '100%',
              // alignItems: 'start',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: timetableMode === 'tabs' ? '#FFFFFF' : colors.textSecondary, textAlign:'center' }}>Single Day</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTimetableMode('all')}
            activeOpacity={0.8}
            style={{
              flex: 1,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: timetableMode === 'all' ? '#FFFFFF' : colors.textSecondary }}>All Days</Text>
          </TouchableOpacity>
        </View>
      </View>

      {timetableMode === 'tabs' ? (
        /* SINGLE DAY LAYOUT */
        <View>
          {/* Day selection horizontal scroll row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
          >
            {DAYS_OF_WEEK.map((d) => (
              <TouchableOpacity
                key={d.value}
                onPress={() => setTimetableDay(d.value)}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 20,
                  backgroundColor: timetableDay === d.value ? colors.accent : colors.surface,
                  borderWidth: 1,
                  borderColor: timetableDay === d.value ? colors.accent : colors.border,
                  marginRight: 0,
                  minWidth: 55,
                  alignItems: 'center'
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

          {/* Selected Day/Date Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.textPrimary }}>
              {getTimetableDateString()}
            </Text>
          </View>

          {/* Vertical schedule timeline */}
          {entries.filter((e) => e.day_of_week === timetableDay).length === 0 ? (
            <View style={styles.card}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center' }}>
                No lectures scheduled for this day.
              </Text>
            </View>
          ) : (
            <View>
              {entries.filter((e) => e.day_of_week === timetableDay)
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((item) => {
                  const isBreak = item.type === 'break';

                  // Resolve active class status
                  const today = currentTime;
                  const currentMinutes = today.getHours() * 60 + today.getMinutes();

                  const parseTimeToMinutes = (timeStr: string) => {
                    const [h, m] = timeStr.split(':').map(Number);
                    return h * 60 + m;
                  };

                  const start = parseTimeToMinutes(item.start_time);
                  const end = parseTimeToMinutes(item.end_time);
                  const isToday = today.getDay() === 0 ? 7 : today.getDay();
                  const isSameDay = timetableDay === isToday;

                  const status = !isSameDay ? 'UPCOMING' :
                    (currentMinutes >= end) ? 'COMPLETED' :
                      (currentMinutes >= start && currentMinutes < end) ? 'CURRENT' : 'UPCOMING';

                  const isCompleted = status === 'COMPLETED';
                  const isActive = status === 'CURRENT';

                  return (
                    <View key={item.id} style={{ flexDirection: 'row', gap: 12, minHeight: 80, alignItems: 'stretch' }}>

                      {/* Left Column: Stacked start/end times */}
                      <View style={{ width: 55, alignItems: 'flex-end', paddingTop: 6 }}>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: isActive ? colors.accent : colors.textPrimary }}>
                          {formatTimeTo12Hour(item.start_time)}
                        </Text>
                        <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>
                          {formatTimeTo12Hour(item.end_time)}
                        </Text>
                      </View>

                      {/* Right Column: Class Card */}
                      <View style={{ flex: 1, paddingBottom: 12 }}>
                        <View style={[
                          styles.card,
                          { marginBottom: 0, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                          isActive && { backgroundColor: colors.accentSoft, borderColor: colors.accent + '20' },
                          isCompleted && { opacity: 0.7 }
                        ]}>
                          <View style={{ flex: 1 }}>
                            <Text style={[
                              { fontSize: 14, fontWeight: 'bold', color: isActive ? colors.accent : colors.textPrimary },
                              // isCompleted && { textDecorationLine: 'line-through' }
                            ]}>
                              {isBreak ? (item.label || 'Break') : (`${item.subject?.name || 'Class Event'}${item.type === 'tutorial' ? ' (T)' : ''}`)}
                            </Text>
                            {!isBreak && item.professor && (
                              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                                {item.professor.short_name || item.professor.name}
                              </Text>
                            )}
                            {!isBreak && item.room && (
                              <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>
                                Room {item.room.name}
                              </Text>
                            )}
                          </View>

                          {/* Right Indicator (Checkmark for completed, LIVE badge for active, circle overlay for upcoming) */}
                          <View style={{ marginLeft: 8 }}>
                            {isCompleted ? (
                              <CheckCircle2 size={18} color={colors.success} />
                            ) : isActive ? (
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#FFFFFF' }}>Current</Text>
                                </View>
                                {/* <ChevronRight size={16} color={colors.accent} /> */}
                              </View>
                            ) : (
                              <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.border }} />
                            )}
                          </View>
                        </View>
                      </View>

                    </View>
                  );
                })}
            </View>
          )}
        </View>
      ) : (
        /* ALL DAYS WEEKLY MATRIX GRID TABLE */
        <View style={styles.card}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={{ width: 650 }}>
              {/* Grid Header */}
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8, backgroundColor: colors.background + '20' }}>
                <View style={{ width: 110, padding: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase' }}>Time Slot</Text>
                </View>
                {DAYS_OF_WEEK.map((day) => (
                  <View key={day.value} style={{ width: 90, padding: 4, alignItems: 'center' }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase' }}>{day.name}</Text>
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
                    <View style={{ width: 110, padding: 4 }}>
                      <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textPrimary }}>
                        {formatTimeTo12Hour(slot.start)} - {formatTimeTo12Hour(slot.end)}
                      </Text>
                    </View>

                    {/* Mon-Sat columns */}
                    {DAYS_OF_WEEK.map((day) => {
                      const cellEntries = entries.filter((e) => {
                        const entryStart = e.start_time.slice(0, 5);
                        const entryEnd = e.end_time.slice(0, 5);
                        return e.day_of_week === day.value && entryStart < slot.end && entryEnd > slot.start;
                      });

                      return (
                        <View key={day.value} style={{ width: 90, padding: 2, justifyContent: 'center' }}>
                          {cellEntries.map((entry) => {
                            const isBreak = entry.type === 'break';
                            const isLab = entry.type === 'lab';
                            return (
                              <View
                                key={entry.id}
                                style={{
                                  padding: 4,
                                  borderRadius: 4,
                                  borderWidth: 1,
                                  borderColor: isBreak ? colors.success + '40' : isLab ? colors.accent + '40' : colors.accent + '40',
                                  backgroundColor: isBreak ? colors.successSoft + '20' : isLab ? colors.accentSoft + '20' : colors.accentSoft + '20',
                                  marginVertical: 2,
                                  width: 86,
                                }}
                              >
                                <Text style={{ fontSize: 7, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase' }} numberOfLines={1}>
                                  {entry.type} {entry.room ? `• 📍${entry.room.name}` : ''}
                                </Text>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.textPrimary, marginTop: 1 }} numberOfLines={1}>
                                  {isBreak ? (entry.label || 'Break') : (entry.subject?.short_name || 'Class')}
                                </Text>
                                {!isBreak && entry.professor && (
                                  <Text style={{ fontSize: 7, color: colors.textMuted, marginTop: 1 }} numberOfLines={1}>
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
