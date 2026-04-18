import Sidebar from "../components/SideBar";


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-[20%] bg-black text-white">
        <Sidebar />
      </aside>

      <main className="w-[80%] bg-[#0f0f0f] text-white">
        {children}
      </main>
    </div>
  );
}