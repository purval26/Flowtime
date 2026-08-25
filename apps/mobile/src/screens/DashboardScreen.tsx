import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { TimetableEntry, Announcement } from '@flowtime/types';
import { 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2
} from 'lucide-react-native';

interface DashboardScreenProps {
  currentTime: Date;
  announcements: Announcement[];
  todaySchedule: TimetableEntry[];
  activeLecture: TimetableEntry | undefined;
  nextLecture: TimetableEntry | undefined;
  colors: any;
  isDark: boolean;
  getGreeting: () => string;
  formattedDate: string;
  getFormattedRemainingTime: (entry: TimetableEntry) => string;
  getFormattedTimeUntilNext: (entry: TimetableEntry) => string;
  getProgressBarPercentage: (entry: TimetableEntry) => number;
  getClassStatus: (entry: TimetableEntry) => string;
}

export default function DashboardScreen({
  announcements,
  todaySchedule,
  activeLecture,
  nextLecture,
  colors,
  isDark,
  getGreeting,
  formattedDate,
  getFormattedRemainingTime,
  getFormattedTimeUntilNext,
  getProgressBarPercentage,
  getClassStatus
}: DashboardScreenProps) {
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
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      fontSize: 9,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    }
  });

  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Date Greeting Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {getGreeting()}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginTop: 2 }}>
          {formattedDate}
        </Text>
      </View>

      {/* Announcements Notice Board */}
      {announcements.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.title}>📢 Notices & Announcements</Text>
          {announcements.slice(0, 3).map((item) => {
            const isNew = new Date().getTime() - new Date(item.created_at).getTime() < 24 * 60 * 60 * 1000;
            const isGlobal = !item.class_id;
            return (
              <View key={item.id} style={styles.card}>
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {isGlobal ? (
                    <Text style={[styles.badge, { backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#EFF6FF', color: colors.accent }]}>
                      Global Broadcast
                    </Text>
                  ) : (
                    <Text style={[styles.badge, { backgroundColor: isDark ? 'rgba(147,51,234,0.15)' : '#FAF5FF', color: '#9333EA' }]}>
                      Class Notice
                    </Text>
                  )}
                  {isNew && (
                    <Text style={[styles.badge, { backgroundColor: colors.successSoft, color: colors.success }]}>
                      New
                    </Text>
                  )}
                  <Text style={{ fontSize: 10, color: colors.textSecondary }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.textPrimary }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 18 }}>
                  {item.content}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Class Schedule Section Title */}
      <Text style={styles.title}>⏱ Current & Upcoming Classes</Text>

      {/* Active Lecture Countdown */}
      {activeLecture ? (
        <View style={[styles.card, { borderColor: colors.accent, borderWidth: 1.5 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.badge, { backgroundColor: colors.successSoft, color: colors.success }]}>
              Current Class (LIVE)
            </Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.textPrimary, marginTop: 8 }}>
            {activeLecture.type === 'break' ? '☕ Daily Break' : activeLecture.subject?.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
              {activeLecture.start_time.slice(0, 5)} - {activeLecture.end_time.slice(0, 5)}
            </Text>
          </View>
          
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.accent }}>
              {getFormattedRemainingTime(activeLecture)}
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary }}>
              {Math.round(getProgressBarPercentage(activeLecture))}%
            </Text>
          </View>
          <View style={{ width: '100%', backgroundColor: colors.border, height: 8, borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ backgroundColor: colors.accent, height: '100%', width: `${getProgressBarPercentage(activeLecture)}%` }} />
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: colors.textPrimary }}>😌 No Ongoing Class</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
            You are currently free. Check the schedule timeline below.
          </Text>
        </View>
      )}

      {/* Up Next Card */}
      {nextLecture && (
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.badge, { backgroundColor: colors.accentSoft, color: colors.accent }]}>
              Next Class
            </Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.accent }}>
              {getFormattedTimeUntilNext(nextLecture)}
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginTop: 8 }}>
            {nextLecture.type === 'break' ? '☕ Daily Break' : nextLecture.subject?.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
              {nextLecture.start_time.slice(0, 5)} - {nextLecture.end_time.slice(0, 5)}
            </Text>
          </View>
          {nextLecture.type !== 'break' && nextLecture.room && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                Room {nextLecture.room?.name}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Today's schedule list timeline */}
      <Text style={styles.title}>📅 Today's Timeline</Text>
      {todaySchedule.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>
            No classes scheduled for today.
          </Text>
        </View>
      ) : (
        <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface }}>
          {todaySchedule.map((item, index) => {
            const isBreak = item.type === 'break';
            const status = getClassStatus(item);
            const isCompleted = status === 'COMPLETED';
            const isActive = status === 'CURRENT';

            return (
              <View 
                key={item.id} 
                style={[
                  { padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
                  index < todaySchedule.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  isCompleted && { opacity: 0.6, backgroundColor: colors.background + '25' },
                  isActive && { borderLeftWidth: 4, borderLeftColor: colors.accent, backgroundColor: colors.accentSoft + '10' }
                ]}
              >
                {/* Status Checkmark */}
                <View style={{ marginTop: 2 }}>
                  {isCompleted ? (
                    <CheckCircle2 size={18} color={colors.success} />
                  ) : isActive ? (
                    <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />
                    </View>
                  ) : (
                    <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.border }} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[
                    { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary },
                    isCompleted && { textDecorationLine: 'line-through', color: colors.textSecondary }
                  ]}>
                    {isBreak ? (item.label || 'Break') : (item.subject?.name || 'Class Event')}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} color={colors.textMuted} />
                      <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                        {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                      </Text>
                    </View>
                    {!isBreak && item.room && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} color={colors.textMuted} />
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                          Room {item.room.name}
                        </Text>
                      </View>
                    )}
                    {!isBreak && item.professor && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Users size={12} color={colors.textMuted} />
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                          {item.professor.short_name || item.professor.name}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
