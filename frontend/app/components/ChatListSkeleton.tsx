export default function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
    
      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-2" />

 
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded"
          >
      
            <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />

            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-3/4 bg-gray-700 rounded animate-pulse" />
              <div className="h-2 w-1/2 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}