"use client"
import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface DialogProps {
  imageSrc: string;
}

const ImageDialog: React.FC<DialogProps> = ({ imageSrc }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <img
        src={imageSrc}
        alt="Post Image"
        className="w-full h-full object-cover max-h-[400px]"
        onClick={handleImageClick}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader>
            <DialogClose className="absolute top-4 right-4 text-white" />
          </DialogHeader>
          <div className="p-4">
            <img
              src={imageSrc}
              alt="Full Preview"
              className="rounded-md w-full max-h-[550px] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageDialog;
