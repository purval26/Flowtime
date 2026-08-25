import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Class } from '@flowtime/types';
import { 
  Lock, 
  BookOpen, 
  MapPin, 
  Users, 
  Calendar, 
  Megaphone, 
  List, 
  Layers 
} from 'lucide-react-native';

// Admin Sub-screens imports
import ManageClasses from './admin/ManageClasses';
import ManageSubjects from './admin/ManageSubjects';
import ManageRooms from './admin/ManageRooms';
import ManageProfessors from './admin/ManageProfessors';
import ManageTimetables from './admin/ManageTimetables';
import ManageAnnouncements from './admin/ManageAnnouncements';
import ViewAuditLogs from './admin/ViewAuditLogs';

type AdminSubView = 'menu' | 'classes' | 'subjects' | 'rooms' | 'professors' | 'timetables' | 'announcements' | 'audits';

interface AdminScreenProps {
  isAdmin: boolean;
  adminEmail: string;
  setAdminEmail: (val: string) => void;
  adminPassword: string;
  setAdminPassword: (val: string) => void;
  authLoading: boolean;
  handleAdminSignIn: () => void;
  handleAdminSignOut: () => void;
  classes: Class[];
  stats: { subjects: number; rooms: number; professors: number };
  colors: any;
  isDark: boolean;
}

export default function AdminScreen({
  isAdmin,
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  authLoading,
  handleAdminSignIn,
  handleAdminSignOut,
  classes,
  stats,
  colors,
  isDark
}: AdminScreenProps) {
  const [subView, setSubView] = useState<AdminSubView>('menu');

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
      alignItems: 'center',
    },
    btnText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 14,
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
    menuItem: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuItemText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textPrimary,
    }
  });

  if (!isAdmin) {
    /* STAFF SECURE SIGN IN FORM */
    return (
      <View style={{ paddingBottom: 32 }}>
        <View style={styles.card}>
          <View style={{ alignItems: 'center', marginVertical: 16 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Lock size={20} color={colors.accent} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.textPrimary }}>Staff Portal Login</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4, textAlign: 'center' }}>
              Sign in using your administrator credentials to access management tools.
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Email Address</Text>
          <TextInput
            value={adminEmail}
            onChangeText={setAdminEmail}
            placeholder="admin@example.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 }}>Password</Text>
          <TextInput
            value={adminPassword}
            onChangeText={setAdminPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
          />

          <TouchableOpacity 
            onPress={handleAdminSignIn}
            disabled={authLoading}
            style={styles.btn}
          >
            {authLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* RENDER CORRESPONDING SUB-VIEWS */
  if (subView === 'classes') {
    return <ManageClasses colors={colors} onBack={() => setSubView('menu')} />;
  }
  if (subView === 'subjects') {
    return <ManageSubjects colors={colors} onBack={() => setSubView('menu')} />;
  }
  if (subView === 'rooms') {
    return <ManageRooms colors={colors} onBack={() => setSubView('menu')} />;
  }
  if (subView === 'professors') {
    return <ManageProfessors colors={colors} onBack={() => setSubView('menu')} />;
  }
  if (subView === 'timetables') {
    return <ManageTimetables colors={colors} onBack={() => setSubView('menu')} />;
  }
  if (subView === 'announcements') {
    return <ManageAnnouncements colors={colors} onBack={() => setSubView('menu')} />;
  }
  if (subView === 'audits') {
    return <ViewAuditLogs colors={colors} onBack={() => setSubView('menu')} />;
  }

  /* DEFAULT VIEW: ADMIN CONSOLE MENU & STATS OVERVIEW */
  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Authorized Header with Sign Out */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.title}>🔒 Admin Console</Text>
        <TouchableOpacity 
          onPress={handleAdminSignOut}
          style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: colors.danger, backgroundColor: colors.surface }}
        >
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.danger }}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Database Overview Stats */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        <View style={[styles.card, { flex: 1, alignItems: 'center', marginBottom: 0, padding: 12 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.accent }}>{classes.length}</Text>
          <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>Classes</Text>
        </View>
        <View style={[styles.card, { flex: 1, alignItems: 'center', marginBottom: 0, padding: 12 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.accent }}>{stats.subjects}</Text>
          <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>Subjects</Text>
        </View>
        <View style={[styles.card, { flex: 1, alignItems: 'center', marginBottom: 0, padding: 12 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.accent }}>{stats.rooms}</Text>
          <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>Rooms</Text>
        </View>
        <View style={[styles.card, { flex: 1, alignItems: 'center', marginBottom: 0, padding: 12 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.accent }}>{stats.professors}</Text>
          <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>Staff</Text>
        </View>
      </View>

      {/* Navigation Menu Grid */}
      <Text style={styles.title}>🛠 Manage Resources</Text>
      
      <TouchableOpacity onPress={() => setSubView('classes')} style={styles.menuItem}>
        <Layers size={18} color={colors.accent} />
        <Text style={styles.menuItemText}>Manage Class Divisions</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSubView('subjects')} style={styles.menuItem}>
        <BookOpen size={18} color={colors.accent} />
        <Text style={styles.menuItemText}>Manage Subjects</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSubView('rooms')} style={styles.menuItem}>
        <MapPin size={18} color={colors.accent} />
        <Text style={styles.menuItemText}>Manage Rooms & Labs</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSubView('professors')} style={styles.menuItem}>
        <Users size={18} color={colors.accent} />
        <Text style={styles.menuItemText}>Manage Professors</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSubView('timetables')} style={styles.menuItem}>
        <Calendar size={18} color={colors.accent} />
        <Text style={styles.menuItemText}>Manage Timetable Schedules</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSubView('announcements')} style={styles.menuItem}>
        <Megaphone size={18} color={colors.accent} />
        <Text style={styles.menuItemText}>Broadcast Notice Announcements</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSubView('audits')} style={styles.menuItem}>
        <List size={18} color={colors.accent} />
        <Text style={styles.menuItemText}>View Database Audit Logs</Text>
      </TouchableOpacity>
    </View>
  );
}
