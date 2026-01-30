"use client";

import { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crop, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { Subtitle, Description } from "@/components/shared/typography";

interface ProfileImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImageBlob: Blob) => void;
  existingImageUrl?: string | null;
}

export default function ProfileImageCropModal({
  isOpen,
  onClose,
  onSave,
  existingImageUrl,
}: ProfileImageCropModalProps) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isWideImage, setIsWideImage] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const editorRef = useRef<AvatarEditor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    return validTypes.includes(file.type);
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) {
      alert("jpg, png 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const img = new Image();
      img.onload = () => {
        // === 1. 설정값 정의 ===
        const EDITOR_MAX_WIDTH = 568;
        const EDITOR_MAX_HEIGHT = 400;
        const CROP_SIZE = 300;

        // === 2. 이미지를 '박스 안'에 다 보이게 넣었을 때의 크기 계산 ===
        // (object-fit: contain 과 같은 원리)
        const scaleToFit = Math.min(
          EDITOR_MAX_WIDTH / img.width,
          EDITOR_MAX_HEIGHT / img.height,
        );

        // 박스에 맞춘(화면에 보일) 가상의 이미지 크기
        const boxFitWidth = Math.floor(img.width * scaleToFit);
        const boxFitHeight = Math.floor(img.height * scaleToFit);

        // === 3. 예외 케이스 처리 (Zoom 필요 여부 판단) ===
        let canvasWidth = boxFitWidth;
        let canvasHeight = boxFitHeight;

        // Case A: 세로로 너무 길어서, 너비가 300px(구멍)보다 작아진 경우
        if (boxFitWidth < CROP_SIZE) {
          canvasWidth = CROP_SIZE; // 캔버스 너비는 최소 300 확보
          canvasHeight = Math.min(boxFitHeight, EDITOR_MAX_HEIGHT); // 높이는 최대치(400) 유지
        }

        // Case B: 가로로 너무 길어서, 높이가 300px(구멍)보다 작아진 경우
        else if (boxFitHeight < CROP_SIZE) {
          canvasHeight = CROP_SIZE; // 캔버스 높이는 최소 300 확보
          canvasWidth = Math.min(boxFitWidth, EDITOR_MAX_WIDTH); // 너비는 최대치(568) 유지
        }

        // === 4. 상태 업데이트 ===
        setImageSize({ width: canvasWidth, height: canvasHeight });
        setImgSrc(reader.result?.toString() || "");
        setIsWideImage(img.width > img.height);
      };
      img.src = reader.result?.toString() || "";
    });
    reader.readAsDataURL(file);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dragAreaRef.current &&
      !dragAreaRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSave = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onSave(blob);
            handleClose();
          }
        },
        "image/jpeg",
        0.95,
      );
    }
  };

  const handleClose = () => {
    setImgSrc("");
    setScale(1);
    setIsWideImage(false);
    setImageSize({ width: 300, height: 300 });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="!w-[355px] md:!w-[664px] h-[470px] md:h-[716px] p-0 rounded-[8px] overflow-hidden !max-w-none flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader className="pt-5 md:pt-6 px-6 md:px-11 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-[18px] md:text-[20px] font-bold">
              <Crop className="w-4 h-4 md:w-5 md:h-5" />
              프로필 이미지 편집
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={onSelectFile}
          className="hidden"
        />

        <div className="flex-1 px-6 md:px-11 overflow-hidden flex flex-col">
          {!imgSrc ? (
            /* File upload area */
            <div
              ref={dragAreaRef}
              className="w-full max-w-[305px] md:max-w-[568px] h-[240px] md:h-[400px] border border-black-20 mx-auto relative mt-10"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center pt-[80px] md:pt-[160px]">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-black border border-black-30 rounded-[3px] hover:bg-gray-100 w-[107px] h-[44px]"
                >
                  <Subtitle className="text-[16px]">파일 업로드</Subtitle>
                </Button>
                <Description className="text-[14px] mt-4">
                  여기로 이미지를 드래그하거나 파일을 업로드하세요
                </Description>
                <Description className="text-[14px] mt-1">
                  * jpg, png 파일
                </Description>
              </div>
              {isDragging && (
                <div className="absolute inset-0 bg-black-10 bg-opacity-50 flex items-center justify-center pointer-events-none">
                  <Description className="text-[16px] font-semibold">
                    파일을 여기에 놓으세요
                  </Description>
                </div>
              )}
            </div>
          ) : (
            /* Image cropping area */
            <>
              {/* 이미지 영역 - flex-1로 남은 공간 차지 */}
              <div className="flex-1 flex justify-center items-center min-h-0 relative">
                <div className="relative inline-block">
                  <AvatarEditor
                    ref={editorRef}
                    image={imgSrc}
                    width={300} // 고정
                    height={300} // 고정
                    border={[
                      (imageSize.width - 300) / 2,
                      (imageSize.height - 300) / 2,
                    ]}
                    borderRadius={150}
                    color={[0, 0, 0, 0.5]}
                    scale={scale}
                    rotate={0}
                  />

                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "300px",
                      height: "300px",
                      borderRadius: "50%",
                      border: "4px solid #FF491A",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* 파일 재업로드 버튼 - absolute positioning */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute w-[44px] h-[44px] p-2 border border-black-30 rounded bg-white hover:bg-gray-100 transition-colors flex items-center justify-center"
                  style={{
                    right: 0,
                    ...(isWideImage
                      ? {
                          // 가로가 긴 이미지: 이미지 하단 4px 아래
                          top: `calc(50% + ${imageSize.height / 2}px + 4px)`,
                        }
                      : {
                          // 세로가 긴 이미지: 이미지 하단과 정렬
                          top: `calc(50% + ${imageSize.height / 2}px - 44px)`,
                        }),
                  }}
                >
                  <Upload className="w-[28px] h-[28px]" />
                </button>
              </div>

              {/* 줌 슬라이더 */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 md:gap-3 justify-center">
                  <button
                    onClick={() => setScale((prev) => Math.max(prev - 0.1, 1))}
                    className="transition-colors hover:opacity-70 flex-shrink-0"
                  >
                    <ZoomOut className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <div className="relative flex items-center w-[210px] md:w-[344px]">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="zoom-slider w-full appearance-none bg-transparent cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #FF491A 0%, #FF491A ${
                          ((scale - 1) / 2) * 100
                        }%, rgba(0, 0, 0, 0.6) ${
                          ((scale - 1) / 2) * 100
                        }%, rgba(0, 0, 0, 0.6) 100%)`,
                        height: "3px",
                        borderRadius: "9999px",
                      }}
                    />
                  </div>

                  <button
                    onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))}
                    className="transition-colors hover:opacity-70 flex-shrink-0"
                  >
                    <ZoomIn className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              {/* 완료 버튼 - 줌 슬라이더와 40px 간격 */}
              <div className="flex-shrink-0 pt-10 pb-12 flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={!imgSrc}
                  className={`rounded-[4px] h-10 px-6 ${
                    imgSrc
                      ? "bg-black text-white hover:bg-black/80"
                      : "bg-[#BBBBBB] text-white cursor-not-allowed"
                  }`}
                >
                  완료
                </Button>
              </div>
            </>
          )}
        </div>

        {/* 파일 업로드 상태일 때의 완료 버튼 */}
        {!imgSrc && (
          <div className="px-6 md:px-11 pb-6 md:pb-12 flex justify-end flex-shrink-0">
            <Button
              onClick={handleSave}
              disabled={!imgSrc}
              className="rounded-[4px] h-10 px-6 bg-[#BBBBBB] text-white cursor-not-allowed"
            >
              완료
            </Button>
          </div>
        )}

        <style jsx global>{`
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
            background: #ff491a;
            cursor: pointer;
          }

          @media (min-width: 768px) {
            ㅊ {
              width: 20px;
              height: 20px;
            }

            .zoom-slider {
              height: 4px !important;
            }
          }

          .zoom-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ff491a;
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
