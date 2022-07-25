import { ImageOutlined } from "@mui/icons-material";
import Image from "next/image";
import React from "react";

const ImagePicker = () => (
  <div className={"w-full mb-3.5"}>
    <label className="ff-lato text-xs font-extrabold inline-block mb-1">Add Image</label>
    <div className="flex flex-row flex-wrap">
      {new Array(4).fill(1).map((_, index) => (
        <div key={index} className="relative w-24 h-24 bg-lightGray border-gray border-1 rounded-lg mr-2 mb-1 mt-1 overflow-hidden">
          <Image src={"https://unsplash.it/100/100"} width={"100%"} height="100%" />
          <div className="absolute w-6 h-6 bg-white rounded-md overflow-hidden bottom-1.5 right-1.5 border-2 border-white">
            <input type="color" className="w-full h-full" />
          </div>
        </div>
      ))}
      <input type="file" id="file" name="file" className="w-0 h-0 opacity-0" />
      <label
        className="w-24 h-24 bg-lightGray border-gray border-1 flex flex-col items-center justify-center rounded-lg font-bold text-lightBlack text-xs mt-1"
        htmlFor="file"
      >
        <ImageOutlined />
        <span> Add Images</span>
      </label>
    </div>
  </div>
);

export default ImagePicker;
