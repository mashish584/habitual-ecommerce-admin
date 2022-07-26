import React from "react";

interface AddressI {
  index?: number;
  username: string;
}

const Address = (props: AddressI) => {
  return (
    <div className="basis-5/12 mb-4">
      {props.index ? <span className="text-xs text-darkGray mb-2.5">Address #{props.index + 1}</span> : null}
      <h6 className="font-bold text-base text-black mb-2">Jane Doe</h6>
      <address className="text-base font-normal not-italic text-lightBlack">
        2972 Westheimer Rd. <br />
        Santa Ana, Illinois <br />
        85486, United States of America
      </address>
    </div>
  );
};

export default Address;
