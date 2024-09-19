// components/Feed/MainFeedSection.tsx
"use client";
import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFeed } from '@/context/FeedContext';
import HeartToggle from '../ui/HeartToggle';
import QuotePreview from './QuotePreview';
import ImagePostPreview from './ImagePostPreview';
import BookCoverPreview from './BookCoverPreview';
import DialogLike from '../UserProfile/DialogLike';
import LikeSection from '../post/LikeSection';
import CommentSection from '../post/CommentSection';
import Image from 'next/image';

interface UserProps {
  _id: string;
  id: string;
  image: string;
  name: string;
  lastName: string;
  username: string;
}

interface Props {
  currentUserInfo: any;
}

const MainFeedSection: React.FC<Props> = ({ currentUserInfo }) => {
  const { feed, loading, hasMore, loadMorePosts } = useFeed();
  const pathname = usePathname();
  const isOnYourPosts = pathname === '/your-posts';

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto mt-3">
        {feed.length > 0 ? (
          feed.map((post: any, index: number) => {
            

            return (
              <div key={post._id} className='flex flex-col cursor-pointer mb-10 w-[320px] sm:w-[250px] md:w-[450px] shadow-xl'>
                <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center relative">
                  <div className='flex flex-row items-center space-x-2 p-3 h-1/6 w-full'>
                    <Image src={post.author.image} alt={post.author.username} width={28} height={28} className="object-cover rounded-full w-8 h-8" />
                    <Link href={`/profile/${post.author.id}`}>
                      <p>{post.author.username}</p>
                    </Link>
                  </div>
                  <Link href={`/post/${post._id}`} className='h-5/6 w-full'>
                    {index % 4 === 0 && post.quotes.length > 0 ? (
                      <QuotePreview quote={post.quotes[0].quote} />
                    ) : index % 2 === 0 ? (
                      <ImagePostPreview imagePost={post.postImages[0]} bookCover={post.image} />
                    ) : (
                      <BookCoverPreview bookCover={post.image} />
                    )}
                  </Link>
                </div>
                <div className='flex flex-col p-3'>
                  <div className='flex flex-col space-y-1 justify-between pt-2 pb-2'>
                    <LikeSection
                      fromUserImage={currentUserInfo.imageCurrentUser}
                      fromUserUsername={currentUserInfo.usernameViewer}
                      userLiked={post.like}
                      numLike={post.like.length}
                      fromUserId={currentUserInfo._idUser}
                      toElement={post._id}
                      liked={currentUserInfo.postLiked.includes(post._id.toString())}
                      isSaved={false}
                      type="post"
                    />
                  </div>
                  <div>
                    <p className='font-md font-medium hover:text-hoverTag'>{post.book.title}</p>
                    <p className='text-sm'>{post.book.author}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No posts available</p>
        )}
      </section>
      <section className="w-full h-16 flex justify-center items-center mb-14">
        {feed.length > 0 && hasMore && (
          loading ? (
            <div className="flex flex-row space-x-1 items-center justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
                <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
                <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
              </div>
            </div>
          ) : (
            <div onClick={loadMorePosts} className="text-black cursor-pointer flex flex-col justify-center items-center space-y-2">
              <p>Load more</p>
              <img src="/assets/loadMore.svg" className="animate-pulse" alt="plus" width={24} height={24} />
            </div>
          )
        )}
      </section>
    </>
  );
};

export default memo(MainFeedSection);
