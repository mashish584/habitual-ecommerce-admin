import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Delete, ImageOutlined } from "@mui/icons-material";
import { PreviewImage } from "../../utils/types";
import Label from "./Label";
import { showToast } from "../../utils/feUtils";

interface ImagePickerI {
  label?: string;
  actionText?: string;
  previousUploadUrls?: Record<string, PreviewImage>;
  maxUpload: number;
  resetComponentState: boolean;
  className?: string;
  onColorChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onChange: (files: File[] | File) => void;
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
  resetComponentState,
  previousUploadUrls,
  maxUpload,
  onChange,
  onColorChange,
  className,
  onImageRemove,
}: ImagePickerI) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const selectedFiles = useRef<File[] | null>(null);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList?.length) {
      if (!isValidMediaSelected(Array.from(fileList))) {
        showToast("Please select valid image file.", "error");
      } else {
        const isSingleUpload = maxUpload === 1;
        const selectedUploadFiles = Array.from(fileList);
        const files = !isSingleUpload && selectedFiles.current ? [...selectedFiles.current, ...selectedUploadFiles] : selectedUploadFiles;
        if (files.length > maxUpload) {
          showToast(`You're allowed to upload ${maxUpload} images.`, "error");
        } else {
          const urls = generateURLFromFiles(files);
          setPreviewImages(!isSingleUpload && previousUploadUrls ? [...Object.values(previousUploadUrls), ...urls] : urls);
          selectedFiles.current = files;
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
      setPreviewImages((previousImages) => {
        const updatedIds = Object.keys(previousUploadUrls);

        // Set "null" for remove image else update with "previousUploadUrls" if "id" match
        // else return the default image
        function filterRemoveImage(image: PreviewImage) {
          if (image.id && !updatedIds.includes(image.id)) {
            return null;
          }
          if (image.id && updatedIds.includes(image.id) && previousUploadUrls) {
            return previousUploadUrls[image.id];
          }
          return image;
        }

        const images = previousImages.length
          ? (previousImages.map(filterRemoveImage).filter((image) => image !== null) as PreviewImage[])
          : Object.values(previousUploadUrls);

        return images;
      });
    }
  }, [previousUploadUrls]);

  useEffect(() => {
    if (resetComponentState) {
      setPreviewImages([]);
      selectedFiles.current = null;
    }
  }, [resetComponentState]);

  return (
    <>
      <div className={`w-full mb-3.5 ${className}`}>
        <label className="ff-lato text-xs font-extrabold inline-block mb-1">{label || "Add Image"}</label>
        <div className="flex flex-row flex-wrap">
          {previewImages.map(({ id, url, isLoading, backgroundColor, color }, index) => (
            <div key={id || index} className={`relative ${isLoading ? "opacity-50" : "opacity-1"}`}>
              <div className={"relative w-24 h-fit bg-lightGray p-2 border-gray border-1 rounded-lg mr-2 mb-1 mt-1 $"}>
                <Image src={url} width={"100%"} height="100%" objectFit="contain" />
                {onColorChange ? (
                  <>
                    {/* Image colors */}
                    <div className="w-20">
                      <Label label="Background" className="font-medium mb-0.5" />
                      <div className="w-full h-7 bg-white rounded-md overflow-hidden bottom-1.5 right-1.5 border-2 border-white">
                        <input
                          type="color"
                          name="backgroundColor"
                          defaultValue={backgroundColor || "#FFFFFF"}
                          onChange={onColorChange}
                          data-index={index}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="w-20">
                      <Label label="Text" className="font-medium mb-0.5" />
                      <div className=" w-full h-7 bg-white rounded-md overflow-hidden bottom-1.5 right-1.5 border-2 border-white">
                        <input
                          type="color"
                          name="color"
                          defaultValue={color || "#222222"}
                          onChange={onColorChange}
                          data-index={index}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              {id !== null && (
                <button type="button" onClick={onImageRemove} data-image={id} className="text-danger flex flex-row items-center">
                  <Delete fontSize="small" />
                  <span> {isLoading ? "Removing...." : "Remove"}</span>
                </button>
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
    </>
  );
};

export default ImagePicker;
