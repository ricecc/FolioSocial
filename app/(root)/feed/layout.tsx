
import { FeedProvider } from "@/context/FeedContext";
import { usePathname } from "next/navigation";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <FeedProvider>
            {children}
        </FeedProvider>


    );
}