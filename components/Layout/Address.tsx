import React from "react";

type UserAddress = {
  username: string;
  streetName: string;
  city: string;
  state: string;
  pin: string;
  mobileNumber: string;
};
interface AddressI {
  index?: number;
  address: UserAddress;
}

const Address = ({ index, address }: AddressI) => (
  <div className="basis-5/12 mb-4">
    {index ? <span className="text-xs text-darkGray mb-2.5">Address #{index + 1}</span> : null}
    <h6 className="font-bold text-base text-black mb-2">{address.username}</h6>
    <address className="text-base font-normal not-italic text-lightBlack">
      {address.streetName} <br />
      {address.city}, ({address.state}) <br />
      {address.pin}, {address.mobileNumber}
    </address>
  </div>
);

export default Address;
