import { Quantico } from 'next/font/google';

export const quantico = Quantico({
  weight: "700",
  subsets: ["latin"]
});

export const quanticoItalic = Quantico({
  weight: "700",
  subsets: ["latin"],
  style: "italic"
});