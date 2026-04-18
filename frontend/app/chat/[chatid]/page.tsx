
import ChatClient from "@/app/components/ChatClient";
import { chatApi } from "@/app/lib/chat.api";
import { auth } from "@clerk/nextjs/server";

export default async function ChatPage({
  params,
}: {
   params: Promise<{ chatid: string }>;
}) {
   const { chatid } = await params;
  let chatName = "";
  let initialMessages: any[] = [];
  const { getToken } =  await auth();
  const token = await getToken();

  try {
    const data = await chatApi.getChatById(token!, chatid);
     console.log("Chat data loaded:", data);
    chatName = data?.chat?.name || "Chat";

    initialMessages =
      data?.chat?.messages?.map((m: any) => ({
        role: m.message_type === "user" ? "user" : "bot",
        content: m.message_text,
      })) || [];
  } catch (err) {
    // return (
    //   <div className="text-red-500 text-sm">
    //     Failed to load chat
    //   </div>
    // );
   
  }

  return (
    <ChatClient
      chatId={chatid}
      initialMessages={initialMessages}
      chatName={chatName}
    />
  );
}