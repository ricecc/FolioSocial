"use client";

import React, { useState } from "react";
import { removeFollow, startFollow } from "@/lib/actions/user.actions";
import { usePathname } from "next/navigation";

interface FollowProps {
    fromUserId: string;
    toUserId: string;
    alreadyFollow: boolean;
}

const FollowButton = ({ fromUserId, toUserId, alreadyFollow }: FollowProps) => {
    const [isFollowing, setIsFollowing] = useState(alreadyFollow);
    const path = usePathname();

    const handleFollowToggle = async () => {
        if (isFollowing) {
            await removeFollow({ fromUserId, toUserId, path });
            setIsFollowing(false);
        } else {
            await startFollow({ fromUserId, toUserId, path });
            setIsFollowing(true);
        }
    };

    return (
        <button
            className={`px-2  rounded-lg font-bold  ${isFollowing
                    ? "bg-white text-black border border-black font-light"
                    : "bg-black text-white font-light"
                }`}
            onClick={handleFollowToggle}
        >
            {isFollowing ? "Seguito" : "Segui"}
        </button>
    );
};

export default FollowButton;
