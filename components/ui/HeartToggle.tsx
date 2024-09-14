'use client';
import { putLikeToPost, removeLikeToPost } from '@/lib/actions/posts.actions';
import { putLikeToQuote, removeLikeToQuote } from '@/lib/actions/quote.actions';
import { putLikeToReview, removeLikeToReview } from '@/lib/actions/review.actions';
import { putLikeToImage, removeLikeToImage } from '@/lib/actions/user.actions';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import DialogLike from '../UserProfile/DialogLike';



interface Props {
  fromUserId: string;
  type:"quote" | "post" | "review" | "picture";
  toElement:string;
  numLike: number;
  liked: boolean;
  
}

const HeartToggle = ({ fromUserId, toElement,type, numLike, liked }: Props) => {
  const [isClicked, setIsClicked] = useState<boolean>(liked);
  const [likeCount, setLikeCount] = useState<number>(numLike);
  const path = usePathname();

  const handleClick = async () => {
    if (isClicked) {
      if(type==="post")
        await removeLikeToPost({ fromUserId, toElement,path });
      if(type==="quote")
        await removeLikeToQuote({ fromUserId, toElement,path });
      if(type==="review")
        await removeLikeToReview({ fromUserId, toElement,path });
      if(type==="picture")
        await removeLikeToImage({ fromUserId, toElement,path });
      setLikeCount(likeCount - 1);
    } else {
      if(type==="post")
        await putLikeToPost({ fromUserId, toElement,path });
      if(type==="quote")
        await putLikeToQuote({ fromUserId, toElement,path });
      if(type==="review")
        await putLikeToReview({ fromUserId, toElement,path });
      if(type==="picture")
        await putLikeToImage({ fromUserId, toElement,path });
      setLikeCount(likeCount + 1);
    }
    setIsClicked(!isClicked);
  };

  return (
    <div className="cursor-pointer object-contain">
      {isClicked && liked ? (
        <div className="flex justify-center items-center flex-row space-x-3">
          <img
            src="/assets/heart-filled.svg"
            alt="heart filled"
            width={24}
            height={24}
            onClick={handleClick}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-row space-x-3">
          <img
            src="/assets/heart-gray.svg"
            alt="heart"
            width={24}
            height={24}
            onClick={handleClick}
          />
        </div>
      )}
    </div>
  );
};

export default HeartToggle;
