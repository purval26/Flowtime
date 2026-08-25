import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useRealtimeAnnouncements() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Request permission to send browser notifications
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('Browser notification permission:', permission);
        });
      }
    }

    // Subscribe to announcements changes in Postgres channel
    const channel = supabase
      .channel('announcements-realtime-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => {
          const newNotice = payload.new as any;

          // Automatically invalidate React Query data to fetch fresh list
          queryClient.invalidateQueries({ queryKey: ['announcements'] });

          // Send browser native notification
          if (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            new Notification(`📢 New Notice: ${newNotice.title}`, {
              body: newNotice.content,
              icon: '/icon.svg',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
