import React from "react";
import Image from "next/image";
import { EditOutlined } from "@mui/icons-material";

import Button from "../Button";
import Chip from "../Chip";
import SideModal, { SideModalI } from "./SideModal";
import { Product } from "../../hooks/useProduct";

interface ProductDetailModalI extends SideModalI {
  selectedProduct: Product | null;
}

const ProductDetailModal: React.FC<ProductDetailModalI> = ({ visible, selectedProduct, onClose }) => {
  return (
    <SideModal visible={visible} onClose={onClose}>
      <div>
        <div className="flex flex-row justify-between items-center">
          <div>
            <h2 className="ff-lato font-black text-2xl">{selectedProduct?.title}</h2>
            <div className="mt-2">
              {selectedProduct?.category.map((category) => (
                <Chip key={category.id} text={category.name} />
              ))}
            </div>
          </div>
          <div className="w-10 h-10">
            <Button variant="primary" type="button" style={{ height: "100%", padding: 0 }} className="rounded-xl">
              <EditOutlined />
            </Button>
          </div>
        </div>
        <p className="text-lightBlack mt-10 mb-5 font-medium text-base">{selectedProduct?.description}</p>
        <div className="flex justify-between items-center">
          <p>
            <span className="text-2xl text-success font-extrabold">${selectedProduct?.price}</span>
            <span className="text-medium text-lg text-gray ml-2">({selectedProduct?.quantity} units available)</span>
          </p>
          <div>{selectedProduct?.discount && <Chip variant="success" text={`${selectedProduct.discount}% OFF`} />}</div>
        </div>
        <div className="flex mt-5 py-2">
          {selectedProduct?.images.map((image, index) => {
            return (
              <div
                key={`${image.name}-${index}`}
                className="w-32 h-32 rounded-xl overflow-hidden bg-white mr-3.5 flex justify-center items-center border border-gray/50 hover:shadow-2xl ease-in duration-300"
              >
                <Image src={image.url} width="100%" height="100%" objectFit="contain" />
              </div>
            );
          })}
        </div>
      </div>
    </SideModal>
  );
};

export default ProductDetailModal;
