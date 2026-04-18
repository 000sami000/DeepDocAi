"use client";
import { useRef } from "react";
import { IoSend } from "react-icons/io5";

export default function PromptInput({
  onSend,
}: {
  onSend: (message: string) => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const value = inputRef.current?.value.trim();
    if (!value) return;

    onSend(value);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full flex justify-center p-4 ">
      <div className="w-full max-w-3xl bg-[#3a3a3a] rounded-2xl flex items-end px-3 py-2 shadow-md  shadow-purple-300">
        
        <textarea
          ref={inputRef}
          rows={1}
          placeholder="Message..."
          className="flex-1 resize-none bg-transparent text-white outline-none px-2 py-2 max-h-40"
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          className="bg-purple-500 hover:bg-purple-600 transition p-2 rounded-xl ml-2"
        >
          <IoSend className="text-white text-lg" />
        </button>
      </div>
    </div>
  );
}