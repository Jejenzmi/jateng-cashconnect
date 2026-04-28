import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from 'react';
interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      let result: Notification[] = [];
      
      if (userId) {
        // Fetch notifications for specific user
        result = await getApi<Notification[]>`
          SELECT 
            id,
            user_id,
            title,
            message,
            type,
            is_read,
            created_at,
            metadata
          FROM notifications 
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
        `;
      } else {
        // Fetch all notifications
        result = await getApi<Notification[]>`
          SELECT 
            id,
            user_id,
            title,
            message,
            type,
            is_read,
            created_at,
            metadata
          FROM notifications
          ORDER BY created_at DESC
        `;
      }
      
      setNotifications(result);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat notifikasi');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await putApi("/generic-api", {});
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (err: any) {
      setError(err.message || 'Gagal menandai notifikasi sebagai sudah dibaca');
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async (forUserId?: string) => {
    try {
      if (forUserId) {
        await putApi("/generic-api", {});
        
        // Update local state
        setNotifications(notifications.map(n => 
          n.user_id === forUserId ? { ...n, is_read: true } : n
        ));
      } else {
        await putApi("/generic-api", {});
        
        // Update local state
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menandai semua notifikasi sebagai sudah dibaca');
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  };

  const createNotification = async (
    userId: string, 
    title: string, 
    message: string, 
    type: 'info' | 'warning' | 'error' | 'success',
    metadata?: any
  ) => {
    try {
      const result = await getApi<Notification[]>`
        INSERT INTO notifications (
          user_id,
          title,
          message,
          type,
          is_read,
          metadata
        ) VALUES (
          ${userId},
          ${title},
          ${message},
          ${type},
          false,
          ${metadata ? JSON.stringify(metadata) : null}
        )
        RETURNING 
          id,
          user_id,
          title,
          message,
          type,
          is_read,
          created_at,
          metadata
      `;
      
      // Add to local state
      setNotifications([result[0], ...notifications]);
      return result[0];
    } catch (err: any) {
      setError(err.message || 'Gagal membuat notifikasi');
      console.error('Error creating notification:', err);
      throw err;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await deleteApi("/generic-api");
      
      // Update local state
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus notifikasi');
      console.error('Error deleting notification:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification,
    unreadCount,
    refetch: fetchNotifications
  };
};

/**
 * Hook for medicine stock alerts
 */
export const useMedicineStockAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // This would fetch medicine stock alerts from the API
        const result = await getApi<any[]>`
          SELECT 
            m.id,
            m.name,
            m.stock,
            m.minimum_stock,
            m.expiry_date,
            CASE 
              WHEN m.stock <= m.minimum_stock THEN 'low_stock'
              WHEN m.expiry_date <= NOW() + INTERVAL '30 days' THEN 'expiring_soon'
              ELSE 'normal'
            END as alert_type
          FROM medicines m
          WHERE m.stock <= m.minimum_stock OR m.expiry_date <= NOW() + INTERVAL '30 days'
          ORDER BY 
            CASE 
              WHEN m.stock <= 0 THEN 1
              WHEN m.expiry_date <= NOW() + INTERVAL '7 days' THEN 2
              WHEN m.expiry_date <= NOW() + INTERVAL '30 days' THEN 3
              WHEN m.stock <= m.minimum_stock THEN 4
              ELSE 5
            END
        `;
        
        setAlerts(result);
      } catch (error) {
        console.error('Failed to fetch medicine stock alerts:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Set up polling for updates (every 30 seconds)
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return { alerts, loading, refetch: () => { /* trigger refetch */ } };
};

/**
 * Hook for queue updates
 */
export const useQueueUpdates = () => {
  const [queueData, setQueueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQueueUpdates = async () => {
      try {
        // This would fetch queue updates from the API
        const result = await getApi<any[]>`
          SELECT 
            q.queue_number,
            q.patient_id,
            p.name as patient_name,
            q.service_unit,
            q.status,
            q.created_at,
            q.estimated_wait_time
          FROM queues q
          JOIN patients p ON q.patient_id = p.id
          WHERE q.status = 'waiting' OR q.status = 'called'
          ORDER BY q.created_at ASC
        `;
        
        setQueueData(result);
      } catch (error) {
        console.error('Failed to fetch queue updates:', error);
        setQueueData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueueUpdates();
    
    // Set up polling for updates (every 10 seconds)
    const interval = setInterval(fetchQueueUpdates, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return { queueData, loading, refetch: () => { /* trigger refetch */ } };
};

export default useNotifications;