
import Link from "next/link";
import Auth from "./Auth";
import ChatList from "./ChatList";
import UploadButton from "./UploadButton";
import { auth } from "@clerk/nextjs/server";

export default async function Sidebar() {
  const { userId } = await auth();

  return (
    <div className="h-full flex flex-col p-3 bg-black text-white">
      <Link href="/chat" className=" text-white text-xl font-bold mb-4 bg-gradient-to-r  bg-clip-text text-transparent cursor-pointer">
        DeepDoc AI
      </Link>

      {userId ? (
        <UploadButton />
      ) : (
        <div>Please log in to upload files</div>
      )}

      <div className="flex-1 overflow-y-auto mt-4">
        <ChatList />
      </div>

      <div className="mt-auto pt-3 border-t border-gray-800">
        <Auth />
      </div>
    </div>
  );
}