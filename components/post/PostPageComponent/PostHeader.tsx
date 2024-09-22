import React from 'react';
import Link from 'next/link';

interface PostHeaderParams {
    title: string;
    author: string;
    authorId: string;
    authorUsername: string;
    postImage:string
}

const PostHeader: React.FC<PostHeaderParams> = ({ title, author, authorId, authorUsername, postImage}) => {
    return (
        <>
            <div className="bg-zinc-50 min-h-48 pt-6 p-5 border flex flex-col justify-between lg:w-1/2">
                <div className="pt-5 space-y-2">
                    <p className="font-montserrat font-medium lg:text-5xl text-3xl">{title}</p>
                    <p className="font-montserrat font-light text-2xl">{author}</p>
                </div>
                <div className="flex flex-col items-end">
                    <Link href={`/profile/${authorId}`} className="hover:text-hoverTag">
                        {authorUsername}
                    </Link>
                </div>
            </div>
            <div className="bg-gradient-to-b from-white to-zinc-200 min-h-48 flex justify-center items-center p-5 lg:p-0 lg:w-1/2">
                <img src={postImage} alt="" className="w-auto h-64 object-contain" />
            </div>
        </>
    );
};

// Avvolgi il componente in React.memo per evitare render inutili
export default React.memo(PostHeader);
