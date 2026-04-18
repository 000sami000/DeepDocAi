"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { messageApi } from "../lib/message.api";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import MessageSkeleton from "./MessageSkeleton";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatClient({ chatId, chatName }: any) {
  console.log("ChatClient rendered with chatId:", chatId, "and chatName:", chatName);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { getToken } = useAuth();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


 const loadMessages = async () => {
  try {
    setInitialLoading(true);
    const token = await getToken();
    if (!token) return;

    const res = await messageApi.getMessages(token, chatId, 1, 50);
    const formatted: Msg[] = res.messages.map((m: any) => ({
      id: String(m.message_id),
      role: m.message_type === "user" ? "user" : "assistant",
      content: m.message_text,
    }));
    setMessages(formatted);
  } catch (err: any) {
    console.error("Load messages error:", err);
  
    if (err?.message?.includes("No messages found") || err?.message?.includes("404")) {
      setMessages([]); 
    } else {
      
      toast.error("Failed to load messages. Please refresh.");
    }
  } finally {
    setInitialLoading(false);
  }
};

  useEffect(() => {
    loadMessages();
  }, [chatId]);


  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "48px";
    el.style.height = Math.min(el.scrollHeight, 400) + "px";
  };

  const resetTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "48px";
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const token = await getToken();
    if (!token) return;

    setLoading(true);

    const userId = crypto.randomUUID();
    const botId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: text },
      { id: botId, role: "assistant", content: "Thinking..." },
    ]);

    setInput("");
    resetTextarea();

    try {
      const res = await messageApi.sendMessage(token, chatId, text);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, content: res.reply } : m
        )
      );
    } catch (err) {
      console.error(err);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? { ...m, content: "❌ Error generating response" }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const stopGenerating = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  };


  if (initialLoading) {
    return <MessageSkeleton />;
    
  }

  
  return (
    <div className="flex flex-col h-full bg-[#0b0b0b] text-white">

    
      <div className="p-4 border-b border-gray-800 flex justify-between text-sm text-gray-400">
        
           <div className="text-white text-center w-full">{chatName}</div>
       

        {loading && (
          <button
            onClick={stopGenerating}
            className="px-3 py-1 text-xs bg-red-600 rounded"
          >
            Stop
          </button>
        )}
      </div>


      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Start messaging with{" "}
          <span className="text-white ml-1">{chatName}</span>
        </div>
      )}


      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="relative group max-w-[70%]">
              <button
                onClick={() => copyToClipboard(m.content)}
                className=" cursor-pointer absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition text-xs bg-gray-700 px-2 py-1 rounded"
              >
                Copy
              </button>

          
              <div
                className={`px-4 py-2 rounded-2xl text-sm break-words ${
                  m.role === "user"
                    ? "bg-blue-600"
                    : "bg-gray-800"
                }`}
              >
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

    
      <div className="p-4 border-t border-gray-800 flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          disabled={loading}
          rows={1}
          placeholder="Message..."
          className="flex-1 p-4 bg-gray-900 rounded-xl text-sm resize-none min-h-[48px] max-h-[400px] disabled:opacity-60"
          onChange={(e) => {
            setInput(e.target.value);
            autoResize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}