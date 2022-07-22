import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

type Icon = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};

interface DashboardCardI {
  Icon: Icon;
  title: string;
  count: string;
  className?: string;
}

const DashboardCard = ({ Icon, ...props }: DashboardCardI) => {
  return (
    <div className={`w-80 h-44 bg-white rounded-xl mr-12 p-6 dashboard-card-shadow ${props.className || ""}`}>
      <div className="flex flex-row">
        {Icon && (
          <div className="w-14 h-14 mr-4 rounded-full flex items-center justify-center bg-lightTheme text-lightBlack">
            <Icon />
          </div>
        )}
        <div className="py-4">
          <h3 className="ff-lato font-bold opacity-70 text-xl mb-4">{props.title}</h3>
          <p className="ff-lato text-6xl font-bold">{props.count}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
