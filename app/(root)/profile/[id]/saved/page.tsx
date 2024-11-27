import UserSaved from "@/components/UserProfile/UserSaved";
import { fetchUserInfoForProfile } from "@/lib/actions/user.actions";


export default async function Page({ params }: { params: { id: string } }) {
    const userInfo = await fetchUserInfoForProfile(params.id)

    return (
        <UserSaved quoteSaved={userInfo.quoteSaved}
            reviewSaved={userInfo.reviewSaved}
            savedBooks={userInfo.savedBooks}
            imageSaved={userInfo.imageSaved} />
    );
}