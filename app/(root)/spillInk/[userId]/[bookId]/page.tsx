import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";


async function page({ params }: { params: { userId: string, bookId: string } }) {
    if (!params.userId && !params.bookId) return null;
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    return (
        <>
            <p>userId: {params.userId}</p>
            <p>bookId: {params.bookId}</p>
        </>

    );
}

export default page;