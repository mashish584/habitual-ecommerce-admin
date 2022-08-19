// import { RequestPageOutlined } from "@mui/icons-material";
import { Transactions, User } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
// import Button from "../Button";
import Chip from "../Chip";
import { Address } from "../Layout";
import Line from "../Layout/Line";
import SideModal, { SideModalI } from "./SideModal";

interface OrderDetailsModalI extends SideModalI {
  selectedOrder: Transactions & { user: User };
}

const OrderDetailModal = ({ visible, selectedOrder, onClose }: OrderDetailsModalI) => {
  if (!selectedOrder) return null;

  const orderedProducts = selectedOrder.details[0];

  return (
    <SideModal visible={visible} onClose={onClose}>
      <div>
        <div className="flex flex-row justify-between">
          <div>
            <h4 className="font-black text-2xl text-lightBlack">Order ID: {selectedOrder.transactionId}</h4>
            <div className="flex items-center mt-1">
              <span className="text-base text-darkGray">Order date: {dayjs(selectedOrder.createdAt).format("MMMM DD, YYYY hh:mm A")}</span>
              <div>
                <Chip variant="success" text={selectedOrder.orderStatus} className="ml-5" />
              </div>
            </div>
          </div>

          {/* <Button variant="secondary" type="button" className="bg-darkGray w-32">
            <RequestPageOutlined />
            <span className="ml-1">Invoice</span>
          </Button> */}
        </div>
      </div>
      <Line />
      <div>
        {Object.keys(orderedProducts).map((orderId, index) => {
          const { quantity, product } = orderedProducts[orderId];
          return (
            <>
              <div key={`${orderId}-${index}`} className="flex flex-row items-center">
                <Image src={product.image} width="100" height="100" objectFit="contain" />
                <div className="flex-1 ml-5">
                  <div>
                    <h3>{product.title}</h3>
                    <span>
                      ${product.price} x {quantity} quantity
                    </span>
                  </div>
                </div>
                <span>${product.price * quantity}</span>
              </div>
              <Line />
            </>
          );
        })}
      </div>
      <div className="flex justify-between">
        <div>
          <h6 className="font-bold text-lg text-black mb-2">Transaction Id</h6>
          <span>{selectedOrder.transactionId}</span>
        </div>
        <div>
          <h6 className="font-bold text-lg text-black mb-2">Delivery</h6>
          <Address
            index={0}
            address={{
              username: `${selectedOrder.address.firstName || ""} ${selectedOrder.address.lastName || ""} `,
              streetName: selectedOrder.address.streetName,
              city: selectedOrder.address.city,
              pin: selectedOrder.address.pin,
              mobileNumber: selectedOrder.address.mobileNumber,
              state: selectedOrder.address.state,
            }}
          />
        </div>
      </div>
      <Line />
      <div className="w-full mb-10 inline-block">
        <div className="flex justify-between items-center">
          <h5 className="text-2xl font-bold">Total</h5>
          <span className="text-2xl text-success font-extrabold">${selectedOrder.amount}</span>
        </div>
      </div>
    </SideModal>
  );
};

export default OrderDetailModal;
