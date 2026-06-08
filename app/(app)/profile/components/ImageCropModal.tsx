"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";

interface ImageCropModalProps {
  imageUrl: string;
  onCropComplete: (file: File) => void;
  onCancel: () => void;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
  });
}

async function getCroppedImg(imageUrl: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas to Blob failed"));
    }, "image/jpeg", 0.9);
  });
}

export function ImageCropModal({ imageUrl, onCropComplete, onCancel }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cropperRef = useRef<HTMLDivElement>(null);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropAreaComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(imageUrl, croppedAreaPixels);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      onCropComplete(file);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close crop dialog"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-2xl">
        <h2 className="mb-1 text-lg font-bold text-gray-900">Cắt ảnh đại diện</h2>
        <p className="mb-4 text-xs text-gray-400">Kéo thả để căn chỉnh ảnh trong khung</p>

        <div
          ref={cropperRef}
          className="relative mx-auto h-80 w-full overflow-hidden rounded-lg bg-gray-100"
        >
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-gray-500">Thu nhỏ</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-orange-500"
          />
          <span className="text-xs text-gray-500">Phóng to</span>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Hủy
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isProcessing}>
            {isProcessing ? "Đang xử lý..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
