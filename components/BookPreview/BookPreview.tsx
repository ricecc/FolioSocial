"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string,
    largeImage: string
}

const BookPreview = ({ id, largeImage }: Props) => {
    return (
        <Link href={`/book/${id}`}>
            <div className=" cursor-pointer ">
                <img src={largeImage} alt="" className="object-cover" />
            </div>
        </Link>
    )
}
export default BookPreview