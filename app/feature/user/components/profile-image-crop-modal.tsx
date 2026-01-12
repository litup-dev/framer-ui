"use client";

import { useState, useRef } from "react";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

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
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height, 1);
    setCrop(initialCrop);
  };

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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        overlayClassName="z-[99999998]"
        className="bg-white max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0 z-[99999999] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]"
      >
        <DialogTitle className="flex justify-start w-full items-center gap-2 p-4 sm:p-6 pb-0 flex-shrink-0">
          <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base md:text-lg">
            프로필 사진 편집
          </span>
        </DialogTitle>
        <DialogDescription className="sr-only">
          프로필 사진을 업로드하고 원형으로 크롭할 수 있습니다.
        </DialogDescription>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
          {!imgSrc ? (
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 py-8 sm:py-12">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-black text-white rounded-[4px] hover:bg-black/80 text-sm sm:text-base"
              >
                이미지 선택
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                JPG, PNG 파일을 선택해주세요
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-center items-center bg-gray-50 rounded-lg p-2 sm:p-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-w-full h-auto max-h-[50vh] sm:max-h-[60vh]"
                  />
                </ReactCrop>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="rounded-[4px] text-sm sm:text-base"
              >
                다른 이미지 선택
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center justify-end p-4 sm:p-6 bg-white border-t flex-shrink-0">
          <Button
            onClick={handleSave}
            disabled={!imgSrc || !completedCrop}
            className="bg-black text-white rounded-[4px] hover:bg-black/80 text-sm sm:text-base"
          >
            선택
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            className="rounded-[4px] text-sm sm:text-base"
          >
            취소
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
