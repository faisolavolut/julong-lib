import { useState, useEffect } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt?: string;
  defaultSrc?: string;
  className?: string;
}

const ImageBetter = ({
  src,
  alt,
  defaultSrc = "/default-image.png",
  className,
}: ImageWithFallbackProps) => {
  const [imageSrc, setImageSrc] = useState(src);

  // Menangani perubahan `src` agar selalu diperbarui ke `imageSrc`
  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageSrc(defaultSrc)}
    />
  );
};

export default ImageBetter;
