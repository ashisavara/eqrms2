import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': {  DEFAULT: '#DCEAF3',  50: '#e6f3fc',  100: '#B8DCF9',  200: '#92C9F6',  300: '#6DB7F3',  400: '#47A4F0',  500: '#2191ED',  600: '#117CD4',  700: '#0E66AE',  800: '#0B5089',  900: '#083A63',  950: '#062B49'},
        'red': {  DEFAULT: '#9E2B2B',  50: '#FAEDED',  100: '#FAEDED',  200: '#FAEDED',  300: '#F1CDCD',  400: '#E9ACAC',  500: '#E08C8C',  600: '#D76C6C',  700: '#CE4C4C',  800: '#BE3434',  900: '#9E2B2B',  950: '#882525'},
        'green': {  DEFAULT: '#4C6025',  50: '#F2F7E9',  100: '#E9F1DA',  200: '#D8E6BD',  300: '#C6DAA0',  400: '#B5CF82',  500: '#A3C465',  600: '#92B847',  700: '#7B9B3C',  800: '#6d8a34',  900: '#68843A',  950: '#3C4C1D'},
        'yellow': {  DEFAULT: '#FF914D',  50: '#FFFFFF',  100: '#FFF3E6',  200: '#FFF3E6',  300: '#FFE6CC',  400: '#FFD9B3',  500: '#FFCC99',  600: '#FFBF80',  700: '#FFB266',  800: '#FFA54D',  900: '#FF914D',  950: '#FF8433'},
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;