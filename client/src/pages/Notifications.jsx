import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/layout";
import api from "../services/api";
import EmptyState from "../components/common/EmptyState";
import SkeletonTable from "../components/loading/SkeletonTable";
import { FaTrash, FaCheckDouble, FaBell, FaShoppingCart, FaCoins, FaListUl, FaBrain } from "react-icons/fa";

const TYPE_ICONS = {
  "BUY": <FaShoppingCart className="text-blue-500 text-base" />,
  "SELL": <FaCoins className="text-green-500 text-base" />,
  "EXPENSE": <FaListUl className="text-red-500 text-base" />,
  "WATCHLIST": <FaBell className="text-amber-500 text-base" />,
  "AI": <FaBrain className="text-violet-500 text-base" />,
  "SYSTEM": <FaBell className="text-slate-500 text-base" />
};

const TYPE_COLORS = {
  "BUY": "bg-blue-50 border-blue-100",
  "SELL": "bg-green-50 border-green-100",
  "EXPENSE": "bg-red-50 border-red-100",
  "WATCHLIST": "bg-amber-50 border-amber-100",
  "AI": "bg-violet-50 border-violet-100",
  "SYSTEM": "bg-slate-50 border-slate-100"
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteNotificationId, setDeleteNotificationId] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      window.dispatchEvent(new Event("notifications_updated"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
      window.dispatchEvent(new Event("notifications_updated"));
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteNotificationId(id);
  };

  const executeDeleteNotification = async () => {
    if (!deleteNotificationId) return;
    try {
      await api.delete(`/notifications/${deleteNotificationId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== deleteNotificationId));
      toast.success("Notification deleted successfully");
      setDeleteNotificationId(null);
      window.dispatchEvent(new Event("notifications_updated"));
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            🔔 Notifications Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Stay updated with buy/sell trades, custom expense alerts, and system updates.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center gap-2 text-xs self-start sm:self-auto"
          >
            <FaCheckDouble /> Mark All Read
          </button>
        )}
      </div>

      <div className="max-w-3xl space-y-4">
        {loading ? (
          <SkeletonTable />
        ) : notifications.length > 0 ? (
          notifications.map((item) => {
            const cardBg = item.isRead ? "bg-white text-slate-650" : "bg-slate-50 border-green-500/10";
            const borderStyle = item.isRead ? "border-slate-100" : "border-green-500/20";
            const iconBg = TYPE_COLORS[item.type] || "bg-slate-50 border-slate-100";

            return (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkRead(item.id)}
                className={`p-4 rounded-2xl border flex items-start gap-4 transition-all duration-150 cursor-pointer ${cardBg} ${borderStyle} hover:shadow-md`}
              >
                <div className={`p-3 rounded-xl border ${iconBg}`}>
                  {TYPE_ICONS[item.type] || <FaBell className="text-slate-500 text-base" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm tracking-tight ${item.isRead ? "font-bold text-slate-700" : "font-extrabold text-slate-800"}`}>
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Unread" />
                    )}
                  </div>
                  <p className={`text-xs ${item.isRead ? "text-slate-500" : "text-slate-700 font-semibold"}`}>
                    {item.message}
                  </p>
                  <span className="block text-[10px] text-slate-400 font-bold">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                <button
                  onClick={(e) => handleDeleteClick(item.id, e)}
                  className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                  title="Delete notification"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            );
          })
        ) : (
          <EmptyState
            icon="🔔"
            title="No Notifications"
            description="You're all caught up. New notifications will appear here."
          />
        )}
      </div>

      <ConfirmModal
        isOpen={deleteNotificationId !== null}
        title="Delete Notification"
        message="Delete this notification?"
        confirmText="Delete"
        confirmButtonColor="bg-red-650 hover:bg-red-700 shadow-red-600/10"
        onConfirm={executeDeleteNotification}
        onCancel={() => setDeleteNotificationId(null)}
        icon="🔔"
      />
    </Layout>
  );
}

export default Notifications;
