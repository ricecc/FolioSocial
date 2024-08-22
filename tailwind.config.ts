  import type { Config } from "tailwindcss"

  const config = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          'sm': '320px',  // bg-blue-500 : Fino a 319px (meno di sm), lo sfondo sarà blu.
          'md': '375px',  //sm:bg-red-500 : Da 320px (sm) a 374px (meno di md), lo sfondo sarà rosso.
          'lg': '414px',  //md:bg-green-500:  Da 375px (md) a 413px (meno di lg), lo sfondo sarà verde.
          'xl': '480px',  // Dispositivi mobili medi
          '2xl': '600px', // Tablet piccolo
          '3xl': '768px', // Tablet medio
          '4xl': '1024px', // Tablet grande
          '5xl': '1280px', // Desktop piccolo
          '6xl': '1366px', // Desktop medio
          '7xl': '1440px', // Desktop medio-grande
          '8xl': '1600px', // Desktop grande
          '9xl': '1920px', // Full HD
        },
      },
      extend: {
        padding:{
            '0.6em': '0.6em',
            '0.8em':'0.8em'
        },
        fontFamily:{
          fontMain: ['Work Sans', 'sans-serif'],

        },  
        colors: {
          // Aggiungi il colore di background primary personalizzato
          backgroundPrimary: '#F9F2E5',
          backgroundCard: '#ccd0bf',
          backgroundTags:'#D9D9D9',
          backgroundWantToRead: '#F9F2E5',
          backgroundBuy: '#CCD3B5',
          backgroundBook : '#F9F2E5',
          backgroundBar: '#EFEAE3',
          hoverTag:'#0000ff',
          publishButton: '#0005FA',
          backgroundButton: '#2b3440'




        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
    plugins: [require("tailwindcss-animate"),require('daisyui'),],
  } satisfies Config

  export default config