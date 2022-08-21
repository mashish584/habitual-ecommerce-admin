import React, { useCallback, useEffect, useState } from "react";
import { ShoppingBasketOutlined, ShoppingCartOutlined, SupervisorAccountOutlined } from "@mui/icons-material";

import SectionHeading from "../../components/SectionHeading";
import DashboardCard from "../../components/DashboardCard";
import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListItem, ListRow } from "../../components/List";
import { OrderDetailModal } from "../../components/Modals";

import { appFetch } from "../../utils/api";
import { Order } from "../../utils/types";
import { formatDate } from "../../utils/feUtils";
import withAuth from "../../hoc/withAuth";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState({
    user: 0,
    product: 0,
    order: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: null,
  });

  const fetchHomeInfo = async () => {
    setIsLoading(true);
    const response = await appFetch("/home?isAdmin=true", {
      method: "GET",
    });
    setIsLoading(false);
    if (response.data) {
      setCounts(response.data.count);
      setRecentOrders(response.data.recentOrders);
    }
  };

  const showOrderDetails = useCallback(
    (orderIndex: string) => {
      setShowOrderDetailModal({ visible: true, data: recentOrders[parseInt(orderIndex)] });
    },
    [recentOrders],
  );

  const hideOrderDetails = useCallback(() => {
    setShowOrderDetailModal({ visible: false, data: null });
  }, []);

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
          <ListContainer className="mw-1024" isLoading={isLoading} message={recentOrders.length === 0 ? "No orders available." : null}>
            {/* Table Heading */}
            <ListRow className="bg-white sticky top-0 z-10 left-0 right-0 justify-between">
              <ListItem type="heading" text={"#"} className="w-12 text-center" />
              <ListItem type="heading" text={"Name"} className="w-32" />
              <ListItem type="heading" text={"Order Date"} className="w-46" />
              <ListItem type="heading" text={"No. of Items"} className="w-16" />
              <ListItem type="heading" text={"Amount"} className="w-16" />
              <ListItem type="heading" text={"Status"} className="w-20" />
              <ListItem type="heading" text={"Action"} className="w-24" />
            </ListRow>

            {/* Table Content */}
            {recentOrders.map((order, index) => {
              const { user } = order;
              return (
                <ListRow key={order.id} className="justify-between">
                  <ListItem isImage={true} imagePath={user.profile} className="w-12 h-12 rounded-full" />
                  <ListItem type="text" text={user.fullname} className="w-32" />
                  <ListItem type="text" text={formatDate(order.createdAt, "MMMM DD, YYYY hh:mm a")} className="w-46" />
                  <ListItem type="text" text={`${order.productIds.length} items`} className="w-16" />
                  <ListItem type="text" text={`$${order.amount}`} className="w-16" />
                  <ListItem type="text" text={order.orderStatus} className="w-20" childClasses="text-success" />
                  <ListItem
                    type="action"
                    text="View"
                    index={index.toString()}
                    className="w-24"
                    childClasses="radius-80"
                    onAction={showOrderDetails}
                  />
                </ListRow>
              );
            })}
          </ListContainer>
        </div>
      </div>
      <OrderDetailModal visible={showOrderDetailModal.visible} selectedOrder={showOrderDetailModal.data} onClose={hideOrderDetails} />
    </DashboardLayout>
  );
};

export default withAuth(Index);
