import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions
} from 'react-native';
import { ArrowLeft, Bell, Calendar, Info } from 'lucide-react-native';
import { Announcement } from '@flowtime/types';

interface AnnouncementScreenProps {
  announcements: Announcement[];
  readIds: string[];
  colors: any;
  isDark: boolean;
  onBack: () => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function AnnouncementScreen({
  announcements,
  readIds,
  colors,
  isDark,
  onBack,
  refreshing,
  onRefresh
}: AnnouncementScreenProps) {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: colors.fontFamilyBold,
      color: colors.textPrimary,
      marginTop: -2
    },
    list: {
      padding: 16,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 12,
      position: 'relative',
    },
    unreadCard: {
      borderColor: colors.accent + '30',
      backgroundColor: colors.accentSoft,
    },
    tag: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      backgroundColor: colors.background,
      marginBottom: 8,
    },
    tagText: {
      fontSize: 9,
      fontFamily: colors.fontFamilyBold,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      marginTop: -2
    },
    title: {
      fontSize: 15,
      fontFamily: colors.fontFamilyBold,
      color: colors.textPrimary,
      marginBottom: 6,
      marginTop: -2
    },
    description: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 10,
      marginTop: -2,
      fontFamily: colors.fontFamily
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    dateText: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: -2,
      fontFamily: colors.fontFamily
    },
    unreadDot: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    }
  });

  const formatAnnouncementDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4, paddingTop:6 }}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcements</Text>
        <View style={{ width: 24 }} /> {/* Balance back button */}
      </View>

      {/* Main List */}
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
            progressBackgroundColor={colors.surface}
          />
        }
      >
        {announcements.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 12 }}>
            <Bell size={48} color={colors.textMuted} style={{ opacity: 0.5 }} />
            <Text style={{ fontSize: 14, fontFamily: colors.fontFamilyBold, color: colors.textSecondary }}>No announcements</Text>
            <Text style={{ fontSize: 12, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 32 }}>
              Divisional notices and broadcast updates will show up here.
            </Text>
          </View>
        ) : (
          announcements.map((item) => {
            const isUnread = !readIds.includes(item.id);
            return (
              <View 
                key={item.id} 
                style={[
                  styles.card, 
                  isUnread && styles.unreadCard
                ]}
              >
                {/* Unread dot indicator */}
                {isUnread && <View style={styles.unreadDot} />}

                {/* Tag label */}
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {item.created_at ? 'Notice' : 'BroadCast'}
                  </Text>
                </View>

                {/* Content */}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.content}</Text>

                {/* Footer details */}
                <View style={styles.footer}>
                  <Calendar size={12} color={colors.textMuted} />
                  <Text style={styles.dateText}>
                    {formatAnnouncementDate(item.created_at || new Date().toISOString())}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
