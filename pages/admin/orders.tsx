import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import SectionHeading from "../../components/SectionHeading";
import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListItem, ListRow } from "../../components/List";
import { OrderDetailModal } from "../../components/Modals";
import useOrder from "../../hooks/useOrder";
import useIntersection from "../../hooks/useIntersection";
import { LoaderRef } from "../../components/List/ListRow";

const Orders = () => {
  const loader = useRef<LoaderRef>(null);
  const { getOrders, orders } = useOrder();
  const [showOrderDetailModal, setShowOrderDetailModal] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: null,
  });

  const { createObserver } = useIntersection();

  const showOrderDetails = useCallback(
    (productId: string) => {
      setShowOrderDetailModal({ visible: true, data: orders.data[productId] });
    },
    [orders.data],
  );

  const hideOrderDetails = useCallback(() => {
    setShowOrderDetailModal({ visible: false, data: null });
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (loader.current) {
      observer = createObserver(loader, () => {
        if (orders.nextPage) {
          getOrders();
        }
      });
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [createObserver, getOrders, orders]);

  const orderIds = Object.keys(orders.data);

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading title={`Orders(${orders.count})`} />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
            {orderIds.map((orderId, index) => {
              const isLastRow = orderIds.length - 1 === index;
              const order = orders.data[orderId];

              return (
                <ListRow key={order.id} ref={isLastRow ? loader : null} className="justify-between">
                  <ListItem isImage={true} imagePath={order.user.profile} className="w-12 h-12 rounded-full" />
                  <ListItem type="text" text={order.user.fullname} className="w-32" />
                  <ListItem type="text" text={order.user.email} className="w-32" />
                  <ListItem type="text" text={dayjs(order.createdAt).format("MMMM DD, YYYY hh:mm A")} className="w-42" />
                  <ListItem type="text" text={`${order.productIds.length} items`} className="w-16" />
                  <ListItem type="text" text={`$${order.amount}`} className="w-16" />
                  <ListItem type="text" text={order.orderStatus} className="w-20" childClasses="text-success" />
                  <ListItem
                    type="action"
                    text="View"
                    index={order.id}
                    className="w-40"
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

export default Orders;
