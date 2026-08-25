'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Timetable, Class } from '@flowtime/types';
import { Plus, Edit2, Trash2, Copy, Calendar, X, AlertCircle, ArrowRight } from 'lucide-react';

interface TimetableWithClass extends Timetable {
  classes: Class;
}

export default function TimetablesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [effectiveUntil, setEffectiveUntil] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch timetables (with associated class details)
  const { data: timetables = [], isLoading: timetablesLoading, error: timetablesError } = useQuery<TimetableWithClass[]>({
    queryKey: ['timetables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timetables')
        .select(`
          *,
          classes (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as TimetableWithClass[];
    },
  });

  // Fetch classes for selection dropdown
  const { data: classes = [] } = useQuery<Class[]>({
    queryKey: ['classes-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Open modal for adding
  const openAddModal = () => {
    setEditingTimetable(null);
    setName('');
    setClassId(classes[0]?.id || '');
    setEffectiveFrom(new Date().toISOString().split('T')[0]);
    setEffectiveUntil('');
    setIsActive(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (item: Timetable) => {
    setEditingTimetable(item);
    setName(item.name);
    setClassId(item.class_id);
    setEffectiveFrom(item.effective_from);
    setEffectiveUntil(item.effective_until || '');
    setIsActive(item.is_active);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Create or Update mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setFormError(null);
      if (!name || !classId || !effectiveFrom) {
        throw new Error('Name, Class, and Effective From dates are required.');
      }

      const payload = {
        name,
        class_id: classId,
        effective_from: effectiveFrom,
        effective_until: effectiveUntil || null,
        is_active: isActive,
      };

      if (editingTimetable) {
        const { error } = await supabase
          .from('timetables')
          .update(payload)
          .eq('id', editingTimetable.id);
        if (error) throw error;

        // If making this active, optionally deactivate other active timetables for the same class
        if (isActive) {
          await supabase
            .from('timetables')
            .update({ is_active: false })
            .eq('class_id', classId)
            .neq('id', editingTimetable.id);
        }
      } else {
        const { data, error } = await supabase
          .from('timetables')
          .insert([payload])
          .select();
        if (error) throw error;

        // If making this active, deactivate others
        if (isActive && data?.[0]) {
          await supabase
            .from('timetables')
            .update({ is_active: false })
            .eq('class_id', classId)
            .neq('id', data[0].id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setFormError(err.message || 'An error occurred while saving.');
    },
  });

  // Duplicate Timetable mutation (clones metadata and all timetable_entries)
  const duplicateMutation = useMutation({
    mutationFn: async (sourceTimetable: TimetableWithClass) => {
      const newName = window.prompt('Enter name for the duplicated timetable:', `${sourceTimetable.name} (Copy)`);
      if (!newName) return;

      // 1. Create the new timetable
      const { data: newTimetableData, error: ttError } = await supabase
        .from('timetables')
        .insert([{
          class_id: sourceTimetable.class_id,
          name: newName,
          effective_from: sourceTimetable.effective_from,
          effective_until: sourceTimetable.effective_until,
          is_active: false,
        }])
        .select()
        .single();

      if (ttError) throw ttError;
      if (!newTimetableData) throw new Error('Failed to create new timetable clone.');

      // 2. Fetch all entries from the source timetable
      const { data: sourceEntries, error: fetchEntriesError } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('timetable_id', sourceTimetable.id);

      if (fetchEntriesError) throw fetchEntriesError;

      // 3. Duplicate and insert entries if any exist
      if (sourceEntries && sourceEntries.length > 0) {
        const clonedEntries = sourceEntries.map(entry => {
          // Remove old ID and update timetable_id
          const { id, created_at, updated_at, ...rest } = entry;
          return {
            ...rest,
            timetable_id: newTimetableData.id
          };
        });

        const { error: insertEntriesError } = await supabase
          .from('timetable_entries')
          .insert(clonedEntries);

        if (insertEntriesError) throw insertEntriesError;
      }

      alert(`Timetable cloned successfully into "${newName}"!`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to duplicate timetable.');
    }
  });

  // Delete Timetable mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this timetable and all its entries? This action is permanent.');
      if (!confirmDelete) return;

      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete timetable.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Timetables</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage academic schedules, effective date scopes, and activate timetables.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Timetable
        </button>
      </div>

      {/* Main Grid / List */}
      <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden">
        {timetablesLoading ? (
          <div className="p-8 text-center text-text-secondary text-sm animate-pulse">
            Loading timetables...
          </div>
        ) : timetablesError ? (
          <div className="p-8 text-center text-danger flex items-center justify-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5" />
            Error fetching timetables: {(timetablesError as any).message}
          </div>
        ) : timetables.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <p className="text-sm font-medium">No timetables created yet.</p>
            <p className="text-xs text-text-muted mt-1">Create one above to begin scheduling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Timetable Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Target Class</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Effective From</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Effective Until</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {timetables.map((item) => (
                  <tr key={item.id} className="hover:bg-background/25 transition-colors">
                    <td className="p-4 text-sm font-medium text-text-primary">
                      <Link 
                        href={`/admin/timetables/${item.id}`}
                        className="text-primary-accent hover:underline flex items-center gap-1 font-semibold"
                      >
                        {item.name}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-text-secondary font-medium">
                      {item.classes ? `${item.classes.name} (Section ${item.classes.section})` : <span className="italic text-text-muted">No class</span>}
                    </td>
                    <td className="p-4 text-sm text-text-secondary">{item.effective_from}</td>
                    <td className="p-4 text-sm text-text-secondary">{item.effective_until || <span className="text-text-muted italic">Ongoing</span>}</td>
                    <td className="p-4 text-sm">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-soft text-success border border-success/10">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-background text-text-secondary border border-border">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-right space-x-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center p-1.5 text-text-secondary hover:text-primary-accent hover:bg-accent-soft rounded transition-colors"
                        title="Edit Settings"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateMutation.mutate(item)}
                        className="inline-flex items-center p-1.5 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors"
                        title="Duplicate Timetable"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        className="inline-flex items-center p-1.5 text-text-secondary hover:text-danger hover:bg-danger-soft rounded transition-colors"
                        title="Delete Timetable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface border border-border shadow-xl rounded-card w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingTimetable ? 'Edit Timetable Settings' : 'Create Timetable'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-text-secondary hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
              className="p-6 space-y-4"
            >
              {formError && (
                <div className="bg-danger-soft border border-danger/10 text-danger text-sm rounded-md p-3 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Timetable Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fall 2026 Timetable"
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Target Class Batch
                </label>
                <select
                  required
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                >
                  <option value="" disabled>Select a class section...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - Section {cls.section} ({cls.academic_year})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                    Effective From
                  </label>
                  <input
                    type="date"
                    required
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                    Effective Until
                  </label>
                  <input
                    type="date"
                    value={effectiveUntil}
                    onChange={(e) => setEffectiveUntil(e.target.value)}
                    className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary-accent focus:ring-primary-accent"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-text-primary">
                  Set as Active Timetable
                </label>
              </div>
              <p className="text-[11px] text-text-secondary pl-6 leading-normal">
                Setting this active will deactivate any other active timetables for the selected class batch automatically.
              </p>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white hover:bg-primary-accent/90 disabled:opacity-50 transition-colors"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Timetable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
