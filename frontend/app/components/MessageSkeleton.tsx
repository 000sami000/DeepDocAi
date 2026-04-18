
export default function MessageSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#0b0b0b] text-white">

      <div className="p-4 border-b border-gray-800">
        <div className="h-5 w-32 bg-gray-700 rounded animate-pulse mx-auto" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
   
        <div className="flex justify-start">
          <div className="max-w-[70%] space-y-2">
            <div className="h-4 w-48 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>

       
        <div className="flex justify-end">
          <div className="max-w-[70%] space-y-2">
            <div className="h-4 w-56 bg-blue-600/30 rounded animate-pulse" />
            <div className="h-4 w-36 bg-blue-600/30 rounded animate-pulse" />
          </div>
        </div>

  
        <div className="flex justify-start">
          <div className="max-w-[70%] space-y-2">
            <div className="h-4 w-52 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-44 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

   
      <div className="p-4 border-t border-gray-800">
        <div className="h-12 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}