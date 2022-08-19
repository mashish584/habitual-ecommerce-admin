import React, { useEffect, useState } from "react";
import { ShoppingBasketOutlined, ShoppingCartOutlined, SupervisorAccountOutlined } from "@mui/icons-material";
import dayjs from "dayjs";

import { Transactions, User } from "@prisma/client";
import SectionHeading from "../../components/SectionHeading";
import DashboardCard from "../../components/DashboardCard";
import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListItem, ListRow } from "../../components/List";
import { OrderDetailModal } from "../../components/Modals";
import { appFetch } from "../../utils/api";

type Orders = Transactions & { user: User };

const Index = () => {
  const [, setIsLoading] = useState(false);
  const [counts, setCounts] = useState({
    user: 0,
    product: 0,
    order: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Orders[]>([]);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);

  const fetchHomeInfo = async () => {
    setIsLoading(true);
    const response = await appFetch("/home", {
      method: "GET",
    });
    setIsLoading(false);
    if (response.data) {
      setCounts(response.data.count);
      setRecentOrders(response.data.recentOrders);
    }
  };

  useEffect(() => {
    fetchHomeInfo();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-row lg:container mb-16 smMax:flex-col xlMax:justify-between">
        <DashboardCard Icon={SupervisorAccountOutlined} title="Users" count={counts.user} className="smMax:mb-4" />
        <DashboardCard Icon={ShoppingBasketOutlined} title="Products" count={counts.product} className="smMax:mb-4" />
        <DashboardCard Icon={ShoppingCartOutlined} title="Orders" count={counts.order} className="smMax:mb-4" />
      </div>
      <div className="lg:container">
        <SectionHeading title="Recent Orders" isPath={true} path="/orders" />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024">
            {recentOrders.map((order) => {
              const { user } = order;
              return (
                <ListRow key={order.id} className="justify-between">
                  <ListItem isImage={true} imagePath={user.profile} className="w-12 h-12 rounded-full" />
                  <ListItem type="text" text={user.fullname} className="w-32" />
                  <ListItem type="text" text={user.email} className="w-32" />
                  <ListItem type="text" text={dayjs(order.createdAt).format("MMMM DD, YYYY hh:mm A")} className="w-42" />
                  <ListItem type="text" text={`${order.productIds.length} items`} className="w-16" />
                  <ListItem type="text" text={`$${order.amount}`} className="w-16" />
                  <ListItem type="text" text={order.orderStatus} className="w-20" childClasses="text-success" />
                  <ListItem
                    type="action"
                    text="View"
                    className="w-40"
                    childClasses="radius-80"
                    onAction={() => setShowOrderDetailModal(true)}
                  />
                </ListRow>
              );
            })}
          </ListContainer>
        </div>
      </div>
      <OrderDetailModal visible={showOrderDetailModal} onClose={() => setShowOrderDetailModal(false)} />
    </DashboardLayout>
  );
};

export default Index;
