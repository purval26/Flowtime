'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Announcement, Class } from '@flowtime/types';
import { useAuth } from '@/hooks/useAuth';
import { 
  Megaphone, 
  Trash2, 
  Plus, 
  Clock, 
  Globe, 
  Layers, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface AnnouncementWithClass extends Announcement {
  classes: {
    name: string;
    section: string;
  } | null;
}

export default function AdminAnnouncementsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetClassId, setTargetClassId] = useState<string>('global'); // 'global' or class UUID
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Fetch Classes for target selection
  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['admin-announcements-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []) as Class[];
    },
  });

  // 2. Fetch Announcements
  const { data: announcements = [], isLoading, error } = useQuery<AnnouncementWithClass[]>({
    queryKey: ['admin-announcements-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          classes:class_id (
            name,
            section
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as AnnouncementWithClass[];
    },
  });

  // 3. Mutation: Create Announcement
  const createMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string; class_id: string | null }) => {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: payload.title,
          content: payload.content,
          class_id: payload.class_id,
          created_by: user?.id || null
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements-list'] });
      setTitle('');
      setContent('');
      setTargetClassId('global');
      setSuccessMsg('Announcement published successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to publish announcement.');
    }
  });

  // 4. Mutation: Delete Announcement
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements-list'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!title.trim() || !content.trim()) {
      setFormError('Please fill out both the title and the message contents.');
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      class_id: targetClassId === 'global' ? null : targetClassId
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Announcements Manager</h1>
        <p className="text-sm text-text-secondary mt-1">
          Publish, edit, or broadcast notices and emergency schedule updates directly to students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Publish Announcement Form (Left 1/3) */}
        <div className="bg-surface border border-border rounded-card p-6 shadow-sm space-y-4 lg:col-span-1">
          <h2 className="text-md font-semibold text-text-primary flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-accent" />
            Publish Notice
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-danger-soft text-danger text-xs font-semibold rounded border border-danger/10 flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-success-soft text-success text-xs font-semibold rounded border border-success/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Notice Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midsem Exam Schedule Changed"
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-accent transition-colors"
              />
            </div>

            {/* Target Audience Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Target Audience</label>
              <select
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-accent transition-colors cursor-pointer"
              >
                <option value="global">🌐 Broadcast to All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    🎓 {cls.name} ({cls.section})
                  </option>
                ))}
              </select>
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Announcement Message</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Type your notice or announcement here..."
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-accent transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full py-2.5 bg-primary-accent hover:bg-primary-accent/90 disabled:opacity-55 text-white font-semibold text-sm rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              {createMutation.isPending ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </form>
        </div>

        {/* Announcements Stream (Right 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-md font-semibold text-text-primary flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary-accent" />
            Active Announcements Stream
          </h2>

          {isLoading ? (
            <div className="p-12 text-center text-text-secondary text-sm animate-pulse bg-surface border border-border rounded-card">
              Loading active notices feed...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-danger bg-surface border border-border rounded-card flex items-center justify-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5" />
              Error loading notices: {(error as any).message}
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-12 text-center text-text-secondary bg-surface border border-border rounded-card">
              <Megaphone className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-sm font-semibold">No announcements active.</p>
              <p className="text-xs text-text-muted mt-1">
                Announcements published using the form on the left will stream here and sync instantly to students.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => {
                const date = new Date(item.created_at);
                const isGlobal = !item.class_id;

                return (
                  <div key={item.id} className="bg-surface border border-border p-5 rounded-card shadow-xs hover:shadow-sm transition-shadow relative flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-xl">
                      {/* Badge / Audience info */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {isGlobal ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                            <Globe className="w-3 h-3" />
                            Global Broadcast
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                            <Layers className="w-3 h-3" />
                            Class: {item.classes?.name} ({item.classes?.section})
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] text-text-secondary whitespace-nowrap">
                          <Clock className="w-3 h-3 text-text-muted" />
                          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Title & Body */}
                      <h3 className="font-semibold text-text-primary text-base leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    {/* Delete Action */}
                    <div className="self-end md:self-start">
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this announcement? This action is immediate.')) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-text-secondary hover:text-danger hover:bg-danger-soft border border-border hover:border-danger/10 rounded-button bg-surface transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
