import React, { useState, useCallback } from 'react';
import { SingleImageDropzone } from "@/components/DropZone/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from 'next/image';

interface Props {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  index: number;
  onRemove: (index: number) => void;
}

const DropZone = ({ index, onRemove, imageUrl, setImageUrl }: Props) => {

  const [file, setFile] = useState<File>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0)
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>()
  const { edgestore } = useEdgeStore()

  const handleImageClick = () => {
    if (progress === 100) {
      setIsDialogOpen(true);
    }
  };
  return (
    <div className=''>
      {progress === 100 ? (
        <div className=" flex justify-center w-full relative">
          <img
            src={urls?.url}
            alt="Preview"
            className={` w-full h-full object-cover max-h-[400px]`}
            onClick={handleImageClick}
          />
          <div className='absolute bottom-4 rounded right-4 px-3 bg-slate-900 cursor-pointer' onClick={() => onRemove(index)}>
            <p className='text-sm text-zinc-50 ' >delete</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg p-0">
              <DialogHeader>
                <DialogClose className="absolute top-4 right-4 text-white" />
              </DialogHeader>
              <div className="p-4">
                <img
                  src={urls?.url}
                  alt="Full Preview"
                  className="rounded-md w-full max-h-[550px] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Card className="flex flex-col h-full pt-4 relative">
          <CardContent className={`flex-grow flex justify-center items-center`}>
            <div className="flex flex-col items-center m-6 gap-2">
              <SingleImageDropzone
                width={200}
                height={200}
                value={file}
                dropzoneOptions={{
                  maxSize: 1024 * 1204 * 5
                }}
                onChange={(file) => {
                  setFile(file);
                }}

              />
              {!urls?.url && file ? (
                <>
                  <div className="h-[6px] w-44 border rounded overflow-hidden ">
                    <div
                      className="h-full bg-black transition-all duration-150"
                      style={{
                        width: `${progress}%`
                      }}
                    />

                  </div>
                  <button className="bg-white text-black rounded px-2 hover:opacity-80"
                    onClick={async () => {
                      if (file) {
                        const res = await edgestore.myPublicImages.upload({
                          file,
                          onProgressChange: (progress) => {
                            setProgress(progress);
                          }
                        })

                        //volendo salva su db da qui, oppure
                        setUrls({
                          url: res.url,
                          thumbnailUrl: res.thumbnailUrl
                        })
                        setImageUrl(res.url)
                      }
                    }}
                  >
                    Salva
                  </button>

                </>
              ) : (<></>)}
              <div className='absolute bottom-4 rounded right-4 px-3 bg-slate-900 cursor-pointer' onClick={() => onRemove(index)}>
                <p className='text-sm text-zinc-50 ' >delete</p>
              </div>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DropZone;
