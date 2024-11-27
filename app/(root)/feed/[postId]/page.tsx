import PostPageMain from '@/components/Feed/PostPageMain';
import NavigationPosts from '@/components/post/NavigationPosts';
import WantToRead from '@/components/post/saveButton/PostWantToRead';
import { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { Badge } from "@/components/ui/badge"
export const metadata: Metadata = {
  title: 'Post Details',
};

export default function page({
  searchParams,
  params,
}: {
  searchParams?: {
    title?: string;
    author?: string;
    bookCover?: string
    authorId?: string
    authorImage?: string,
    authorUsername?: string,
  };
  params: {
    postId: string;
  };
}) {
  // Recupera i parametri dalla query string
  const title = searchParams?.title || 'Unknown Title';
  const author = searchParams?.author || 'Unknown Author';
  const bookCover = searchParams?.bookCover ? decodeURIComponent(searchParams.bookCover) : '';
  const authorId = searchParams?.authorId || 'Unknown Post Author';
  const authorImage = searchParams?.authorImage || 'Unknown author image';
  const authorUsername = searchParams?.authorUsername || 'Unknow author username'
  const postId = params.postId
  return (
    <main className=''>
      <section className=' h-min flex flex-col lg:flex-row ml-6 mr-6 rounded-[30px] mt-3  ' style={{ backgroundColor: '#F7F4ED', color: '#242424' }}>
        <div className='lg:w-1/2    flex flex-col  '>
          <div className='h/12  pt-10 pl-12 '>
            <div className='space-y-6'>
              <h1 className='text-6xl font-montserrat'>{title}</h1>
              <p className='text-xl font-montserrat'>{author}</p>
            </div>
            <div className='flex flex-row space-x-2 mt-8 '>
              <Badge>Narrativa italiana</Badge>
              <Badge>Romanzo</Badge>
              <Badge>Moderno</Badge>
            </div>
          </div>
          <div className='flex justify-between items-center  h-1/2 '>
            <div className='relative'>
              <Image
                src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ya0lkdGVDZlRrNWRXdTdzYU0wWnBJaVJwdmwifQ"
                className="absolute z-50 bg-zinc-50 border border-zinc-50 rounded-full text-black"
                width="38"
                height="38"
                alt=""
              />
              <Image
                src="https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yalRBN2x4TmVSSVBTeUVqajA5NDZ3WjBSbFkiLCJyaWQiOiJ1c2VyXzJrRnRGUjdrZ01XN1RYNUJPcHhRdzc2bXdZUyJ9"
                className="absolute z-40 bg-zinc-50 border border-zinc-50 rounded-full text-black left-7"
                width="38"
                height="38"
                alt=""
              />
              <Image
                src="https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yalRBN2x4TmVSSVBTeUVqajA5NDZ3WjBSbFkiLCJyaWQiOiJ1c2VyXzJrRlhsZTIxS3gzVmowMWtjQVBLT1l2NjdzcSIsImluaXRpYWxzIjoiUkMifQ"
                className="absolute z-30 bg-zinc-50 border border-zinc-50 rounded-full  text-black left-[56px]"
                width="38"
                height="38"
                alt=""
              />
              <Image
                src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybTZFOThRMWpkc1gyYkI4dVlXQ1lDOEVPdU4ifQ"
                className="absolute z-20 bg-zinc-50 border border-zinc-50 rounded-full  text-black left-[84px]"
                width="38"
                height="38"
                alt=""
              />
              <Image
                src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ya0lkdGVDZlRrNWRXdTdzYU0wWnBJaVJwdmwifQ"
                className="absolute z-0 bg-zinc-50 border border-zinc-50 rounded-full text-black left-[112px]"
                width="38"
                height="38"
                alt=""
              />
            </div>
            <div className='flex justify-center items-center space-x-2'>
              <img src={authorImage} alt="p" className='h-9 w-9 rounded-full bg-black' />
              <p>{authorUsername}</p>
              <div className='px-1 rounded-md text-white w-24 h-6 flex justify-center items-center' style={{ backgroundColor: '#242424' }}><p>follow</p></div>
            </div>
          </div>
        </div>
        <div className='lg:w-1/2 flex justify-center items-center pt-7 pb-7'>
          <img src={bookCover} alt={`${title} bookCover`} className='w-56 h-80' />
        </div>
      </section>
      <section>
        <Suspense fallback={<p>loading...</p>}>
          <PostPageMain postId={params.postId} />
        </Suspense>
      </section>
      <section>
        <Suspense fallback={<p>...</p>}>
          <WantToRead userId={''} bookId={''} saved={false} />
        </Suspense>
        <Suspense fallback={<p>...</p>}>
          <NavigationPosts currentPost={params.postId} />
        </Suspense>
      </section>
    </main>
  );
}
