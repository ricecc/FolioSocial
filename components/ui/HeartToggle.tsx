'use client';
import { putLike, removeLike } from '@/lib/actions/user.actions';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface Props {
  fromUserId: string;
  toPostId: string;
  numLike: number;
  liked: boolean;
 
}

const HeartToggle = ({ fromUserId, toPostId, numLike, liked }: Props) => {
  const [isClicked, setIsClicked] = useState<boolean>(liked);
  const [likeCount, setLikeCount] = useState<number>(numLike);
  const path = usePathname();
  console.log(path)
  const handleClick = async () => {
    if (isClicked) {
      await removeLike({ fromUserId, toPostId,path });
      setLikeCount(likeCount - 1);
    } else {
      await putLike({ fromUserId, toPostId,path });
      setLikeCount(likeCount + 1);
    }
    setIsClicked(!isClicked);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer object-contain">
      {isClicked ? (
        <div className="flex justify-center items-center flex-row space-x-5">
          <img
            src="/assets/heart-filled.svg"
            alt="heart filled"
            width={24}
            height={24}
          />
          {likeCount}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-row space-x-5">
          <img
            src="/assets/heart-gray.svg"
            alt="heart"
            width={24}
            height={24}
          />
          {likeCount}
        </div>
      )}
    </div>
  );
};

export default HeartToggle;
