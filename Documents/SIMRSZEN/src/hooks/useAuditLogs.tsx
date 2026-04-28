import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface UseAuditLogsOptions {
  tableName?: string;
  action?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export function useAuditLogs(options: UseAuditLogsOptions = {}) {
  const { tableName, action, limit = 100, startDate, endDate } = options;

  return useQuery({
    queryKey: ["audit-logs", tableName, action, limit, startDate, endDate],
    queryFn: async (): Promise<AuditLog[]> => {
      try {
        let query = `
          SELECT 
            id,
            user_id,
            user_name,
            action,
            table_name,
            record_id,
            old_values,
            new_values,
            ip_address,
            user_agent,
            created_at
          FROM audit_logs
        `;
        
        const conditions = [];
        
        if (tableName) {
          conditions.push(`table_name = ${getApi.escape(tableName)}`);
        }
        
        if (action) {
          conditions.push(`action = ${getApi.escape(action)}`);
        }
        
        if (startDate) {
          conditions.push(`created_at >= ${getApi.escape(startDate)}::timestamp`);
        }
        
        if (endDate) {
          conditions.push(`created_at <= ${getApi.escape(endDate)}::timestamp`);
        }
        
        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }
        
        query += ` ORDER BY created_at DESC LIMIT ${limit}`;
        
        const result = await getApi<AuditLog[]>(query);
        
        // Add profiles relation emulation
        const userIds = [...new Set(result?.map(d => d.user_id).filter(Boolean))];
        let profilesMap: Record<string, any> = {};
        
        if (userIds.length > 0) {
          const profileQuery = `
            SELECT user_id, user_name, user_email
            FROM users
            WHERE user_id IN (${userIds.map(id => getApi.escape(id)).join(',')})
          `;
          
          const profiles = await getApi<{
            user_id: string;
            user_name: string;
            user_email: string;
          }[]>(profileQuery);
          
          profiles?.forEach(p => {
            profilesMap[p.user_id] = {
              full_name: p.user_name,
              email: p.user_email
            };
          });
        }
        
        return (result || []).map(log => ({
          ...log,
          profiles: profilesMap[log.user_id] || undefined,
        }));
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
      }
    },
  });
}

export function useAuditStats() {
  return useQuery({
    queryKey: ["audit-stats"],
    queryFn: async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        
        // Get today's count
        const todayCountResult = await getApi<{count: number}[]>`
          SELECT COUNT(*) FROM audit_logs 
          WHERE created_at >= ${today}::timestamp
        `;
        const todayCount = todayCountResult[0]?.count || 0;
        
        // Get this week's count
        const weekCountResult = await getApi<{count: number}[]>`
          SELECT COUNT(*) FROM audit_logs 
          WHERE created_at >= ${weekAgo}::timestamp
        `;
        const weekCount = weekCountResult[0]?.count || 0;
        
        // Get action breakdown
        const actionBreakdownResult = await getApi<{action: string, count: number}[]>`
          SELECT action, COUNT(*) 
          FROM audit_logs
          WHERE created_at >= ${weekAgo}::timestamp
          GROUP BY action
        `;
        
        const actionCounts = {
          INSERT: 0,
          UPDATE: 0,
          DELETE: 0,
        };
        
        actionBreakdownResult?.forEach((row) => {
          if (row.action in actionCounts) {
            actionCounts[row.action as keyof typeof actionCounts] = row.count;
          }
        });
        
        // Get table breakdown
        const tableBreakdownResult = await getApi<{table_name: string, count: number}[]>`
          SELECT table_name, COUNT(*) 
          FROM audit_logs
          WHERE created_at >= ${weekAgo}::timestamp
          GROUP BY table_name
        `;
        
        const tableCounts: Record<string, number> = {};
        tableBreakdownResult?.forEach((row) => {
          tableCounts[row.table_name] = row.count;
        });
        
        return {
          todayCount,
          weekCount,
          actionCounts,
          tableCounts,
        };
      } catch (error) {
        console.error("Error fetching audit stats:", error);
        throw error;
      }
    },
  });
}
