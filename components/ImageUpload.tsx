"use client";
import React, { useState, useRef } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import 'react-image-crop/dist/ReactCrop.css'
import { useDebounceEffect } from './useDebounceEffect';
import TextRecognition from './TextRecognition';

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function App() {
  const [imgSrc, setImgSrc] = useState('')
  const [savedImgSrc, setSavedImgSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspect, setAspect] = useState<number | undefined>(undefined)

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  async function onSaveCropClick() {
    const image = imgRef.current
    if (!image || !completedCrop) {
      throw new Error('Crop data is missing')
    }

    // Calculate scaling
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Create a new canvas to draw the cropped image
    const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY)
    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    )

    // Convert canvas to Blob
    const blob = await offscreen.convertToBlob({ type: 'image/png' })
    if (blob) {
      const blobUrl = URL.createObjectURL(blob)
      setSavedImgSrc(blobUrl)
    }
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current) {
        // No preview canvas needed here
      }
    },
    100,
    [completedCrop],
  )

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined)
    } else {
      setAspect(16 / 9)
      if (imgRef.current) {
        const { width, height } = imgRef.current
        const newCrop = centerAspectCrop(width, height, 16 / 9)
        setCrop(newCrop)
        setCompletedCrop(convertToPixelCrop(newCrop, width, height))
      }
    }
  }

  return (
    <div className="w-full flex justify-center flex-col items-center mt-4">
      <div className="w-56 h-20  flex justify-center items-center  border-dashed border rounded-lg border-spacing-3 border-slate-950">

        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onSelectFile} />
        <label  className="block px-4 py-2  text-slate-950 rounded cursor-pointer ">
          Seleziona un'immagine
        </label>
      </div>
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          minHeight={10}
        >
          <div className='relative  bg-red-200'>
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              className=''
              onLoad={onImageLoad}
            />
            {!!completedCrop && (
              <div className='absolute bottom-5 right-3 bg-white text-slate-950 rounded-lg px-3 py-2 border border-slate-950'>
                <button onClick={onSaveCropClick}>Salva frase</button>
              </div>
            )}
          </div>

        </ReactCrop>
      )}

      {savedImgSrc && (
        <div>
          <h3>Testo Riconosciuto</h3>
          <TextRecognition selectedImage={savedImgSrc} />
        </div>
      )}
    </div>
  )
}
