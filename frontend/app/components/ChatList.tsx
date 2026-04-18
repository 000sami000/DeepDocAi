
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { chatApi } from "../lib/chat.api";
import DeleteChatButton from "./DeleteChatButton";
import { toast } from "sonner";
import ChatListSkeleton from "./ChatListSkeleton";

export default function ChatList() {
  const { getToken } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const data = await chatApi.getChats(token);
      setChats(data?.chats || []);
    } catch (err) {
      console.error("Failed to load chats", err);
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();

    const handleRefresh = () => fetchChats();
    window.addEventListener("chats-updated", handleRefresh);
    return () => window.removeEventListener("chats-updated", handleRefresh);
  }, []);

  if (loading) {
    return <ChatListSkeleton />; 
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="italic text-gray-400">Your Chats</div>

      {chats.length === 0 ? (
        <div className="text-gray-500 text-sm">No chats yet</div>
      ) : (
        chats.map((chat: any) => (
          <Link
            key={chat.chat_id}
            href={`/chat/${chat.chat_id}`}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200 text-sm flex justify-between items-center group"
          >
            <span className="truncate">{chat.name}</span>
            <DeleteChatButton chatId={chat.chat_id} />
          </Link>
        ))
      )}
    </div>
  );
}