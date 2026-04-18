
"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { chatApi } from "../lib/chat.api";
import { toast } from "sonner";

export default function UploadButton() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    setIsUploading(true);
    const toastId = toast.loading("Uploading PDF...");
    try {
      const token = await getToken();
      await chatApi.createChat(token!, file);
      toast.success("PDF uploaded successfully!", { id: toastId });
      
      window.dispatchEvent(new CustomEvent("chats-updated"));
      
      
      router.push("/chat");
    } catch (err: any) {
      toast.error(err.message || "Upload failed. Please try again.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const pickFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
    };
    input.click();
  };

  return (
    <button
      onClick={pickFile}
      disabled={isUploading}
      className={`bg-white text-black p-2 rounded cursor-pointer transition hover:bg-gray-200 ${
        isUploading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isUploading ? "Uploading..." : "Upload PDF"}
    </button>
  );
}