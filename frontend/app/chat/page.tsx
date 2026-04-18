export default function ChatHome() {
  return (
    <div className="h-full flex items-center justify-center bg-[#0f0f0f] text-gray-400">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-white">
          No chat selected
        </h1>
        <p className="mt-2 text-sm">
          Select a chat from the sidebar to start conversation
        </p>
      </div>
    </div>
  );
}