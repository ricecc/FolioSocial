import React from 'react'
import Post from '../post/Post'
import Link from 'next/link'

interface posts {
  id: string,
  book: {
    id: string,
    title: string,
    author: string,
  }
  image: string
}
interface props {
  posts: posts[],
  isYourPost:boolean
}
const UserLibrary = ({ posts,isYourPost }: props) => {
  return (
    <div className=' columns-1  lg:columns-4'>
      {posts.map((post: any) => (
        <div className="w-44 md:w-52 h-auto mb-4 flex-col drop-shadow-2xl ">
          <div className="group relative ">
            <Link href={isYourPost?`/your-posts/${post.id}`:`/post/${post.id}`}>
              <figure>
                <img src={post.image} className="transition-opacity duration-300 cursor-pointer  " alt={""} />
              </figure>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserLibrary
