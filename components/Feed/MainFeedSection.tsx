"use client";
import React, { memo, useRef, useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import QuotePreview from './QuotePreview';
import ImagePostPreview from './ImagePostPreview';
import BookCoverPreview from './BookCoverPreview';
import LikeSection from '../post/LikeSection';
import Image from 'next/image';
import { fetchPostsFeed } from '@/lib/actions/posts.actions';
import { useFeed } from '@/context/FeedContext';




interface Props {
  currentUserInfo: any;
  initalFeed: any[]
}

const MainFeedSection: React.FC<Props> = ({ currentUserInfo, initalFeed }) => {
  const [feed, setFeed] = useState<any[]>(initalFeed);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { setPosts } = useFeed()
  const pathname = usePathname();

  const observerRef = useRef<HTMLDivElement | null>(null);


  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        loadMorePosts();
      }
    },
    [hasMore, loading]
  );
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPage = page + 1;
      const newFeed = await fetchPostsFeed(newPage, 6);

      setHasMore(newFeed.posts.length >= 6);
      setFeed((prevFeed) => [...prevFeed, ...newFeed.posts]);

      setPosts(newFeed.posts)

      setPage(newPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);


  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]);

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
                    <Link href={`/profile/${post.author.id}/library`}>
                      <p>{post.author.username}</p>
                    </Link>
                  </div>
                  <Link href={{
                    pathname: `/feed/${post._id}`,
                    query: { title: post.book.title, author: post.book.author, bookCover:post.image,authorId:post.author.id,authorImage:post.author.image,authorUsername:post.author.username },
                  }}
                    className='h-5/6 w-full'>
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
          <></>
        )}
      </section>


      <section className="w-full h-16 flex justify-center items-center mb-14" ref={observerRef}>
        {loading && (
          <div className="flex flex-row space-x-1 items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default MainFeedSection;
