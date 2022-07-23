import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button";
import { ArrowForwardIos } from "@mui/icons-material";
import { IconType } from "../types";

interface ListItemConfig {
  link: string;
  className: string;
  onAction: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  actionIcon?: IconType;
}

type ListType = "link" | "text" | "action";

type ListItemProps = {
  className?: string;
  childClasses?: string;
  linkPath?: string;
  actionIcon?: IconType;
  onAction?: () => void;
};

type ImagePathProps = ListItemProps & { isImage: true; imagePath: string; text?: string; type?: ListType };
type NoImagePathProps = ListItemProps & { isImage?: false; text: string; type: ListType };

function getListChild(type: ListType | undefined, text: string, config?: ListItemConfig) {
  switch (type) {
    case "text":
      return <p className={`text-darkGray ${config?.className}`}>{text}</p>;
    case "link":
      return (
        <Link href={config?.link || ""}>
          <a className={`text-darkGray font-bold underline ${config?.className}`}>{text}</a>
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
  const { type, text, className, imagePath, isImage } = props;
  const classes = className || "flex-1";

  const Child = isImage ? (
    <div className="w-12 h-12 rounded-full overflow-hidden">
      <Image src={imagePath} width={55} height={55} objectFit="cover" />
    </div>
  ) : (
    getListChild(type, text || "", {
      link: props.linkPath || "",
      className: props.childClasses || "",
      actionIcon: props.actionIcon,
      onAction: props.onAction || (() => {}),
    })
  );

  return <div className={classes}>{Child}</div>;
}

export default ListItem;
