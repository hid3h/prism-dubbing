"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";

export const ImageEditor = () => {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (image) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        if (ctx) {
          // フォントとスタイルの設定をコード内で固定
          const fontFamily = "'Hiragino Maru Gothic', sans-serif";
          const fontSize = 30;
          const fontWeight = 200; // 細め
          const textColor = "#fbb0f4"; // ピンク色
          const outline = true;
          const outlineColor = "#FFFFFF"; // 白色

          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = textColor;

          const lines = text.split("\n");
          const lineHeight = fontSize * 1.2; // 行間を調整

          lines.forEach((line, i) => {
            const x = 20;
            const y = 40 + i * lineHeight;

            if (outline) {
              ctx.strokeStyle = outlineColor;
              ctx.lineWidth = 2;
              ctx.strokeText(line, x, y);
            }

            ctx.fillText(line, x, y);
          });
        }

        setImageUrl(canvas.toDataURL());
      };
      img.src = URL.createObjectURL(image);
    }
  }, [image, text]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
        className="mb-4"
      />

      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="重ねるテキストを入力してください"
        className="w-full p-2 mb-4 border rounded"
        rows={5}
      />

      {/* キャンバスは表示せず、オフスクリーンで処理を行います */}

      {imageUrl && (
        <div className="mb-4">
          <NextImage
            src={imageUrl}
            alt="Edited image"
            width={300}
            height={300}
          />
        </div>
      )}

      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        画像をダウンロード
      </button>
    </div>
  );
};
