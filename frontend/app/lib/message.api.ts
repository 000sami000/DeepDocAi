import { apiClient } from "./apiClient";

export const messageApi = {
  
  sendMessage: (token: string, chatId: string, message: string) =>
    apiClient<{ reply: string; sources?: any[] }>("/messages", {
      method: "POST",
      token,
      body: {
        chatId,
        message,
      },
    }),


  getMessages: (
    token: string,
    chatId: string,
    page: number = 1,
    limit: number = 20
  ) =>
    apiClient<{
      messages: any[];
      page: number;
      total: number;
      hasMore: boolean;
    }>(`/messages/${chatId}?page=${page}&limit=${limit}`, {
      method: "GET",
      token,
    }),

  streamMessage: async (
  token: string,
  chatId: string,
  message: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) => {
  if (!chatId) {
    throw new Error("chatId is missing in streamMessage");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId, message }),
      signal,
    }
  );

  if (!res.body) throw new Error("No stream available");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
},
}