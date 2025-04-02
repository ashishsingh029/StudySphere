import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex flex-1 flex-col h-[calc(86vh)] p-4">

      {/* Chat Messages Skeleton */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            {index % 2 === 0 && <Skeleton className="size-8 mr-3 rounded-full" />}
            <div className="flex flex-col max-w-[75%] space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-[200px] rounded-lg" />
            </div>
            {index % 2 !== 0 && <Skeleton className="size-8 ml-3 rounded-full" />}
          </div>
        ))}
      </div>

      {/* Message Input Skeleton */}
      <div className="flex items-center space-x-2 mt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
