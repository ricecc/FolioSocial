import { Skeleton } from "@/components/ui/skeleton";
export default function LoadingSubComment() {
    return (
        <div className="flex flex-col space-y-4 mt-4">
        {[...Array(1)].map((_, index) => (
            <div key={index} className="flex flex-row space-x-2">
            <div className='flex flex-row items-start space-x-1'>
                <div className='border-l-2 border-b-2 border-gray-300 w-5 h-3'></div>
                <Skeleton className="w-6 h-6 rounded-full" />
            </div>
            <div className="flex-1">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-36 h-3 mt-2 rounded" />
            </div>
        </div>
        ))}
    </div>
    )
}