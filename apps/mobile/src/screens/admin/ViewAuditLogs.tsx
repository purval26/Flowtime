import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { ArrowLeft } from 'lucide-react-native';

interface AuditLog {
  id: string;
  action: string;
  target_table: string;
  created_at: string;
  old_data?: any;
  new_data?: any;
}

interface ViewAuditLogsProps {
  colors: any;
  onBack: () => void;
}

export default function ViewAuditLogs({ colors, onBack }: ViewAuditLogsProps) {
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setAudits(data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

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

      <Text style={styles.title}>📜 Database Audit Logs (Last 20)</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 20 }} />
      ) : audits.length === 0 ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontFamily: colors.fontFamily, color: colors.textSecondary, textAlign: 'center', marginTop: -2 }}>No recent audit activity found.</Text>
        </View>
      ) : (
        audits.map((log) => (
          <View key={log.id} style={[styles.card, { paddingVertical: 12, marginBottom: 8 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, fontFamily: colors.fontFamilyBold, color: colors.textPrimary, marginTop: -2 }}>
                {log.action} on {log.target_table}
              </Text>
              <Text style={{ fontSize: 9, fontFamily: colors.fontFamily, color: colors.textMuted, marginTop: -2 }}>
                {new Date(log.created_at).toLocaleTimeString()}
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontFamily: colors.fontFamily, color: colors.textSecondary, marginTop: -2 }}>
              ID: {log.id} • Date: {new Date(log.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
