import React from 'react'

interface Props{
    quote:string
}
const QuotePreview = ({quote}:Props) => {
  return (
    <div className='w-full flex justify-center items-center h-full'>
      <p className='text-md font-fontMain p-5  text-slate-900 font-fontMain'>"{quote.slice(0, 180)}..."</p>
    </div>
  )
}

export default QuotePreview
