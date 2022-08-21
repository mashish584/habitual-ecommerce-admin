import React from "react";
import Image from "next/image";

import Chip from "../Chip";
import { Address, Line } from "../Layout";
import SideModal, { SideModalI } from "./SideModal";

import { UserI } from "../../utils/types";
import { formatDate } from "../../utils/feUtils";

interface UserDetailModalI extends SideModalI {
  selectedUser: UserI;
}

const UserDetailModal = ({ visible, selectedUser, onClose }: UserDetailModalI) => (
  <SideModal visible={visible} onClose={onClose}>
    <div className="flex flex-row">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-lightGray">
        {selectedUser?.profile && <Image src={selectedUser.profile} width="100%" height="100%" objectFit="cover" />}
      </div>
      <div className="pt-2 ml-6">
        <h4 className="font-black text-2xl text-lightBlack">{selectedUser?.fullname || "Unknown"}</h4>
        <span className="text-base text-darkGray">Joined on: &nbsp;{formatDate(selectedUser?.createdAt, "MMMM DD, YYYY")}</span>
      </div>
    </div>
    <p className="text-lightBlack mt-10 font-medium text-base">{selectedUser?.bio || "Bio not available."}</p>
    <Line />

    <h5 className="font-bold text-lg text-black mb-3.5">Addresses</h5>

    <div className={"flex flex-wrap overflow-auto"}>
      {selectedUser?.addresses?.map((address, index) => (
        <Address index={index + 1} key={address.id} address={address} />
      ))}
      {selectedUser?.addresses?.length === 0 && <p className="text-lightBlack font-medium text-base">Address not added.</p>}
    </div>

    <h5 className="font-bold text-lg text-black mt-6">Number of Orders</h5>
    <span className="mt-1 inline-block">{selectedUser?.ordersCount}</span>
    <h5 className="font-bold text-lg text-black mt-6">Number of Favourite Products</h5>
    <span className="mt-1 inline-block">{selectedUser?.favouriteProductIds?.length}</span>
    <h5 className="font-bold text-lg text-black mt-6">Interests</h5>
    <div className="mb-5 inline-block pt-2">
      {selectedUser?.interests?.map((interest) => (
        <Chip text={interest.name} key={interest.id} className="inline-block" />
      ))}
    </div>
  </SideModal>
);

export default UserDetailModal;
