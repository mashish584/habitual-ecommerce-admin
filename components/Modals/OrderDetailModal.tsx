import { RequestPageOutlined } from "@mui/icons-material";
import Image from "next/image";
import React from "react";
import Button from "../Button";
import Chip from "../Chip";
import { Address } from "../Layout";
import Line from "../Layout/Line";
import SideModal, { SideModalI } from "./SideModal";

interface OrderDetailsModalI extends SideModalI {}

const OrderDetailModal = ({ visible, onClose }: OrderDetailsModalI) => (
  <SideModal visible={visible} onClose={onClose}>
    <div>
      <div className="flex flex-row justify-between">
        <div>
          <h4 className="font-black text-2xl text-lightBlack">Order ID: 331904</h4>
          <div className="flex items-center mt-1">
            <span className="text-base text-darkGray">Order date: Feb 18, 2022</span>
            <div>
              <Chip variant="success" text="Delivered" className="ml-5" />
            </div>
          </div>
        </div>

        <Button variant="secondary" type="button" className="bg-darkGray w-32">
          <RequestPageOutlined />
          <span className="ml-1"> Invoice</span>
        </Button>
      </div>
    </div>
    <Line />
    <div>
      {new Array(3).fill(1).map((item, index) => (
        <>
          <div key={index} className="flex flex-row items-center">
            <Image
              src="https://ik.imagekit.io/imashish/habitual-ecommerce/bose-headphones_ImC6hyvwO.png?ik-sdk-version=javascript-1.4.3&updatedAt=1648364877566"
              width="100"
              height="100"
              objectFit="contain"
            />
            <div className="flex-1 ml-5">
              <div>
                <h3>Bose Headphone</h3>
                <span>$200 x 2 quantity</span>
              </div>
            </div>
            <span>$400</span>
          </div>
          <Line />
        </>
      ))}
    </div>
    <div className="flex justify-between">
      <div>
        <h6 className="font-bold text-lg text-black mb-2">Payment</h6>
        <span>Visa **56</span>
      </div>
      <div>
        <h6 className="font-bold text-lg text-black mb-2">Delivery</h6>
        <Address index={0} username="abc" />
      </div>
    </div>
    <Line />
    <div className="w-full mb-10 inline-block">
      <div className="flex justify-between items-center">
        <h5 className="text-2xl font-bold">Total</h5>
        <span className="text-2xl text-success font-extrabold">$1200.00</span>
      </div>
    </div>
  </SideModal>
);

export default OrderDetailModal;
