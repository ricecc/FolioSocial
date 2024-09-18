"use client"



import ImageUpload from '@/components/ImageUpload';
import { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

export default function CameraPage() {
   
    return (
        <div>
           <ImageUpload/>
          
        </div>
    )

}
