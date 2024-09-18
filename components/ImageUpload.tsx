"use client";
import React, { useState, useRef } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'

import 'react-image-crop/dist/ReactCrop.css'
import { useDebounceEffect } from './useDebounceEffect';

// This is to demonstrate how to make and center a % aspect crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
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
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [aspect, setAspect] = useState<number | undefined>(undefined)

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
      if (e.target.files && e.target.files.length > 0) {
        setCrop(undefined) // Makes crop preview update between images.
        const reader = new FileReader()
        reader.addEventListener('load', () =>
          setImgSrc(reader.result?.toString() || ''),
        )
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
      const previewCanvas = previewCanvasRef.current
      if (!image || !previewCanvas || !completedCrop) {
        throw new Error('Crop canvas does not exist')
      }

      // This will size relative to the uploaded image
      // size. If you want to size according to what they
      // are looking at on screen, remove scaleX + scaleY
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      const offscreen = new OffscreenCanvas(
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
      )
      const ctx = offscreen.getContext('2d')
      if (!ctx) {
        throw new Error('No 2d context')
      }

      ctx.drawImage(
        previewCanvas,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height,
        0,
        0,
        offscreen.width,
        offscreen.height,
      )
      // You might want { type: "image/jpeg", quality: <0 to 1> } to
      // reduce image size
      const blob = await offscreen.convertToBlob({
        type: 'image/png',
      })

      if (blob) {
        const blobUrl = URL.createObjectURL(blob)
        setSavedImgSrc(blobUrl)
      }
    }

    useDebounceEffect(
      async () => {
        if (
          completedCrop?.width &&
          completedCrop?.height &&
          imgRef.current &&
          previewCanvasRef.current
        ) {
          // We use canvasPreview as it's much faster than imgPreview.
          canvasPreview(
            imgRef.current,
            previewCanvasRef.current,
            completedCrop,
          )
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
          // Updates the preview
          setCompletedCrop(convertToPixelCrop(newCrop, width, height))
        }
      }
    }
    console.log(aspect)
    return (
      <div className="App">
        <div className="Crop-Controls">
          <input type="file" accept="image/*" onChange={onSelectFile} />
          
          <div>

          </div>
        </div>
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minHeight={100}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
        {!!completedCrop && (
          <>
            <div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: '1px solid black',
                  objectFit: 'contain',
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
            <div>
              <button onClick={onSaveCropClick}>Save Crop</button>
              <div style={{ fontSize: 12, color: '#666' }}>
                If you get a security error when saving try opening the
                Preview in a new tab (icon near top right).
              </div>
            </div>
            {savedImgSrc && (
              <div>
                <h3>Saved Image:</h3>
                <img src={savedImgSrc} alt="Saved crop" />
              </div>
            )}
          </>
        )}
      </div>
    )
}
