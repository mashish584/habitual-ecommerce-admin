import React, { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HomeOutlined,
  ShoppingBasketOutlined,
  SupervisorAccountOutlined,
  ShoppingCartOutlined,
  CategoryOutlined,
  LogoutOutlined,
} from "@mui/icons-material";

import LogoutModal from "../Modals/LogoutModal";
import { useMenuContext } from "../../context/MenuContext";

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
};

const Navigation = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isMobileNavigationActive, showMobileNavigation, activePath } = useMenuContext();
  const visible = isMobileNavigationActive && showMobileNavigation;

  const openLogoutModal = () => setShowLogoutModal(true);

  const closeLogoutModal = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  return (
    <>
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
            const isActive = path === activePath;

            return (
              <>
                <Link key={label} href={path}>
                  <a
                    className={`text-black w-9/12 mx-auto mb-5 h-14 px-5 rounded-3xl flex flex-row items-center hover:bg-lightTheme transition-colors duration-300 ${
                      isActive ? "bg-lightTheme" : ""
                    }`}
                  >
                    <Icon fontSize="medium" />
                    <span className="ml-5">{label}</span>
                  </a>
                </Link>
              </>
            );
          })}
          <Link href="">
            <a
              onClick={openLogoutModal}
              className={
                "text-black w-9/12 mx-auto mb-5 h-14 px-5 rounded-3xl flex flex-row items-center hover:bg-lightTheme transition-colors duration-300 cursor-pointer"
              }
            >
              <LogoutOutlined />
              <span className="ml-5">Logout</span>
            </a>
          </Link>
        </nav>
      </aside>
      <LogoutModal visible={showLogoutModal} onClose={closeLogoutModal} />
    </>
  );
};

export default Navigation;
