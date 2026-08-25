import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useRealtimeAnnouncements() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to announcements changes in Postgres channel
    const channel = supabase
      .channel('announcements-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => {
          // Automatically invalidate React Query data to fetch fresh list
          queryClient.invalidateQueries({ queryKey: ['announcements'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
