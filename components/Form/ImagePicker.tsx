import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Delete, ImageOutlined } from "@mui/icons-material";

export type PreviewImage = {
  id: string | null;
  url: string;
  color?: string;
  isLoading?: boolean;
};

interface ImagePickerI {
  label?: string;
  actionText?: string;
  previousUploadUrls?: Record<string, PreviewImage>;
  selectedFiles: File | File[];
  maxUpload: number;
  className?: string;
  onChange: (files: File[] | File) => void;
  onImageRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

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

const ImagePicker = ({
  label,
  actionText,
  selectedFiles,
  previousUploadUrls,
  maxUpload,
  onChange,
  className,
  onImageRemove,
}: ImagePickerI) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  const previouseSelectedFiles = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList?.length) {
      if (!isValidMediaSelected(Array.from(fileList))) {
        alert("Please select valid image media.");
      } else {
        const isSingleUpload = maxUpload === 1;
        const files = !isSingleUpload ? Array.from(fileList).concat(Array.from(previouseSelectedFiles)) : Array.from(fileList);

        if (files.length > maxUpload) {
          alert("Max file limit exceed.");
        } else {
          const urls = generateURLFromFiles(files);
          setPreviewImages(previousUploadUrls ? [...Object.values(previousUploadUrls), ...urls] : urls);
          onChange(isSingleUpload ? files[0] : files);
        }
      }
    }

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  useEffect(() => {
    if (previousUploadUrls) {
      const urls = generateURLFromFiles(previouseSelectedFiles);
      setPreviewImages([...urls, ...Object.values(previousUploadUrls)]);
    }
  }, [previousUploadUrls]);

  return (
    <>
      <div className={`w-full mb-3.5 ${className}`}>
        <label className="ff-lato text-xs font-extrabold inline-block mb-1">{label || "Add Image"}</label>
        <div className="flex flex-row flex-wrap">
          {previewImages.map(({ id, url, isLoading }, index) => {
            return (
              <div className={isLoading ? "opacity-50" : "opacity-1"}>
                <div key={id || index} className={`relative w-24 h-fit bg-lightGray p-2 border-gray border-1 rounded-lg mr-2 mb-1 mt-1 $`}>
                  <Image src={url} width={"100%"} height="100%" objectFit="contain" />
                </div>
                {id !== null && (
                  <button type="button" onClick={onImageRemove} data-image={id} className="text-danger flex flex-row items-center">
                    <Delete fontSize="small" />
                    <span> {isLoading ? "Removing...." : "Remove"}</span>
                  </button>
                )}
              </div>
            );
          })}
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
    </>
  );
};

export default ImagePicker;
