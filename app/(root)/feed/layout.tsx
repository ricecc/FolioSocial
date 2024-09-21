import { FeedProvider } from "@/context/FeedContent";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <FeedProvider>
            {children}
        </FeedProvider>
    );
}