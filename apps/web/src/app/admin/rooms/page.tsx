'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Room } from '@flowtime/types';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function RoomsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch rooms
  const { data: rooms = [], isLoading, error: fetchError } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Open modal for adding
  const openAddModal = () => {
    setEditingRoom(null);
    setName('');
    setBuilding('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (item: Room) => {
    setEditingRoom(item);
    setName(item.name);
    setBuilding(item.building || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Create or Update mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setFormError(null);
      if (!name) {
        throw new Error('Room name is required.');
      }

      const payload = {
        name,
        building: building || null,
      };

      if (editingRoom) {
        const { error } = await supabase
          .from('rooms')
          .update(payload)
          .eq('id', editingRoom.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setFormError(err.message || 'An error occurred while saving.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this room? This action cannot be undone.');
      if (!confirmDelete) return;

      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete room.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Rooms & Locations</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage classrooms, labs, lecture halls, and buildings.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary text-sm animate-pulse">
            Loading rooms list...
          </div>
        ) : fetchError ? (
          <div className="p-8 text-center text-danger flex items-center justify-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5" />
            Error fetching rooms: {(fetchError as any).message}
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <p className="text-sm font-medium">No classrooms or rooms registered.</p>
            <p className="text-xs text-text-muted mt-1">Create one above to begin.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Room Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Building / Wing</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rooms.map((item) => (
                  <tr key={item.id} className="hover:bg-background/25 transition-colors">
                    <td className="p-4 text-sm text-text-primary font-medium">{item.name}</td>
                    <td className="p-4 text-sm text-text-secondary">{item.building || <span className="text-text-muted italic">Not specified</span>}</td>
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
                {editingRoom ? 'Edit Room' : 'Add Room'}
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
                  Room Name / Number
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Room 309-A, Lab 2"
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Building / Block (Optional)
                </label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="e.g. Engineering Block, Wing B"
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
                  {saveMutation.isPending ? 'Saving...' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
