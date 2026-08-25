'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Professor } from '@flowtime/types';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function ProfessorsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shortName, setShortName] = useState('')
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch professors
  const { data: professors = [], isLoading, error: fetchError } = useQuery<Professor[]>({
    queryKey: ['professors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Open modal for adding
  const openAddModal = () => {
    setEditingProfessor(null);
    setName('');
    setEmail('');
    setShortName('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (item: Professor) => {
    setEditingProfessor(item);
    setName(item.name);
    setEmail(item.email || '');
    setShortName(item.short_name || '')
    setFormError(null);
    setIsModalOpen(true);
  };

  // Create or Update mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setFormError(null);
      if (!name) {
        throw new Error('Professor name is required.');
      }

      const payload = {
        name,
        email: email || null,
        short_name : shortName || null
      };

      if (editingProfessor) {
        const { error } = await supabase
          .from('professors')
          .update(payload)
          .eq('id', editingProfessor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('professors')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setFormError(err.message || 'An error occurred while saving.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this professor? Timetable entries referencing them will remain but have the professor unassigned.'
      );
      if (!confirmDelete) return;

      const { error } = await supabase
        .from('professors')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete professor.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Professors & Faculty</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage teachers and assign them to timetable blocks.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Professor
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary text-sm animate-pulse">
            Loading professors list...
          </div>
        ) : fetchError ? (
          <div className="p-8 text-center text-danger flex items-center justify-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5" />
            Error fetching professors: {(fetchError as any).message}
          </div>
        ) : professors.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <p className="text-sm font-medium">No professors registered.</p>
            <p className="text-xs text-text-muted mt-1">Create one above to begin assigning faculty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Faculty Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Email Address</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Short Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {professors.map((item) => (
                  <tr key={item.id} className="hover:bg-background/25 transition-colors">
                    <td className="p-4 text-sm text-text-primary font-semibold">{item.name}</td>
                    <td className="p-4 text-sm text-text-secondary">
                      {item.email || <span className="text-text-muted italic">Not specified</span>}
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {item.short_name || <span className="text-text-muted italic">Not specified</span>}
                    </td>
                    <td className="p-4 text-sm text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center p-1.5 text-text-secondary hover:text-primary-accent hover:bg-accent-soft rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        className="inline-flex items-center p-1.5 text-text-secondary hover:text-danger hover:bg-danger-soft rounded transition-colors"
                        title="Delete"
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

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface border border-border shadow-xl rounded-card w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingProfessor ? 'Edit Professor Profile' : 'Add Professor'}
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
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Richard Feynman, Prof. Alan Turing"
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. feynman@university.edu"
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Short Name
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="RF"
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>

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
                  {saveMutation.isPending ? 'Saving...' : 'Save Professor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
