import { SvgIconTypeMap } from "@mui/material";

import { OverridableComponent } from "@mui/material/OverridableComponent"; // eslint-disable-line import/no-unresolved

export type IconType = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};
