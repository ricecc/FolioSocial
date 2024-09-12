import React from 'react'
import Post from '../post/Post'

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
  posts: posts[]
}
const UserLibrary = ({ posts }: props) => {
  return (
    <div className='flex columns-3 justify-center gap-6'>
      {posts.map((post: any) => (
        <div className="w-40 md:w-52 h-auto mb-4 flex-col drop-shadow-2xl ">
          <div className="group relative ">
            <figure>
              <img src={post.image} className="transition-opacity duration-300 cursor-pointer  " alt={""} />
            </figure>
            <div className="absolute inset-0 bg-transparent transition-opacity duration-300 group-hover:bg-slate-950 group-hover:bg-opacity-50 cursor-pointer" >
              <div className='absolute bottom-6 right-2 invisible group-hover:visible'>
                <div className='flex justify-center items-center flex-row space-x-1'>
                 
                  <p className='text-white '>{}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserLibrary
