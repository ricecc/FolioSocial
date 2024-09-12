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
    		padding: '2rem',
    		screens: {
    			sm: '320px',
    			md: '375px',
    			lg: '414px',
    			xl: '480px',
    			'2xl': '600px',
    			'3xl': '768px',
    			'4xl': '1024px',
    			'5xl': '1280px',
    			'6xl': '1366px',
    			'7xl': '1440px',
    		}
    	},
    	extend: {
    		padding: {
    			'0.6em': '0.6em',
    			'0.8em': '0.8em'
    		},
    		fontFamily: {
    			fontMain: ['Work Sans', 'sans-serif']
    		},
    		colors: {
    			backgroundPrimary: '#F9F2E5',
    			backgroundCard: '#ccd0bf',
    			backgroundTags: '#D9D9D9',
    			backgroundWantToRead: '#F9F2E5',
    			backgroundBuy: '#CCD3B5',
    			backgroundBook: '#F9F2E5',
    			backgroundBar: '#EFEAE3',
    			hoverTag: '#0000ff',
    			publishButton: '#0005FA',
    			backgroundButton: '#2b3440'
    		},
    	}
    },
    plugins: [require("tailwindcss-animate")],
  } satisfies Config

  export default config