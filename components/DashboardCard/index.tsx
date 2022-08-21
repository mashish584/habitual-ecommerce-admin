import React from "react";

import { IconType } from "../types";

interface DashboardCardI {
  Icon: IconType;
  title: string;
  count: number;
  className?: string;
}

const DashboardCard = ({ Icon, ...props }: DashboardCardI) => (
  <div
    className={`lg:max-w-xs w-3.5/12 h-40 bg-white rounded-xl p-6 dashboard-card-shadow smMax:w-full mdMax:w-3.5/12 mdMax:mr-0 smMax:h-40 lgMax:mr-0 lgMax:w-3.5/12 lgMax:h-36 xl:mr-12  ${
      props.className || ""
    }`}
  >
    <div className="flex flex-row">
      {Icon && (
        <div className="w-14 h-14 mr-4 rounded-full flex items-center justify-center bg-lightTheme text-lightBlack mdMax:w-10 mdMax:h-10 mdMax:mt-2 smMax:w-14 smMax:h-14 smMax:mt-0">
          <Icon />
        </div>
      )}
      <div className="py-4">
        <h3 className="ff-lato font-bold opacity-70 text-xl mb-4">{props.title}</h3>
        <p className="ff-lato text-5xl font-bold mdMax:text-4xl lgMax:text-4xl smMax:text-6xl">{props.count}</p>
      </div>
    </div>
  </div>
);

export default DashboardCard;
