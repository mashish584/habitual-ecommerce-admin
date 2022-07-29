import React from "react";
import Link from "next/link";
import {
  HomeOutlined,
  ShoppingBasketOutlined,
  SupervisorAccountOutlined,
  ShoppingCartOutlined,
  SettingsOutlined,
  CategoryOutlined,
} from "@mui/icons-material";
import Image from "next/image";

interface NavigationValue {
  component: typeof HomeOutlined;
  path: string;
}

const navigationItems: Record<string, NavigationValue> = {
  Home: {
    component: HomeOutlined,
    path: "/admin",
  },
  Products: {
    component: ShoppingBasketOutlined,
    path: "/admin/products",
  },
  Categories: {
    component: CategoryOutlined,
    path: "/admin/categories",
  },
  Users: {
    component: SupervisorAccountOutlined,
    path: "/admin/users",
  },
  Orders: {
    component: ShoppingCartOutlined,
    path: "/admin/orders",
  },
  Settings: {
    component: SettingsOutlined,
    path: "/admin/settings",
  },
};

interface NavigationI {
  visible: boolean;
}

const Navigation = ({ visible }: NavigationI) => (
  <aside
    className={`w-64 fixed inset-y-0 bg-white flex flex-col items-center shadow-lg ${
      !visible ? "lgMax:-translate-x-full" : "translate-x-0"
    }`}
  >
    <Link href="">
      <a className="mt-10">
        <Image
          src={"https://ik.imagekit.io/imashish/habitual-ecommerce/portal/logo?ik-sdk-version=javascript-1.4.3&updatedAt=1658368339830"}
          width={185}
          height={43.21}
        />
      </a>
    </Link>
    <nav className="w-full flex flex-col flex flex-1 mt-20">
      {Object.keys(navigationItems).map((label) => {
        const { component: Icon, path } = navigationItems[label];
        return (
          <Link key={label} href={path}>
            <a className="text-black w-9/12 mx-auto mb-5 h-14 px-5 rounded-3xl flex flex-row items-center hover:bg-lightTheme transition-colors duration-300">
              <Icon fontSize="medium" />
              <span className="ml-5">{label}</span>
            </a>
          </Link>
        );
      })}
    </nav>
  </aside>
);

export default Navigation;
