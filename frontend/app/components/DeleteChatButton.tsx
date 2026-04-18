
"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { chatApi } from "../lib/chat.api";
import { toast } from "sonner";

export default function DeleteChatButton({ chatId }: { chatId: string }) {
  const { getToken } = useAuth();
  const router = useRouter();

  const handleDelete = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const toastId = toast.loading("Deleting chat...");
    try {
      const token = await getToken();
      await chatApi.deleteChat(token!, chatId);
      toast.success("Chat deleted", { id: toastId });
      
    
      window.dispatchEvent(new CustomEvent("chats-updated"));
      
  
      router.push("/chat");
    } catch (err) {
      toast.error("Failed to delete chat", { id: toastId });
    }
  };

  return (
    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition">
      <Trash2 size={16} />
    </button>
  );
}