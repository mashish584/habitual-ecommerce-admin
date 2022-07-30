import React, { useRef, useState } from "react";
import Image from "next/image";
import { ImageOutlined } from "@mui/icons-material";

interface ImagePickerI {
  label?: string;
  actionText?: string;
  showColorPicker?: boolean;
  selectedFiles: File[];
  maxUpload: number;
  onChange: (files: File[]) => void;
}

type PreviewImage = {
  id: string | null;
  url: string;
  color?: string;
};

function generateURLFromFiles(files: File[]) {
  const urls: PreviewImage[] = [];
  Array.from(files).map((file) => {
    const url = URL.createObjectURL(file);
    urls.push({ id: null, url });
  });
  return urls;
}

function isValidMediaSelected(files: File[]) {
  const isInvalidFileExist = files.some((file) => !file.type.includes("image"));
  return !isInvalidFileExist;
}

const ImagePicker = ({ showColorPicker, label, actionText, selectedFiles, maxUpload, onChange }: ImagePickerI) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList?.length) {
      if (!isValidMediaSelected(Array.from(fileList))) {
        alert("Please select valid image media.");
      } else {
        const files = maxUpload > 1 ? Array.from(fileList).concat(Array.from(selectedFiles)) : Array.from(fileList);
        const urls = generateURLFromFiles(files);
        setPreviewImages(urls);
        onChange(files);
      }
    }

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className={"w-full mb-3.5"}>
      <label className="ff-lato text-xs font-extrabold inline-block mb-1">{label || "Add Image"}</label>
      <div className="flex flex-row flex-wrap">
        {previewImages.map(({ id, url }, index) => (
          <div
            key={id || index}
            className="relative w-24 h-24 bg-lightGray p-2 border-gray border-1 rounded-lg mr-2 mb-1 mt-1 overflow-hidden"
          >
            <Image src={url} width={"100%"} height="100%" objectFit="contain" />
            {showColorPicker && (
              <div className="absolute w-6 h-6 bg-white rounded-md overflow-hidden bottom-1.5 right-1.5 border-2 border-white">
                <input type="color" className="w-full h-full" />
              </div>
            )}
          </div>
        ))}
        <input type="file" id="file" name="file" className="w-0 h-0 opacity-0" ref={fileRef} accept="image/*" onChange={onFileSelect} />
        <label
          className="w-24 h-24 bg-lightGray border-gray border-1 flex flex-col items-center justify-center rounded-lg font-bold text-lightBlack text-xs mt-1"
          htmlFor="file"
        >
          <ImageOutlined />
          <span>{actionText || "Add Images"}</span>
        </label>
      </div>
    </div>
  );
};

export default ImagePicker;
