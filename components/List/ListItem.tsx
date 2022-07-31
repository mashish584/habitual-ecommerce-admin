/* eslint-disable no-redeclare */

import React, { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowForwardIos } from "@mui/icons-material";

import Button from "../Button";
import { IconType } from "../types";

interface ListItemConfig {
  link: string;
  className: string;
  onAction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  actionIcon?: IconType;
}

type ListType = "link" | "text" | "action";

type ListItemProps = {
  className?: string;
  childClasses?: string;
  index?: number;
  linkPath?: string;
  actionIcon?: IconType;
  onAction?: (index: number) => void;
};

type ImagePathProps = ListItemProps & { isImage: true; imagePath: string; text?: string; type?: ListType };
type NoImagePathProps = ListItemProps & { isImage?: false; text: string; type: ListType };

function getListChild(type: ListType | undefined, text: string, config?: ListItemConfig) {
  switch (type) {
    case "text":
      return <p className={`text-darkGray ${config?.className}`}>{text || "-"}</p>;
    case "link":
      return (
        <Link href={config?.link || ""}>
          <a className={`text-darkGray font-bold underline ${config?.className}`}>{text || "-"}</a>
        </Link>
      );
    case "action":
      return (
        <Button
          type="button"
          variant="secondary"
          rightIcon={config?.actionIcon || ArrowForwardIos}
          className={config?.className}
          onClick={config?.onAction}
        >
          {text}
        </Button>
      );
    default:
      throw new Error(`Unhandled type: ${type}`);
  }
}

function ListItem(props: NoImagePathProps): JSX.Element;
function ListItem(props: ImagePathProps): JSX.Element;
function ListItem(props: ListItemProps & { isImage?: boolean; imagePath?: string; text?: string; type?: ListType }) {
  const { type, text, className, imagePath, isImage, index } = props;
  const classes = className || "flex-1";

  const onActionClick = useCallback(() => {
    if (index !== undefined) {
      props.onAction?.(index);
    }
  }, [index]);

  const Child = isImage ? (
    <div className="w-12 h-12 rounded-full overflow-hidden">
      {imagePath ? <Image src={imagePath} width={48} height={48} objectFit="cover" /> : null}
    </div>
  ) : (
    getListChild(type, text || "", {
      link: props.linkPath || "",
      className: props.childClasses || "",
      actionIcon: props.actionIcon,
      onAction: onActionClick,
    })
  );

  return <div className={classes}>{Child}</div>;
}

export default ListItem;
