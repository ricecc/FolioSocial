import { fetchPostById } from '@/lib/actions/posts.actions'
import React from 'react'

async function page({ params }: { params: { id: string } })  {
    let result = await fetchPostById(params.id)
  return (
    <div className='container'>
        <p>{params.id}</p>
    </div>
  )
}

export default page
