import { currentUser } from "@clerk/nextjs";
import { fetchUser, fetchUserInfoForProfile, startFollow } from "@/lib/actions/user.actions";
import MainSectionProfile from "@/components/UserProfile/MainSectionProfile";
import FollowButton from "@/components/UserProfile/FollowButton";
import DialogFollower from "@/components/UserProfile/DialogFollower"


async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  let fromUser

  if (!user)
    return null
  else
    fromUser = await fetchUser(user?.id)

  const userToWatch = await fetchUserInfoForProfile(params.id)


  
  const isFollowing = userToWatch.follower.some(
    (follower: any) => follower._id.toString() === fromUser._id.toString()
  );

  return (
    <div className="flex justify-center items-center w-screen flex-col ">
      <div className="w-full  h-full  ">
        <div className="flex flex-col justify-center items-center  w-full  bg-slate-100 h-72 ">
          <div className="h-auto  flex flex-col justify-center items-center md:w-1/4 md:ml-8  mb-3 md:mb-0 bg-slate-100 ">
            <img src={userToWatch.image} className="w-24 h-24 rounded-full object-cover  border-spacing-52" alt=""  />
            <div className="felx flex-col justify-center space-y-2">
              <div className="flex flex-col justify-center items-center  space-y-4">
                {userToWatch.lastName ? (
                  <p className="text-xl font-bold pt-2">{userToWatch.name} {userToWatch.lastName}</p>
                ) : (
                  <p className="text-xl font-bold pt-2 flex justify-center items-center"><span>{userToWatch.name}</span></p>
                )}
                <FollowButton fromUserId={fromUser._id.toString()} toUserId={userToWatch._id.toString()} alreadyFollow={isFollowing}></FollowButton>
              </div>
              <div className="flex flex-row space-x-1">
                <p className="text-sm font-sans pb-2">@{userToWatch.username} -</p>
                <DialogFollower numFollower={userToWatch.follower.length} followerUsers={userToWatch.follower} />
              </div>

            </div>
          </div>
        </div>
      </div>
      <MainSectionProfile
        posts={userToWatch.posts}
        quoteSaved={userToWatch.quoteSaved}
        reviewSaved={userToWatch.reviewSaved}
        savedBooks={userToWatch.savedBooks}
        imageSaved={userToWatch.imageSaved} />
    </div>
  )
}


export default page;