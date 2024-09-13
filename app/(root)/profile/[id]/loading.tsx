import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-screen flex-col">
      <div className="w-full h-full">
        <div className="flex flex-col justify-center items-center w-full bg-slate-100 h-60 animate-pulse">
          <div className="h-auto flex flex-col justify-center items-center md:w-1/4 md:ml-8 mb-3 md:mb-0 bg-slate-100">
            <Skeleton className="w-24 h-24 rounded-full bg-slate-200 animate-pulse" />
            <div className="mt-4">
              <Skeleton className="h-6 w-40 mb-2 animate-pulse" />
              <Skeleton className="h-4 w-24 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full flex flex-col items-center">
        <div className="w-11/12 max-w-screen-lg">
          <Skeleton className="h-8 w-32 mb-4 animate-pulse" />
          <Skeleton className="h-6 w-48 mb-6 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-lg">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col cursor-pointer mb-10 w-[320px] sm:w-[250px] md:w-[450px] shadow-xl"
            >
              <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center relative">
                <div className="flex flex-row items-center space-x-2 p-3 h-1/6 w-full">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-5/6 w-full" />
              </div>
              <div className="flex flex-col p-3">
                <Skeleton className="h-8 w-8 rounded-full mb-2" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
