import React from 'react'
interface Props{
    imagePost:string,
    bookCover:string
}
const ImagePostPreview = ({imagePost,bookCover}:Props) => {
    return (
        <div className='flex justify-center items-center pt-2 pb-2 h-full '>
            <img src={imagePost || bookCover} alt={""} className='w-auto max-w-[420px] max-h-60 shadow-xl ' />
        </div>
    )
}

export default ImagePostPreview
