"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, ZoomIn, ZoomOut } from "lucide-react";
import { Subtitle } from "@/components/shared/typography";

interface ProfileImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImageBlob: Blob) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ProfileImageCropModal({
  isOpen,
  onClose,
  onSave,
}: ProfileImageCropModalProps) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setScale(1); // Reset scale when new image is loaded
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height, 1);
    setCrop(initialCrop);
  };

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setScale(Number(e.target.value));
    },
    []
  );

  const getCroppedImg = async (): Promise<Blob | null> => {
    if (!completedCrop || !imgRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    const croppedImageBlob = await getCroppedImg();
    if (croppedImageBlob) {
      onSave(croppedImageBlob);
      handleClose();
    }
  };

  const handleClose = () => {
    setImgSrc("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="w-[355px] md:w-[664px] h-[470px] md:h-[716px] p-0 rounded-[8px] overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="pt-[20px] md:pt-[40px] px-6 md:px-11 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
              <Subtitle className="text-[18px] md:text-[20px]">
                프로필 이미지 편집
              </Subtitle>
            </DialogTitle>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center transition-colors text-black-60 hover:text-black"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </DialogHeader>
        <DialogDescription className="sr-only">
          프로필 사진을 업로드하고 원형으로 크롭할 수 있습니다.
        </DialogDescription>

        <div className="flex-1 px-6 md:px-11 overflow-hidden flex flex-col">
          {!imgSrc ? (
            <div className="flex flex-col items-center justify-center h-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-black text-white rounded-[4px] hover:bg-black/80 h-10 px-6"
              >
                이미지 선택
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative flex justify-center items-center mb-6 md:mb-8 max-w-full max-h-[240px] md:max-h-[400px] overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                  locked
                  className="profile-image-crop"
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    style={{
                      transform: `scale(${scale})`,
                      maxWidth: "305px",
                      maxHeight: "240px",
                      cursor: "move",
                    }}
                    className="md:!max-w-[568px] md:!max-h-[400px] object-contain"
                    draggable={false}
                  />
                </ReactCrop>
              </div>

              {/* Zoom Controls */}
              <div className="w-full">
                <div className="flex items-center gap-2 md:gap-3 justify-center">
                  <button
                    onClick={handleZoomOut}
                    className="transition-colors hover:opacity-70 flex-shrink-0"
                  >
                    <ZoomOut className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <div className="relative flex items-center w-[210px] md:w-[344px]">
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={handleSliderChange}
                      className="zoom-slider w-full appearance-none bg-transparent cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #FF491A 0%, #FF491A ${((scale - 0.5) / 2.5) * 100}%, rgba(0, 0, 0, 0.6) ${((scale - 0.5) / 2.5) * 100}%, rgba(0, 0, 0, 0.6) 100%)`,
                        height: '3px',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>

                  <button
                    onClick={handleZoomIn}
                    className="transition-colors hover:opacity-70 flex-shrink-0"
                  >
                    <ZoomIn className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {imgSrc && (
          <div className="px-6 md:px-11 pb-6 md:pb-12 flex justify-end flex-shrink-0">
            <Button
              onClick={handleSave}
              disabled={!completedCrop}
              className="bg-black text-white rounded-[4px] hover:bg-black/80 h-10 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              등록
            </Button>
          </div>
        )}

        <style jsx global>{`
          .profile-image-crop .ReactCrop__crop-selection {
            border: 3px solid #FF491A !important;
          }

          @media (min-width: 768px) {
            .profile-image-crop .ReactCrop__crop-selection {
              border: 4px solid #FF491A !important;
            }

            .zoom-slider {
              height: 4px !important;
            }
          }

          .zoom-slider::-webkit-slider-runnable-track {
            background: transparent !important;
          }

          .zoom-slider::-moz-range-track {
            background: transparent !important;
          }

          .zoom-slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #FF491A;
            cursor: pointer;
            margin-top: -6.5px;
          }

          @media (min-width: 768px) {
            .zoom-slider::-webkit-slider-thumb {
              width: 20px;
              height: 20px;
              margin-top: -8px;
            }
          }

          .zoom-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #FF491A;
            border: 0;
            cursor: pointer;
          }

          @media (min-width: 768px) {
            .zoom-slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
