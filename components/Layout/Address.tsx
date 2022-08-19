import React from "react";
import { Address as AddressT } from "../../utils/types";

interface AddressI {
  index?: number;
  address: AddressT;
}

const Address = ({ index, address }: AddressI) => (
  <div className="basis-5/12 mb-4">
    {index ? <span className="text-xs text-darkGray mb-2.5">Address #{index}</span> : null}
    <h6 className="font-bold text-base text-black mb-2">{`${address.firstName} ${address.lastName}`}</h6>
    <address className="text-base font-normal not-italic text-lightBlack">
      {address.streetName} <br />
      {address.city}, ({address.state}) <br />
      {address.pin}, {address.mobileNumber}
    </address>
  </div>
);

export default Address;
