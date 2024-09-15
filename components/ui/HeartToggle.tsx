'use client';
import { putLikeToPost, removeLikeToPost } from '@/lib/actions/posts.actions';
import { putLikeToQuote, removeLikeToQuote } from '@/lib/actions/quote.actions';
import { putLikeToReview, removeLikeToReview } from '@/lib/actions/review.actions';
import { putLikeToImage, removeLikeToImage } from '@/lib/actions/user.actions';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface Props {
  fromUserId: string;
  type: "quote" | "post" | "review" | "picture";
  toElement: string;
  liked: boolean;
  setCount: (value: number) => void; 
  count: number;
  updateLikedList: (isLiked: boolean) => void; 
}

const HeartToggle = ({ fromUserId, toElement, type, liked, setCount, count, updateLikedList }: Props) => {
  const [isClicked, setIsClicked] = useState<boolean>(liked);
  const [tempLiked, setTempLiked] = useState<boolean>(false)
  const path = usePathname();

  const handleClick = async () => {
    const previousIsClicked = isClicked;
    const newCount = isClicked ? count - 1 : count + 1;
    
    
    setIsClicked(!isClicked);
    setCount(newCount);
    updateLikedList(isClicked); 

    try {
      if (isClicked) {
        switch (type) {
          case "post":
            await removeLikeToPost({ fromUserId, toElement, path });
            break;
          case "quote":
            await removeLikeToQuote({ fromUserId, toElement, path });
            break;
          case "review":
            await removeLikeToReview({ fromUserId, toElement, path });
            break;
          case "picture":
            await removeLikeToImage({ fromUserId, toElement, path });
            break;
          default:
            throw new Error("Tipo non supportato");
        }
      } else {
        switch (type) {
          case "post":
            await putLikeToPost({ fromUserId, toElement, path });
            break;
          case "quote":
            await putLikeToQuote({ fromUserId, toElement, path });
            break;
          case "review":
            await putLikeToReview({ fromUserId, toElement, path });
            break;
          case "picture":
            await putLikeToImage({ fromUserId, toElement, path });
            break;
          default:
            throw new Error("Tipo non supportato");
        }
      }
    } catch (error) {
     
      alert("Errore nell'aggiornare il like, riprova più tardi");
      setIsClicked(previousIsClicked);
      setCount(previousIsClicked ? newCount + 1 : newCount - 1);
      updateLikedList(!isClicked); 
    }
  };

  return (
    <div className="cursor-pointer object-contain">
      {isClicked ? (
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
