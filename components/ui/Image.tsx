import { useState } from "react";

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
