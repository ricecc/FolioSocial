"use client";
import React, { useState, useRef } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import 'react-image-crop/dist/ReactCrop.css'
import { useDebounceEffect } from './useDebounceEffect';
import TextRecognition from './TextRecognition';
import { IoIosQrScanner } from "react-icons/io";


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

interface AppProps {
  onTextRecognized: (text: string) => void;  // Aggiunta della proprietà onTextRecognized
}

export default function App({ onTextRecognized }: AppProps) {
  const [imgSrc, setImgSrc] = useState('')
  const [savedImgSrc, setSavedImgSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspect, setAspect] = useState<number | undefined>(undefined)
  const [recognizedText, setRecognizedText] = useState('')  // Stato per il testo riconosciuto

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

  // Funzione per salvare il testo riconosciuto
  function saveTextRecognized() {
    onTextRecognized(recognizedText);  
  } 
  
  const [language, setLanguage] = useState('ita');


  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'ita' ? 'eng' : 'ita'));
  };

  return (
    <div className="flex justify-center items-center flex-col">

      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        id="file-input"
        style={{ display: 'none' }}
      />

      <Dialog>
        <DialogTrigger asChild>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              id="file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <IoIosQrScanner size={30} className="text-gray-400" />
            </label>
          </div>

        </DialogTrigger>
        <DialogContent className="max-w-[425px] max-w-[800px]">
          <DialogHeader>
            <div className='flex flex-row justify-between items-center '>
              <DialogTitle>Seleziona testo</DialogTitle>
              <div className="flex items-center space-x-2 mr-4">
                {/* Switch per cambiare lingua */}
                <Switch id="language-switch" checked={language === 'eng'} onCheckedChange={toggleLanguage} />
                {/* Label che cambia testo in base alla lingua */}
                <Label htmlFor="language-switch">
                  {language === 'ita' ? 'Ita' : 'Eng'}
                </Label>
              </div>
            </div>

            <DialogDescription>
              Assicurati di selezionare interamente la parte desiderata senza includere altre frasi

            </DialogDescription>
          </DialogHeader>
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minHeight={10}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
          <div className='flex flex-col h-full justify-center items-center '>
            {!!completedCrop && (
              !recognizedText ? (
                <div>
                  <Button onClick={onSaveCropClick}>Save Taglio</Button>
                </div>
              ) : (<></>)
            )}
            {savedImgSrc && (
              <div className=' w-full space-y-3'>
                <h3>Testo Riconosciuto</h3>
                {/* Passa il testo riconosciuto a uno stato */}
                <TextRecognition selectedImage={savedImgSrc} onTextRecognized={setRecognizedText} language={language} />
                <Textarea
                  placeholder="Type your message here."
                  value={recognizedText} // Popola l'area di testo con il testo riconosciuto
                  onChange={(e) => setRecognizedText(e.target.value)}
                />
                <div className='flex justify-end items-center'>
                  <Button onClick={saveTextRecognized}>Salva frase</Button>
                </div>

              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
