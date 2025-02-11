import { useEffect, useState } from "react";

function isDarkColor(rgb) {
  const [r, g, b] = rgb;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128; // Dark if brightness is low
}

export const useIsDarkColor = ({ image, color }: { image?: string, color?: string }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!image) return;
    // console.log(bgImgRef.current?.style.backgroundImage);
    const img = new Image();
    img.src = image;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const pixelData = ctx.getImageData(0, 0, 1, 1).data; // Get top-left pixel
      setIsDark(isDarkColor(pixelData));
    };
  }, [image]);

  useEffect(() => {
    if (!color || image) return;
    const [r, g, b] = color.match(/\d+/g).map(Number);

    // Luminance formula: (simple method to detect brightness)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    setIsDark(luminance < 128);
  }, [color, image]);

  return isDark;
}