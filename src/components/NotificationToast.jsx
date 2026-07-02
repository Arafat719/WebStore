import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faXmark } from "@fortawesome/free-solid-svg-icons";
import userContext from "../context/userContext";
import "../css/NotificationToast.css";

const NotificationToast = () => {
  const { toastNotif, dismissToast, markNotificationRead } = useContext(userContext);

  if (!toastNotif) return null;

  const handleOpen = () => {
    markNotificationRead(toastNotif._id);
    dismissToast();
  };

  return (
    <div className="wmx-toast" role="alert" onClick={handleOpen}>
      <div className="wmx-toast-icon">
        <FontAwesomeIcon icon={faBell} />
      </div>
      <div className="wmx-toast-body">
        <div className="wmx-toast-title">{toastNotif.title}</div>
        <div className="wmx-toast-msg">{toastNotif.message}</div>
      </div>
      <button
        className="wmx-toast-close"
        onClick={(e) => { e.stopPropagation(); dismissToast(); }}
        aria-label="Dismiss notification"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};

export default NotificationToast;
