import Image from "next/image";
import React from "react";
import Chip from "../Chip";
import Line from "../Layout/Line";
import SideModal, { SideModalI } from "./SideModal";

interface UserDetailModalI extends SideModalI {}

const UserDetailModal = ({ visible, onClose }: UserDetailModalI) => {
  return (
    <SideModal visible={visible} onClose={onClose}>
      <div className="flex flex-row">
        <div className="w-20 h-20 rounded-xl overflow-hidden ">
          <Image src={"https://unsplash.it/100/100"} width="100%" height="100%" objectFit="cover" />
        </div>
        <div className="pt-2 ml-6">
          <h4 className="font-black text-2xl text-lightBlack">Jane Doe</h4>
          <span className="text-base text-darkGray">Joined on: Feb 18, 2022</span>
        </div>
      </div>
      <p className="text-lightBlack mt-10 font-medium text-base">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero illo, suscipit possimus neque quia eligendi qui minima iure, vitae,
        natus laudantium aut quasi aliquam! Facere odio optio natus soluta ratione!
      </p>
      <Line />

      <h5 className="font-bold text-lg text-black mb-3.5">Addresses</h5>

      <div className="flex flex-wrap h-72 overflow-auto">
        {new Array(4).fill(1).map((_, index) => {
          return (
            <div key={index} className="basis-5/12 mb-4">
              <span className="text-xs text-darkGray mb-2.5">Address #{index + 1}</span>
              <h6 className="font-bold text-base text-black mb-2">Jane Doe</h6>
              <address className="text-base font-normal not-italic text-lightBlack">
                2972 Westheimer Rd. <br />
                Santa Ana, Illinois <br />
                85486, United States of America
              </address>
            </div>
          );
        })}
      </div>

      <h5 className="font-bold text-lg text-black mt-3.5">Number of Orders</h5>
      <span>2 orders</span>
      <h5 className="font-bold text-lg text-black mt-3.5">Number of Favourite Products</h5>
      <span>2 products</span>
      <h5 className="font-bold text-lg text-black mt-3.5">Interests</h5>
      <div className="mb-5 inline-block">
        <Chip text="Electronics" />
        <Chip text="Laptops" />
      </div>
    </SideModal>
  );
};

export default UserDetailModal;