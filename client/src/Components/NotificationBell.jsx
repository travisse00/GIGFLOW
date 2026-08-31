import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  ShoppingBag,
  Star,
  X,
  CircleCheck,
} from "lucide-react";

import api from "../Services/api";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  /*
  ========================================
  FETCH NOTIFICATIONS
  ========================================
  */

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/notifications"
      );

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.error(
        "GET NOTIFICATIONS ERROR:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  FETCH UNREAD COUNT
  ========================================
  */

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get(
        "/notifications/unread-count"
      );

      setUnreadCount(
        response.data.count || 0
      );
    } catch (error) {
      console.error(
        "GET UNREAD COUNT ERROR:",
        error.response?.data || error
      );
    }
  };

  /*
  ========================================
  INITIAL LOAD
  ========================================
  */

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  /*
  ========================================
  SOCKET.IO
  ========================================
  */

  useEffect(() => {
    /*
      Your project already has Socket.IO.
      We listen for the event emitted by
      createNotification.js.
    */

    const socket = window.socket;

    if (!socket) {
      console.warn(
        "Socket.IO instance not found on window.socket"
      );

      return;
    }

    const handleNewNotification = (
      notification
    ) => {
      console.log(
        "NEW NOTIFICATION:",
        notification
      );

      setNotifications(
        (current) => [
          notification,
          ...current,
        ]
      );

      setUnreadCount(
        (current) => current + 1
      );
    };

    socket.on(
      "newNotification",
      handleNewNotification
    );

    return () => {
      socket.off(
        "newNotification",
        handleNewNotification
      );
    };
  }, []);

  /*
  ========================================
  MARK ONE AS READ
  ========================================
  */

  const markAsRead = async (
    notification
  ) => {
    if (notification.read) {
      return;
    }

    try {
      setActionLoading(
        notification._id
      );

      await api.patch(
        `/notifications/${notification._id}/read`
      );

      setNotifications(
        (current) =>
          current.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
      );

      setUnreadCount(
        (current) =>
          Math.max(0, current - 1)
      );
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error.response?.data || error
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  ========================================
  MARK ALL AS READ
  ========================================
  */

  const markAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      setActionLoading("all");

      await api.patch(
        "/notifications/read-all"
      );

      setNotifications(
        (current) =>
          current.map((notification) => ({
            ...notification,
            read: true,
          }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "MARK ALL READ ERROR:",
        error.response?.data || error
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  ========================================
  NOTIFICATION ICON
  ========================================
  */

  const getNotificationIcon = (
    type
  ) => {
    switch (type) {
      case "new_order":
        return (
          <ShoppingBag
            size={16}
          />
        );

      case "order_accepted":
        return (
          <Check
            size={16}
          />
        );

      case "order_declined":
        return (
          <X
            size={16}
          />
        );

      case "order_completed":
        return (
          <CircleCheck
            size={16}
          />
        );

      case "new_review":
        return (
          <Star
            size={16}
          />
        );

      default:
        return (
          <Bell
            size={16}
          />
        );
    }
  };

  /*
  ========================================
  CLOSE DROPDOWN
  ========================================
  */

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        !event.target.closest(
          ".notification-container"
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="notification-container relative">

      {/* BELL */}

      <button
        type="button"
        onClick={() => {
          setOpen(
            (current) => !current
          );

          if (!open) {
            fetchNotifications();
            fetchUnreadCount();
          }
        }}
        title="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">

          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">

            <div>
              <h3 className="font-semibold text-white">
                Notifications
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={
                  actionLoading === "all"
                }
                className="inline-flex items-center gap-1.5 text-xs text-violet-400 transition hover:text-violet-300 disabled:opacity-50"
              >
                {actionLoading ===
                "all" ? (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCheck
                    size={13}
                  />
                )}

                Mark all read
              </button>
            )}

          </div>

          {/* BODY */}

          <div className="max-h-[420px] overflow-y-auto">

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2
                  size={24}
                  className="animate-spin text-violet-500"
                />
              </div>
            ) : notifications.length ===
              0 ? (
              <div className="px-6 py-12 text-center">

                <Bell
                  size={28}
                  className="mx-auto text-gray-700"
                />

                <p className="mt-4 text-sm font-medium text-gray-400">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  You'll see updates here.
                </p>

              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <button
                    key={
                      notification._id
                    }
                    type="button"
                    onClick={() =>
                      markAsRead(
                        notification
                      )
                    }
                    disabled={
                      actionLoading ===
                      notification._id
                    }
                    className={`flex w-full gap-3 border-b border-gray-800 px-5 py-4 text-left transition hover:bg-gray-800/60 ${
                      notification.read
                        ? "bg-gray-900"
                        : "bg-violet-500/[0.04]"
                    }`}
                  >

                    {/* ICON */}

                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        notification.read
                          ? "bg-gray-800 text-gray-500"
                          : "bg-violet-500/10 text-violet-400"
                      }`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <p
                          className={`text-sm leading-5 ${
                            notification.read
                              ? "text-gray-400"
                              : "font-medium text-white"
                          }`}
                        >
                          {notification.message}
                        </p>

                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                        )}

                      </div>

                      <div className="mt-1 flex items-center gap-2">

                        {notification.sender?.name && (
                          <span className="text-xs text-gray-600">
                            {notification.sender.name}
                          </span>
                        )}

                        <span className="text-xs text-gray-600">
                          {formatTime(
                            notification.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                  </button>
                )
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}

/*
========================================
FORMAT TIME
========================================
*/

function formatTime(date) {
  if (!date) {
    return "";
  }

  const created =
    new Date(date);

  const now =
    new Date();

  const difference =
    Math.floor(
      (now - created) / 1000
    );

  if (difference < 60) {
    return "Just now";
  }

  if (difference < 3600) {
    return `${Math.floor(
      difference / 60
    )}m ago`;
  }

  if (difference < 86400) {
    return `${Math.floor(
      difference / 3600
    )}h ago`;
  }

  if (difference < 604800) {
    return `${Math.floor(
      difference / 86400
    )}d ago`;
  }

  return created.toLocaleDateString();
}

export default NotificationBell;