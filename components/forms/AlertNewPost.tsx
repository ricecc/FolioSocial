import Link from 'next/link'
import React from 'react'
interface Props {
    idPost: string,
    setidPostAlreadyExists: (review: string) => void;
}
const AlertNewPost = ({ idPost, setidPostAlreadyExists }: Props) => {

    return (
        <div className='absolute top-2 left-10 animate-slide-in-left'>
            <div className=" relative  bg-backgroundButton text-white rounded-lg p-7 shadow-2xl w-96">
                <div className="flex flex-col space-y-2">
                    <p>Hai già un post con questo libro. Vuoi modificarlo?</p>
                    <div className="flex flex-row items-center space-x-3">
                        <Link href={`/your-posts/${idPost}`}><p className="bg-zinc-100 hover:shadow-md px-3 font-fontMain text-start flex items-center justify-start py-1 px-3 rounded-md hover:text-hoverTag cursor-pointer text-backgroundButton " >Si</p></Link>
                        <button className="bg-zinc-100 hover:shadow-md px-3 font-fontMain text-start flex items-center justify-start py-1 px-3 rounded-md hover:text-hoverTag cursor-pointer text-backgroundButton " onClick={() => setidPostAlreadyExists("")}>No</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AlertNewPost
