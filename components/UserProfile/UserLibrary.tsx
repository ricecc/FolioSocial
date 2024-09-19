import React from 'react'

import Link from 'next/link'

import BookCoverPreview from '../Feed/BookCoverPreview'

interface posts {
  _id: string,
  book: {
    id: string,
    title: string,
    author: string,
  }
  image: string
}
interface props {
  posts: any[],
  isYourPost: boolean
}
const UserLibrary = ({ posts, isYourPost }: props) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto mt-3">
      {posts.length > 0 ? (
        posts.map((post: any, index: number) => {
          return (
            <div key={post._id} className='flex flex-col cursor-pointer mb-10 w-[320px] sm:w-[250px] md:w-[450px] shadow-xl'>
              <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center relative">
                <div className='flex flex-row items-center  space-x-2 p-3 h-1/6 w-full'>
                
                </div>
                <Link  href={isYourPost?`/your-posts/${post._id}`:`/post/${post._id}`} className='h-5/6 w-full'>
                  <BookCoverPreview bookCover={post.image} />
                </Link>
              </div>
              <div className='flex flex-col p-3'>
                <div className='flex flex-col items-end justify-end pt-2 pb-2'>
                  Modifica
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

  )
}

export default UserLibrary
