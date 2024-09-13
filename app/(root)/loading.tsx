import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const items = Array(3).fill(null); // Array to map over for rendering 3 skeleton items

  return (
    <div className="h-full gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto mt-3 flex justify-center">
      {items.map((_, index) => (
        <div key={index} className="flex flex-col cursor-pointer mb-10 w-[320px] sm:w-[250px] md:w-[450px] shadow-xl">
          <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center relative">
            <div className="flex flex-row items-center space-x-2 p-3 h-1/6 w-full">
              <Skeleton className="w-7 h-7 rounded-full animate-pulse" />
              <Skeleton className="h-4 w-1/2 animate-pulse" />
            </div>
            <div className="h-5/6 w-full">
              <Skeleton className="w-full h-full animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col p-3">
            <div className="flex flex-row space-x-2 justify-end pt-2 pb-2">
              <Skeleton className="w-8 h-8 rounded-full animate-pulse" />
            </div>
            <div>
              <Skeleton className="h-5 w-3/4 mb-2 animate-pulse" />
              <Skeleton className="h-4 w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
