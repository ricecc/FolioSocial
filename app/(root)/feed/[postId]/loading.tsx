import React from "react";
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <div className="h-full flex-col flex justify-start items-center ">
      <section className="flex h-auto justify-center flex-col w-full">
        <div className="w-full flex flex-col lg:flex-row lg:h-[374px]">
          <div className="bg-zinc-50 min-h-48 pt-6 p-5 border flex flex-col justify-between lg:w-1/2">
            <div className="pt-5 space-y-2">
              <Skeleton className="h-10 w-3/4 lg:h-16 lg:w-2/3" />
              <Skeleton className="h-6 w-1/2 lg:h-10 lg:w-1/3" />
            </div>
            <div className="flex flex-col items-end">
              <Skeleton className="h-6 w-1/4 lg:h-8 lg:w-1/6" />
            </div>
          </div>
          <div className="bg-gradient-to-b from-white to-zinc-200 min-h-48 flex justify-center items-center p-5 lg:p-0 lg:w-1/2">
            <Skeleton className="h-64 w-48 lg:h-72 lg:w-64" />
          </div>
        </div>
        <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-span-1 p-4 min-h-48 border flex justify-between flex-col space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex h-16 justify-center flex-row w-2/3 bg-slate-950 text-zinc-50 mt-10 mb-10">
        <div className="w-1/2 flex justify-center items-center">
          <Skeleton className="h-10 w-2/3" />
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <Skeleton className="h-10 w-2/3" />
        </div>
      </section>
    </div>
  );
};

export default Loading;