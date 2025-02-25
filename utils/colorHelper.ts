const getContrastColor = (hexColor: string | null): "black" | "white" => {
  if (!hexColor) return "black"; // Default jika null

  // Pastikan hexColor valid dan hilangkan '#' jika ada
  const cleanedHex = hexColor.replace("#", "");

  // Konversi hex ke RGB
  const r = parseInt(cleanedHex.substring(0, 2), 16);
  const g = parseInt(cleanedHex.substring(2, 4), 16);
  const b = parseInt(cleanedHex.substring(4, 6), 16);

  // Gunakan rumus luminance untuk menentukan kecerahan
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Jika terang (luminance > 0.5) gunakan teks hitam, jika gelap gunakan teks putih
  return luminance > 0.5 ? "black" : "white";
};

const getContrastColorFromImage = (
  imageSrc: string | null,
  callback: (color: "black" | "white") => void,
  defaultImageSrc: string
): void => {
  if (!imageSrc) {
    callback("black"); // Default jika null
    return;
  }

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageSrc;

  img.onerror = () => {
    console.warn(`Image not found: ${imageSrc}, using default image`);
    getContrastColorFromImage(defaultImageSrc, callback, defaultImageSrc);
  };

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
    let r = 0,
      g = 0,
      b = 0;
    let totalPixels = imageData.length / 4;

    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
    }

    r = Math.floor(r / totalPixels);
    g = Math.floor(g / totalPixels);
    b = Math.floor(b / totalPixels);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    callback(luminance > 0.5 ? "black" : "white");
  };
};

const getRandomHexColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

export { getContrastColor, getContrastColorFromImage, getRandomHexColor };
