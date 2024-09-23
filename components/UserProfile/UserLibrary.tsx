import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FaHeart } from "react-icons/fa";
import DeletePost from './DeletePost';
import { Badge } from "@/components/ui/badge"
// Import dinamico per BookCoverPreview e DeletePost
const BookCoverPreview = dynamic(() => import('../Feed/BookCoverPreview'));


interface Post {
  _id: string;
  book: {
    id: string;
    title: string;
    author: string;
  };
  image: string;
  like: string[]
}

interface Props {
  posts: Post[];
  isYourPost: boolean;
}

const UserLibrary = ({ posts, isYourPost }: Props) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto mt-3">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="flex flex-col cursor-pointer mb-10 w-[320px] sm:w-[250px] md:w-[450px] shadow-xl"
          >
            <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center relative">
              <div className="flex flex-row items-center justify-end space-x-2 p-3 h-1/6 w-full">

                <div className='flex flex-row items-center'>
                  {isYourPost ? (
                    <>
                      <DeletePost postId={post._id} />
                      <Badge variant="secondary">Modifica</Badge>
                    </>
                  ) : (
                    <>
                    
                    </>
                  )}

                </div>
              </div>
              <Link
                href={isYourPost ? `/your-posts/${post._id}` : `/feed/${post._id}`}
                className="h-5/6 w-full"
              >
                <BookCoverPreview bookCover={post.image} />
              </Link>
            </div>
            <div className="flex flex-col p-3">
              <div className="flex flex-col items-end justify-end pt-2 pb-2">
                <Badge className='flex flex-row space-x-1 items-center '>
                  <FaHeart /> {post.like ? post.like.length : 0}
                </Badge>
              </div>
              <div>
                <p className="font-md font-medium hover:text-hoverTag">
                  {post.book.title}
                </p>
                <p className="text-sm">{post.book.author}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </section>
  );
};

export default React.memo(UserLibrary);
