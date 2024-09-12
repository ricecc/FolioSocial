
import { fetchPostById } from '@/lib/actions/posts.actions'
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import React from 'react'


async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  const post = await fetchPostById(params.id)

 
  return (
    <>
    </>
  )
}

export default page
