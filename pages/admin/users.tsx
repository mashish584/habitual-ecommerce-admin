import React, { useCallback, useEffect, useRef, useState } from "react";

import SectionHeading from "../../components/SectionHeading";
import { DashboardLayout } from "../../components/Layout";
import { UserDetailModal } from "../../components/Modals";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import useUser from "../../hooks/useUser";
import { LoaderRef } from "../../components/List/ListRow";
import useIntersection from "../../hooks/useIntersection";

const Users = () => {
  const loader = useRef<LoaderRef>(null);
  const { getUsers, users } = useUser();
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

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading title={`Users(${users.count})`} />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
            {Object.values(users.data).map((user, index) => {
              const isLastRow = Object.keys(users.data).length - 1 === index;
              return (
                <ListRow key={user.id} ref={isLastRow ? loader : null} className="justify-between">
                  <ListItem isImage={true} imagePath={user.profile} className="w-12 h-12 rounded-full" />
                  <ListItem type="text" text={user.fullname} className="w-fit" />
                  <ListItem type="text" text={user.email} className="w-fit" />
                  <ListItem
                    type="text"
                    text={user.ordersCount > 2 ? `${user.ordersCount} orders` : `${user.ordersCount} order`}
                    className="w-fit"
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
