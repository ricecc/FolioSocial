"use client";
import { useState, useCallback, useMemo } from "react";
import { fetchPostsFeed, fetchSimilarPosts } from "@/lib/actions/posts.actions";
import MainFeedSection from "@/components/Feed/MainFeedSection";
import { Skeleton } from "../ui/skeleton";
import SimilarFeedSection from "./SimilarFeedSection";

interface FeedClientProps {
  initialPosts: any[];
  currentUserInfo: any;
  parentId:string;
}

const SimilarPostsFeed: React.FC<FeedClientProps> = ({ initialPosts, currentUserInfo,parentId }) => {
  const [feed, setFeed] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPage = page + 1;
      const newFeed = await fetchSimilarPosts(parentId);

      setHasMore(newFeed.posts.length >= 6);
      setFeed((prevFeed) => [...prevFeed, ...newFeed.posts]);
      setPage(newPage);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  const filteredPosts = useMemo(() => feed.map((post) => ({
    ...post,
    usersLiked: post.like.map((user: any) => ({
      _id: user._id,
      id: user.id,
      image: user.image,
      username: user.username,
      name: user.name,
      lastName: user.lastName,
    })),
  })), [feed]);

  return (
    <>
      <section className="h-full gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto mt-3 flex justify-center">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: any, index: number) => (
            <SimilarFeedSection
              key={post._id}
              imageCurrentUser={currentUserInfo.imageCurrentUser}
              numComment={post.comments}
              usernameViewer={currentUserInfo.usernameViewer}
              usersLiked={post.usersLiked}
              isLiked={currentUserInfo.postLiked.includes(post._id.toString())}
              index={index}
              postId={post._id.toString()}
              quote={post.quotes[0]?.quote || ""}
              imagePost={post.postImages[0]}
              bookCover={post.image}
              bookTitle={post.book.title}
              bookAuthor={post.book.author}
              userImage={post.author.image}
              userId={currentUserInfo.userId}
              username={post.author.username}
              postAuthorId={post.author.id}
            />
          ))
        ) : (
          <h1>Il feed è vuoto</h1>
        )}
      </section>
      <section className="w-full h-16 flex justify-center items-center mb-14">
        {filteredPosts.length > 0 && (
          hasMore ? (
            loading ? (
              <div className="flex flex-row space-x-1 items-center justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full scaleAnimation"></div>
                </div>
              </div>
            ) : (
              <>
                {/**<div onClick={loadMorePosts} className="text-black cursor-pointer flex flex-col justify-center items-center space-y-2">
                <p>Load more</p>
                <img src="/assets/loadMore.svg" className="animate-pulse" alt="plus" width={24} height={24} />
              </div> */}
              </>
            )
          ) : null
        )}
      </section>
    </>
  );
};

export default SimilarPostsFeed;
