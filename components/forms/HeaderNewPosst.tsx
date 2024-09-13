import React from "react";

interface HeaderProps {
    onPublish: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPublish }) => {
    return (
        <div className="w-full flex justify-end items-center h-24 md:p-11 font-fontMain border">
            <button
                className="rounded-lg pt-0.6em pl-0.8em pb-0.6em pr-0.8em text-slate-900 hover:text-publishButton flex items-center"
                onClick={onPublish}
               
            >

                Pubblica
            </button>

        </div>
    );
};

export default Header;
