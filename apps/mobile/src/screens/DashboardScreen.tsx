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
  readAnnouncementIds?: string[];
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
  readAnnouncementIds = [],
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
      fontFamily: colors.fontFamilyBold,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
      marginTop: 6,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      fontSize: 9,
      fontFamily: colors.fontFamilyBold,
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
          <Text style={{ fontSize: 24, color: colors.textPrimary, fontFamily:'PlusJakartaSans-SemiBold', marginTop: -2 }}>
            {getGreeting()},
          </Text>
          <Text style={{ fontSize: 24, color: colors.textPrimary, marginTop: -2, fontFamily: colors.fontFamilySemiBold }}>
            {getUserName()} 👋
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2, fontFamily: colors.fontFamily }}>
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
                <Text style={{ fontSize: 9, color: '#FFFFFF', fontFamily: colors.fontFamily }}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Announcements Carousel / List Widget */}
      {announcements.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: -2 }}>
              ANNOUNCEMENTS
            </Text>
            <TouchableOpacity onPress={onOpenAnnouncements}>
              <Text style={{ fontSize: 12, fontFamily: colors.fontFamilyBold, color: colors.accent, marginTop: -2 }}>
                View all ({unreadCount > 0 ? `${unreadCount} new` : announcements.length})
              </Text>
            </TouchableOpacity>
          </View>

          {announcements.slice(0, 2).map((item) => {
            const isUnread = !readAnnouncementIds.includes(item.id);
            return (
              <View 
                key={item.id} 
                style={[
                  styles.card, 
                  isUnread && { backgroundColor: colors.accentSoft, borderColor: colors.accent + '20' }
                ]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  {isUnread && (
                    <Text style={[styles.badge, { backgroundColor: colors.accent, color: '#FFFFFF', marginTop: -2, fontFamily: colors.fontFamily }]}>
                      New
                    </Text>
                  )}
                  <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: -2, fontFamily: colors.fontFamily }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 18, fontFamily: colors.fontFamily}}>
                  {item.content}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Active Lecture Countdown Card */}
      {activeLecture ? (
        <View style={styles.activeCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              {/* <Text style={{ width: 95, textAlign: "center", fontSize: 10, fontFamily: colors.fontFamilyBold, backgroundColor: colors.surface, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, borderRadius: 6, paddingHorizontal: 2 }}>
                CURRENT CLASS
              </Text> */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Left Text */}
                {activeLecture ? (
                  <Text style={{ fontSize: 20, color: colors.textPrimary, marginTop: -2, fontFamily: colors.fontFamilyBold }}>
                    {`${activeLecture.type === 'break' ? 'Break' : activeLecture.subject?.short_name}(${activeLecture.type.toUpperCase().slice(0, 1)})`}
                  </Text>
                ) : (<></>)}
                {nextLecture ? (
                  <>
                    {activeLecture ? (
                      <ArrowRightIcon size={20} color={colors.textPrimary} style={{ marginHorizontal: 4, marginTop: 4 }} />
                    ) : (<></>)}
                    <Text style={{ fontSize: 20, color: colors.textPrimary, marginTop: -2, fontFamily: colors.fontFamilyBold }}>
                      {`${nextLecture?.type === 'break' ? 'Break' : nextLecture?.subject?.short_name}(${nextLecture?.type.toUpperCase().slice(0, 1)})`}
                    </Text>
                  </>
                ) : (<></>)}
              </View>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2, fontFamily: colors.fontFamily }}>
                {formatTimeTo12Hour(activeLecture.start_time.slice(0, 5))} - {formatTimeTo12Hour(activeLecture.end_time.slice(0, 5))}
              </Text>
              {activeLecture.room && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: -2, fontFamily: colors.fontFamily }}>
                    Room {activeLecture.room?.name}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ alignItems: 'flex-end', gap: 12 }}>
              {/* LIVE Badge */}
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
                <Text style={{ fontSize: 10, fontFamily: colors.fontFamilyBold, color: colors.success, marginTop: -2 }}>LIVE</Text>
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
              <Text style={{ fontSize: 12, fontFamily: colors.fontFamilyBold, color: colors.accent, marginTop: -2 }}>
                {getFormattedRemainingTime(activeLecture)}
              </Text>
              <Text style={{ fontSize: 11, fontFamily:colors.fontFamily, color: colors.textSecondary, marginTop: -2 }}>
                {Math.round(getProgressBarPercentage(activeLecture))}% completed
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <>
          {nextLecture && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, fontFamily: colors.fontFamilyBold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: -2 }}>
                    NEXT CLASS
                  </Text>
                  <Text style={{ fontSize: 18, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>
                    {nextLecture.type === 'break' ? '☕ Daily Break' : nextLecture.subject?.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2, fontFamily: colors.fontFamily }}>
                    {formatTimeTo12Hour(nextLecture.start_time.slice(0, 5))} - {formatTimeTo12Hour(nextLecture.end_time.slice(0, 5))}
                  </Text>
                  {nextLecture.type !== 'break' && nextLecture.room && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                      <MapPin size={14} color={colors.textSecondary} />
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: -2, fontFamily: colors.fontFamily }}>
                        Room {nextLecture.room?.name}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ alignItems: 'flex-end', gap: 12 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color={colors.accent} />
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: -2, fontFamily: colors.fontFamily }}>Starts in</Text>
                  <Text style={{ fontSize: 16, fontFamily: colors.fontFamilyBold, color: colors.accent }}>
                    {getFormattedTimeUntilNext(nextLecture)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}

      {/* Today's Schedule Section Title with "View full" link */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans-SemiBold', color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: -2 }}>
          TODAY'S SCHEDULE
        </Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamilyBold, color: colors.accent, marginTop: -2 }}>View full</Text>
        </TouchableOpacity>
      </View>

      {todaySchedule.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: -2, fontFamily: colors.fontFamily }}>
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
                  <Text style={{ fontSize: 11, fontFamily: colors.fontFamilyBold, color: isActive ? colors.accent : colors.textSecondary, marginTop: -2 }}>
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
                          { fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 },
                          isCompleted && { textDecorationLine: 'line-through' }
                        ]}>
                          {isBreak ? (item.label || 'Break') : (`${item.subject?.short_name} (${item.type.toUpperCase().slice(0, 1)})` || 'Class Event')}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary, fontFamily: colors.fontFamily }}>
                          {item.type !== 'break' && item.professor?.short_name ? `${item.professor.short_name} ` : ''}
                        </Text>
                        {!isBreak && item.room && (
                          <Text style={{ fontSize: 11, color: colors.textSecondary, fontFamily: colors.fontFamily }}>
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
