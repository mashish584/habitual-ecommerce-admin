import React, { useCallback, useEffect, useRef, useState } from "react";

import SectionHeading from "../../components/SectionHeading";
import { DashboardLayout } from "../../components/Layout";
import { UserDetailModal } from "../../components/Modals";
import { ListContainer, ListRow, ListItem, LoaderRef } from "../../components/List";

import { useUser, useIntersection } from "../../hooks";

const Users = () => {
  const loader = useRef<LoaderRef>(null);
  const { getUsers, users, loading } = useUser();
  const [showUserDetailModal, setShowUserDetailModal] = useState<{ visible: boolean; data: any }>({ visible: false, data: null });
  const { createObserver } = useIntersection();

  const showUserDetail = useCallback(
    (userId: string) => {
      setShowUserDetailModal({
        visible: true,
        data: users.data[userId],
      });
    },
    [users.data],
  );

  const hideUserDetail = useCallback(() => {
    setShowUserDetailModal({
      visible: false,
      data: null,
    });
  }, []);

  useEffect(() => {
    getUsers(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (loader.current) {
      observer = createObserver(loader, () => {
        if (users.nextPage) {
          getUsers(users.nextPage);
        }
      });
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createObserver, users]);

  const usersData = Object.values(users.data);

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading title={`Users(${users.count})`} />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer
            className="relative mw-1024 tableMaxHeight"
            isLoading={loading.type === "users" && loading.isLoading}
            message={Object.values(users.data).length === 0 ? "No users available." : null}
          >
            {/* Table Heading */}
            <ListRow className="bg-white sticky top-0 z-10 left-0 right-0 justify-between">
              <ListItem type="heading" text={"#"} className="w-12 text-center" />
              <ListItem type="heading" text={"Name"} className="w-44" />
              <ListItem type="heading" text={"Email"} className="w-44" />
              <ListItem type="heading" text={"Orders Placed"} className="w-28" />
              <ListItem type="heading" text={"Action"} className="w-40 text-center" />
            </ListRow>

            {/* Table Content */}
            {usersData.map((user, index) => {
              const isLastRow = usersData.length - 1 === index;
              return (
                <ListRow key={user.id} ref={isLastRow ? loader : null} className="justify-between">
                  <ListItem isImage={true} imagePath={user.profile} className="w-12 h-12 rounded-full" />
                  <ListItem type="text" text={user.fullname} className="w-44" />
                  <ListItem type="text" text={user.email} className="w-44" />
                  <ListItem
                    type="text"
                    text={user.ordersCount > 2 ? `${user.ordersCount} orders` : `${user.ordersCount} order`}
                    className="w-28"
                  />
                  <ListItem
                    type="action"
                    text="View Details"
                    className="w-40"
                    index={user.id}
                    childClasses="radius-80"
                    onAction={showUserDetail}
                  />
                </ListRow>
              );
            })}
          </ListContainer>
        </div>
      </div>
      <UserDetailModal visible={showUserDetailModal.visible} selectedUser={showUserDetailModal.data} onClose={hideUserDetail} />
    </DashboardLayout>
  );
};

export default Users;
