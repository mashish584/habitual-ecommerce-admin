import { EditOutlined } from "@mui/icons-material";
import Image from "next/image";
import React from "react";
import Button from "../Button";
import Chip from "../Chip";
import SideModal, { SideModalI } from "./SideModal";

interface ProductDetailModalI extends SideModalI {}

const ProductDetailModal: React.FC<ProductDetailModalI> = ({ visible, onClose }) => (
  <SideModal visible={visible} onClose={onClose}>
    <div>
      <div className="flex flex-row justify-between items-center">
        <div>
          <h2 className="ff-lato font-black text-2xl">Macbook Pro 2022</h2>
          <div className="mt-2">
            {new Array(5).fill(1).map((_, index) => (
              <Chip key={index} text={`Chip ${index + 1}`} />
            ))}
          </div>
        </div>
        <div className="w-10 h-10">
          <Button variant="primary" type="button" style={{ height: "100%", padding: 0 }} className="rounded-xl">
            <EditOutlined />
          </Button>
        </div>
      </div>
      <p className="text-lightBlack mt-10 mb-5 font-medium text-base">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque,
        aliquet vel, dapibus id, mattis vel, nisi. Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit
        nunc tortor eu nibh. Nullam mollis. Ut justo. Suspendisse potenti. Sed egestas, ante et vulputate volutpat, eros pede semper est,
        vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent
        elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu
        pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, fermentum et, dapibus sed, urna.
      </p>
      <div className="flex justify-between items-center">
        <p>
          <span className="text-2xl text-success font-extrabold">$245.00</span>
          <span className="text-medium text-lg text-gray ml-2">(55 units available)</span>
        </p>
        <div>
          <Chip variant="success" text="10% OFF" />
        </div>
      </div>
      <div className="flex mt-5 py-2">
        <div className="w-32 h-32 rounded-xl overflow-hidden bg-white mr-3.5 flex justify-center items-center border border-gray/50 hover:shadow-2xl ease-in duration-300">
          <Image
            src="https://ik.imagekit.io/imashish/habitual-ecommerce/bose-headphones_ImC6hyvwO.png?ik-sdk-version=javascript-1.4.3&updatedAt=1648364877566"
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </div>
        <div className="w-32 h-32 rounded-xl overflow-hidden bg-lightGray mr-3.5 flex justify-center items-center border border-gray/50 hover:shadow-2xl ease-in duration-300">
          <Image
            src="https://ik.imagekit.io/imashish/habitual-ecommerce/bose-headphones_ImC6hyvwO.png?ik-sdk-version=javascript-1.4.3&updatedAt=1648364877566"
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  </SideModal>
);

export default ProductDetailModal;
