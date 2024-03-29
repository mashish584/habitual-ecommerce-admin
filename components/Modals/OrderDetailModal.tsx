import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RequestPageOutlined } from "@mui/icons-material";

import Chip from "../Chip";
import Line from "../Layout/Line";
import { Address } from "../Layout";
import SideModal, { SideModalI } from "./SideModal";

import { Order } from "../../utils/types";
import { formatDate } from "../../utils/feUtils";

interface OrderDetailsModalI extends SideModalI {
  selectedOrder: Order;
}

const OrderDetailModal = ({ visible, selectedOrder, onClose }: OrderDetailsModalI) => {
  const orderedProducts = selectedOrder?.details[0];

  return (
    <SideModal visible={visible} onClose={onClose}>
      {selectedOrder === null ? null : (
        <>
          <div>
            <div className="flex flex-row justify-between">
              <div>
                <h4 className="font-black text-2xl text-lightBlack">Order ID: &nbsp;{selectedOrder.orderId}</h4>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-base text-darkGray">
                    Order date: &nbsp;{formatDate(selectedOrder.createdAt, "MMMM DD, YYYY hh:mm a")}
                  </span>
                  <Chip variant="success" text={selectedOrder.orderStatus} className="ml-5" />
                </div>
              </div>
              {selectedOrder.receiptUrl ? (
                <Link href={selectedOrder.receiptUrl}>
                  <a
                    className="bg-white w-32 h-10 flex items-center justify-center rounded text-darkGray border-darkGray border-2"
                    target="_blank"
                  >
                    <RequestPageOutlined />
                    <span className="ml-1">Invoice</span>
                  </a>
                </Link>
              ) : null}
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
              <Address index={0} address={selectedOrder.address} />
            </div>
          </div>
          <Line />
          <div className="w-full mb-10 inline-block">
            <div className="flex justify-between items-center">
              <h5 className="text-2xl font-bold">Total</h5>
              <span className="text-2xl text-success font-extrabold">${selectedOrder.amount}</span>
            </div>
          </div>
        </>
      )}
    </SideModal>
  );
};

export default OrderDetailModal;
