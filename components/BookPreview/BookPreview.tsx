"use client";

import Link from "next/link";

interface Props{
    id:string,
    largeImage:string
}

const BookPreview = ({ id, largeImage }: Props) => {
return(
    <Link href={`/book/${id}`}>
    <div className="w-56 cursor-pointer ">
        <img src={largeImage} alt="" className=""/>
    </div>
    </Link>
)
}
export default BookPreview