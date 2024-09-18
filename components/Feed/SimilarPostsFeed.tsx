"use client";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchSimilarPosts } from "@/lib/actions/posts.actions";
import Image from "next/image";
import Link from "next/link";

interface SimilarPostParams {
  postId: string;
}

const SimilarPostsFeed = ({ postId }: SimilarPostParams) => {
  const [similarPosts, setSimilarPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const getSimilarPosts = async () => {
      setIsLoading(true);
      try {
        const posts = await fetchSimilarPosts(postId);
        setSimilarPosts(posts);
      } catch (error) {
        console.error("Error fetching similar posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSimilarPosts();
  }, [postId]);

  if (isLoading) {
    return <p>Loading similar posts...</p>;
  }

  if (!similarPosts.length) {
    return <p>No similar posts found</p>;
  }



  return (
    <Carousel opts={{ align: "start" }} className="lg:w-5/6 w-[300px]">
      <CarouselContent>
        {similarPosts.map((post, index) => (
          <CarouselItem key={post._id.toString()} className="md:basis-1/2 lg:basis-1/3">
            <div className="flex flex-col cursor-pointer mb-10 w-[320px] sm:w-[250px] md:w-[400px] shadow-xl">
              <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center relative">
                <div className="flex flex-row items-center space-x-2 p-3 h-1/6 w-full">
                  <Image
                    src={post.author.image}
                    alt={post.author.username}
                    width={28}
                    height={28}
                    className="object-cover rounded-full w-8 h-8"
                  />
                  <Link href={`/profile/${post.author.id}`}>
                    <p>{post.author.username}</p>
                  </Link>
                </div>

               
                {index % 4 === 0 && post.quotes && post.quotes.length > 0 ? (
                  <Link href={`/post/${postId}`} className="h-5/6 w-full">
                    <div className="w-full flex justify-center items-center h-full">
                      <p className="text-md font-fontMain p-5 text-slate-900 font-fontMain">
                        "{post.quotes[0].quote.slice(0, 180)}..."
                      </p>
                    </div>
                  </Link>
                ) : index % 2 === 0 ? (
                  <div className="flex justify-center items-center pt-2 pb-2 h-full">
                    <img
                      src={post.postImages && post.postImages.length > 0 ? post.postImages[0] : post.image}
                      alt="Post"
                      className="w-auto max-w-[380px] max-h-60 shadow-xl"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center bg-gradient-to-b from-white to-slate-200 h-full w-full">
                    <img
                      src={post.image}
                      alt="Book Cover"
                      className="w-auto max-h-60 h-64 max-w-[380px]"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col p-3">
                <div>
                  <p className="font-md font-medium hover:text-hoverTag">{post.book.title}</p>
                  <p className="text-sm">{post.book.author}</p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default SimilarPostsFeed;
