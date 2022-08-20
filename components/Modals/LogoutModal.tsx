import { useCallback } from "react";
import Button from "../Button";
import CenterModal from "./CenterModal";
import { SideModalI } from "./SideModal";

interface LogoutModalI extends SideModalI {}

const LogoutModal: React.FC<LogoutModalI> = ({ visible, onClose }) => {
  const onLogout = useCallback(() => {}, []);
  return (
    <CenterModal visible={visible} onClose={onClose}>
      <h2 className="text-center text-xl mb-5">Are you sure you want to logout?</h2>
      <div>
        <Button type="button" variant="primary" className="mb-2" onClick={onLogout}>
          Confirm
        </Button>
        <Button type="button" variant="secondary" className={"bg-lightGray text-lightBlackHex"} onClick={onClose}>
          Canel
        </Button>
      </div>
    </CenterModal>
  );
};

export default LogoutModal;
