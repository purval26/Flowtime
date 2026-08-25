'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AuditLog } from '@flowtime/types';
import { Clock, User, ClipboardList, Database, Eye, X, AlertCircle } from 'lucide-react';

interface AuditLogWithProfile extends AuditLog {
  profiles: {
    email: string;
    display_name: string | null;
  } | null;
}

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLogWithProfile | null>(null);

  // 1. Fetch Audit Logs joined with profiles
  const { data: logs = [], isLoading, error } = useQuery<AuditLogWithProfile[]>({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id (
            email,
            display_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as AuditLogWithProfile[];
    },
  });

  // Helper to format changed values
  const getChangeSummary = (log: AuditLogWithProfile) => {
    const table = log.target_table;
    const action = log.action;

    if (action === 'INSERT') {
      const name = log.new_data?.name || log.new_data?.label || log.new_data?.title || log.new_data?.id;
      return `Created new item in ${table}: "${name}"`;
    }
    if (action === 'DELETE') {
      const name = log.old_data?.name || log.old_data?.label || log.old_data?.title || log.old_data?.id;
      return `Deleted item from ${table}: "${name}"`;
    }
    if (action === 'UPDATE') {
      const oldVal = log.old_data || {};
      const newVal = log.new_data || {};
      const changedKeys = Object.keys(newVal).filter(
        (key) => JSON.stringify(oldVal[key]) !== JSON.stringify(newVal[key]) && key !== 'updated_at'
      );
      
      const name = newVal.name || oldVal.name || newVal.label || oldVal.label || log.target_id;
      if (changedKeys.length === 0) {
        return `Updated ${table} record`;
      }
      return `Modified ${changedKeys.join(', ')} on ${table} "${name}"`;
    }
    return `Performed ${action} on ${table}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Activity History Log</h1>
        <p className="text-sm text-text-secondary mt-1">
          Audit records of all insertions, updates, and deletions performed across campus schedule records.
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-text-secondary text-sm animate-pulse">
            Loading activity trailing history...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-danger flex items-center justify-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5" />
            Error loading audit logs: {(error as any).message}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-sm font-medium">No activity logged yet.</p>
            <p className="text-xs text-text-muted mt-1">
              Actions taken by staff on timetables, classes, subjects, rooms, or professors will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Timestamp</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Actor / Administrator</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Action</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Details</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const date = new Date(log.created_at);
                  const isInsert = log.action === 'INSERT';
                  const isDelete = log.action === 'DELETE';
                  const isUpdate = log.action === 'UPDATE';

                  return (
                    <tr key={log.id} className="hover:bg-background/25 transition-colors align-middle">
                      {/* Timestamp */}
                      <td className="p-4 text-sm text-text-secondary whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-text-muted" />
                          <span>
                            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="p-4 text-sm text-text-primary">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-text-muted" />
                          <div>
                            <p className="font-semibold text-xs leading-tight">
                              {log.profiles?.display_name || 'System / Migration'}
                            </p>
                            {log.profiles?.email && (
                              <p className="text-[10px] text-text-secondary">{log.profiles.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Action Type Badge */}
                      <td className="p-4 text-sm">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isInsert 
                            ? 'bg-success-soft text-success border border-success/15'
                            : isUpdate
                              ? 'bg-warning-soft text-warning border border-warning/15'
                              : 'bg-danger-soft text-danger border border-danger/15'
                        }`}>
                          {log.action}
                        </span>
                      </td>

                      {/* Change Summary */}
                      <td className="p-4 text-xs text-text-primary font-medium max-w-xs md:max-w-md truncate" title={getChangeSummary(log)}>
                        <div className="flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-text-muted shrink-0" />
                          <span className="truncate">{getChangeSummary(log)}</span>
                        </div>
                      </td>

                      {/* View Payload JSON */}
                      <td className="p-4 text-sm text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-background transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface border border-border shadow-xl rounded-card w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Inspect Audit Record</h3>
                <p className="text-xs text-text-secondary mt-1">
                  ID: {selectedLog.id} | Action: {selectedLog.action} on {selectedLog.target_table}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-full text-text-secondary hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Old Data */}
                <div>
                  <h4 className="font-sans font-semibold text-text-secondary uppercase tracking-wider mb-2 text-[10px]">
                    Before (Old Values)
                  </h4>
                  <pre className="bg-background border border-border p-4 rounded-md overflow-x-auto text-text-primary max-h-[40vh] select-all">
                    {selectedLog.old_data 
                      ? JSON.stringify(selectedLog.old_data, null, 2)
                      : 'null (No previous data)'
                    }
                  </pre>
                </div>

                {/* New Data */}
                <div>
                  <h4 className="font-sans font-semibold text-text-secondary uppercase tracking-wider mb-2 text-[10px]">
                    After (New Values)
                  </h4>
                  <pre className="bg-background border border-border p-4 rounded-md overflow-x-auto text-text-primary max-h-[40vh] select-all">
                    {selectedLog.new_data 
                      ? JSON.stringify(selectedLog.new_data, null, 2)
                      : 'null (Record deleted)'
                    }
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t border-border bg-background/20">
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white hover:bg-primary-accent/90 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
