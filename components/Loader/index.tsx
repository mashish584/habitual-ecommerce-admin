import React from "react";
import styles from "./Loader.module.css";

interface LoaderI {
  className?: string;
}

const Loader = ({ className }: LoaderI) => <span className={`${styles.loader} border-white ${className}`}></span>;

export default Loader;
