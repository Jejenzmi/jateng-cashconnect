import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ChatRoom {
  id: string;
  name: string | null;
  type: string;
  department_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  file_url: string | null;
  is_edited: boolean;
  created_at: string;
  sender_name?: string;
  is_own: boolean;
}

export interface ChatParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  profiles?: {
    full_name: string;
  };
}

export function useChatRooms() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["chat-rooms", user?.id],
    queryFn: async (): Promise<ChatRoom[]> => {
      if (!user?.id) return [];

      // Get rooms the user is a participant in
      const participantRooms = await getApi("/generic-api");

      if (!participantRooms || participantRooms.length === 0) return [];

      const roomIds = participantRooms.map((p: any) => p.room_id);

      // Get room details
      const rooms = await putApi("/generic-api", {});

      // Get last messages for each room
      const roomsWithMessages = await Promise.all(
        (rooms || []).map(async (room) => {
          const lastMessageResult = await getApi("/generic-api");

          const lastMessage = lastMessageResult.length > 0 ? lastMessageResult[0] : null;

          // Get unread count
          const participantResult = await getApi("/generic-api");

          const participant = participantResult.length > 0 ? participantResult[0] : null;
          let unreadCount = 0;

          if (participant?.last_read_at) {
            const unreadCountResult = await getApi("/generic-api");
            
            unreadCount = parseInt(unreadCountResult[0].count);
          }

          return {
            ...room,
            last_message: lastMessage?.content,
            last_message_time: lastMessage?.created_at
              ? new Date(lastMessage.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined,
            unread_count: unreadCount,
          };
        })
      );

      return roomsWithMessages;
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });
}

export function useChatMessages(roomId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Note: Real-time functionality would need to be implemented separately
  // with WebSocket connections or similar technology since PostgreSQL doesn't
  // provide built-in real-time subscriptions like Supabase
  useEffect(() => {
    if (!roomId) return;

    // Placeholder for real-time subscription if needed
    // In a production environment, you'd likely implement this with WebSocket
    console.log("Real-time functionality needs separate implementation with WebSocket or similar");
  }, [roomId, queryClient, user?.id]);

  return useQuery({
    queryKey: ["chat-messages", roomId],
    queryFn: async (): Promise<ChatMessage[]> => {
      if (!roomId) return [];

      const data = await getApi("/generic-api");

      // Map sender names - for now just mark own messages
      return (data || []).map((msg) => ({
        ...msg,
        sender_name: msg.sender_id === user?.id ? "Anda" : "Staff",
        is_own: msg.sender_id === user?.id,
      }));
    },
    enabled: !!roomId,
  });
}

export function useSendMessage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      content,
      messageType = "text",
    }: {
      roomId: string;
      content: string;
      messageType?: string;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const result = await postApi("/generic-api", {});

      const data = result[0];

      // Update room's updated_at
      await putApi("/generic-api", {});

      // Update participant's last_read_at
      await putApi("/generic-api", {});

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useMarkRoomAsRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      if (!user?.id) return;

      await putApi("/generic-api", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
    },
  });
}

export function useCreateChatRoom() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      type,
      participantIds,
    }: {
      name?: string;
      type: "direct" | "group" | "department";
      participantIds: string[];
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Create room
      const roomResult = await postApi("/generic-api", {});

      const room = roomResult[0];

      // Add participants (including creator)
      const allParticipants = [...new Set([user.id, ...participantIds])];
      
      // Using a loop to insert participants since postgresql doesn't support bulk insert of arrays directly
      for (const userId of allParticipants) {
        await postApi("/generic-api", {});
      }

      return room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      toast({
        title: "Berhasil",
        description: "Chat room berhasil dibuat",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
