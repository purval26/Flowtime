import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { TimetableEntry, Announcement } from '@flowtime/types';
import {
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Menu,
  Bell,
  BookOpen,
  ChevronRight,
  ArrowRightIcon
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
  getUserName: () => string;
  formattedDate: string;
  getFormattedRemainingTime: (entry: TimetableEntry) => string;
  getFormattedTimeUntilNext: (entry: TimetableEntry) => string;
  getProgressBarPercentage: (entry: TimetableEntry) => number;
  getClassStatus: (entry: TimetableEntry) => string;
  unreadCount: number;
  onOpenAnnouncements: () => void;
  refreshing: boolean;
  onRefresh: () => void;
}

const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return '';
  const [hourStr, minStr] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minStr} ${ampm}`;
};

export default function DashboardScreen({
  announcements,
  todaySchedule,
  activeLecture,
  nextLecture,
  colors,
  isDark,
  getGreeting,
  getUserName,
  formattedDate,
  getFormattedRemainingTime,
  getFormattedTimeUntilNext,
  getProgressBarPercentage,
  getClassStatus,
  unreadCount,
  onOpenAnnouncements,
  refreshing,
  onRefresh
}: DashboardScreenProps) {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    activeCard: {
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
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
      {/* Custom Header Row with Hamburger Menu & Notification Bell */}
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      </View> */}

      {/* Greeting Title */}
      <View style={{ marginBottom: 20, flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary }}>
            {getGreeting()},
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary }}>
            {getUserName()} 👋
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
            {formattedDate}
          </Text>
        </View>
        <TouchableOpacity onPress={onOpenAnnouncements} style={{ padding: 4 }}>
          <View>
            <Bell size={24} color={colors.textPrimary} />
            {unreadCount > 0 && (
              <View style={{
                position: 'absolute',
                right: -4,
                top: -4,
                backgroundColor: colors.danger,
                borderRadius: 8,
                width: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: colors.surface
              }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#FFFFFF' }}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Announcements Notice Board */}
      {/* {announcements.length > 0 && (
        <View style={{ marginBottom: 0 }}>
          <Text style={styles.title}>📢 Notices & Announcements</Text>
          {announcements.slice(0, 1).map((item) => {
            const isNew = new Date().getTime() - new Date(item.created_at).getTime() < 24 * 60 * 60 * 1000;
            const isGlobal = !item.class_id;
            return (
              <View key={item.id} style={styles.card}>
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {isGlobal ? (
                    <Text style={[styles.badge, { backgroundColor: colors.accentSoft, color: colors.accent }]}>
                      Global Broadcast
                    </Text>
                  ) : (
                    <Text style={[styles.badge, { backgroundColor: colors.successSoft, color: colors.success }]}>
                      Class Notice
                    </Text>
                  )}
                  {isNew && (
                    <Text style={[styles.badge, { backgroundColor: colors.dangerSoft, color: colors.danger }]}>
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

      <View style={{height:"1px", backgroundColor: colors.textSecondary, padding: 1, borderRadius: 25, marginBottom: 8}}></View> */}

      {/* Active Lecture Countdown Card */}
      {activeLecture ? (
        <View style={styles.activeCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              {/* <Text style={{ width: 95, textAlign: "center", fontSize: 10, fontWeight: 'bold', backgroundColor: colors.surface, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, borderRadius: 6, paddingHorizontal: 2 }}>
                CURRENT CLASS
              </Text> */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Left Text */}
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.textPrimary }}>
                  {`${activeLecture.type === 'break' ? 'Break' : activeLecture.subject?.short_name}(${activeLecture.type.toUpperCase().slice(0, 1)})`}
                </Text>

                {/* Arrow Icon with side spacing */}
                <ArrowRightIcon size={20} color={colors.textPrimary} style={{ marginHorizontal: 4 }} />

                {/* Right Text */}
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.textPrimary }}>
                  {`${nextLecture?.type === 'break' ? 'Break' : nextLecture?.subject?.short_name}(${nextLecture?.type.toUpperCase().slice(0, 1)})`}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
                {formatTimeTo12Hour(activeLecture.start_time.slice(0, 5))} - {formatTimeTo12Hour(activeLecture.end_time.slice(0, 5))}
              </Text>
              {activeLecture.room && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Room {activeLecture.room?.name}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ alignItems: 'flex-end', gap: 12 }}>
              {/* LIVE Badge */}
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.success }}>LIVE</Text>
              </View>
              {/* Circular Book Icon */}
              {/* <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color={colors.accent} />
              </View> */}
            </View>
          </View>

          {/* Progress Section */}
          <View style={{ marginTop: 16 }}>
            {/* Progress Bar Track & Fill */}
            <View style={{ width: '100%', backgroundColor: colors.border, height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
              <View style={{ backgroundColor: colors.accent, height: '100%', width: `${getProgressBarPercentage(activeLecture)}%` }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.accent }}>
                {getFormattedRemainingTime(activeLecture)}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                {Math.round(getProgressBarPercentage(activeLecture))}% completed
              </Text>
            </View>
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
      {/* {nextLecture && (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                NEXT CLASS
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>
                {nextLecture.type === 'break' ? '☕ Daily Break' : nextLecture.subject?.name}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
                {nextLecture.start_time.slice(0, 5)} - {nextLecture.end_time.slice(0, 5)}
              </Text>
              {nextLecture.type !== 'break' && nextLecture.room && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Room {nextLecture.room?.name}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ alignItems: 'flex-end', gap: 12 }}>
              Circular Book Icon
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color={colors.accent} />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>Starts in</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.accent, marginTop: 2 }}>
                {getFormattedTimeUntilNext(nextLecture)}
              </Text>
            </View>
          </View>
        </View>
      )} */}

      {/* Today's Schedule Section Title with "View full" link */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
        <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          TODAY'S SCHEDULE
        </Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.accent }}>View full</Text>
        </TouchableOpacity>
      </View>

      {todaySchedule.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>
            No classes scheduled for today.
          </Text>
        </View>
      ) : (
        <View style={{ paddingLeft: 0 }}>
          {todaySchedule.map((item, index) => {
            const isBreak = item.type === 'break';
            const status = getClassStatus(item);
            const isCompleted = status === 'COMPLETED';
            const isActive = status === 'CURRENT';
            const progress = getProgressBarPercentage(item);
            const progressClamped = Math.max(0, Math.min(100, progress));

            return (
              <View key={item.id} style={{ flexDirection: 'row', gap: 12, minHeight: 70, alignItems: 'stretch' }}>

                {/* Left Column: Time boundary */}
                <View style={{ alignItems: 'flex-end', paddingTop: 4, width: 50 }}>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: isActive ? colors.accent : colors.textSecondary }}>
                    {formatTimeTo12Hour(item.start_time)}
                  </Text>
                </View>

                {/* Middle Column: Vertical Line & Node indicator */}
                <View style={{ alignItems: 'center', width: 24 }}>
                  {/* Circle Indicator */}
                  {isCompleted ? (
                    <View style={{ zIndex: 1, backgroundColor: colors.background, padding: 2 }}>
                      <CheckCircle2 size={16} color={colors.success} />
                    </View>
                  ) : isActive ? (
                    <View style={{ zIndex: 1, width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: colors.accent, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
                    </View>
                  ) : (
                    <View style={{ zIndex: 1, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface }} />
                  )}
                  {/* Connecting Line segment */}
                  {index < todaySchedule.length - 1 && (
                    isCompleted ? (
                      <View style={{ flex: 1, width: 2, backgroundColor: colors.success, marginVertical: 4 }} />
                    ) : isActive ? (
                      <View style={{ flex: 1, width: 2, marginVertical: 4, overflow: 'hidden', borderRadius: 1 }}>
                        <View style={{ height: `${progressClamped}%`, backgroundColor: colors.accent, width: '100%' }} />
                        <View style={{ height: `${100 - progressClamped}%`, backgroundColor: colors.border, width: '100%' }} />
                      </View>
                    ) : (
                      <View style={{ flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 4 }} />
                    )
                  )}
                </View>

                {/* Right Column: Class Card */}
                <View style={{ flex: 1, paddingBottom: 16 }}>
                  <View style={[
                    styles.card,
                    { marginBottom: 0, paddingVertical: 12, paddingHorizontal: 16 },
                    isActive && { backgroundColor: colors.accentSoft, borderColor: colors.accent + '20' },
                    isCompleted && { opacity: 0.6 }
                  ]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary },
                          isCompleted && { textDecorationLine: 'line-through' }
                        ]}>
                          {isBreak ? (item.label || 'Break') : (`${item.subject?.short_name} (${item.type.toUpperCase().slice(0,1)})` || 'Class Event')}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                          {item.type !== 'break' && item.professor?.short_name ? `${item.professor.short_name} ` : ''}
                          {/* {item.start_time.slice(0, 5)} — {item.end_time.slice(0, 5)} */}
                        </Text>
                        {!isBreak && item.room && (
                          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                            Room {item.room.name}
                          </Text>
                        )}
                      </View>
                      {/* {isActive && (
                        <ChevronRight size={18} color={colors.accent} />
                      )} */}
                    </View>
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
