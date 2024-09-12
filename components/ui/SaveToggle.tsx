'use client';
import { removeSaveQuote, removeSaveReview, removeSaveImage, saveImage, saveQuote, saveReview } from '@/lib/actions/user.actions';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface Props {
  fromUserId: string;
  type:"quote" | "review" | "picture";
  toElement:string;
  numLike: number;
  liked: boolean;
 
}

const SaveToggle = ({ fromUserId, toElement,type, numLike, liked }: Props) => {
  const [isClicked, setIsClicked] = useState<boolean>(liked);
  const [likeCount, setLikeCount] = useState<number>(numLike);
  const path = usePathname();

  const handleClick = async () => {
    if (isClicked) {
      if(type==="quote")
        await removeSaveQuote({ fromUserId, toElement,path });
      if(type==="review")
        await removeSaveReview({ fromUserId, toElement,path });
      if(type==="picture")
        await removeSaveImage({ fromUserId, toElement,path });
      setLikeCount(likeCount - 1);
    } else {
      if(type==="quote")
        await saveQuote({ fromUserId, toElement,path });
      if(type==="review")
        await saveReview({ fromUserId, toElement,path });
      if(type==="picture")
        await saveImage({ fromUserId, toElement,path });
      setLikeCount(likeCount + 1);
    }
    setIsClicked(!isClicked);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer object-contain">
      {isClicked || liked ? (
        <div className="flex justify-center items-center flex-row space-x-5">
          <img
            src="/assets/bookMarkFill.svg"
            alt="heart filled"
            width={24}
            height={10}
          />
          {likeCount}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-row space-x-5">
          <img
            src="/assets/bookMarkEmpty.svg"
            alt="heart"
            width={24}
            height={10}
          />
          {likeCount}
        </div>
      )}
    </div>
  );
};

export default SaveToggle;
