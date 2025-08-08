import { PixelImage } from "@/components/shared/pixel-image";

export default function Home() {
  return (
    <div>
      <PixelImage src="/images/dog.jpeg" grid="4x6" grayscaleAnimation />
    </div>
  );
}
