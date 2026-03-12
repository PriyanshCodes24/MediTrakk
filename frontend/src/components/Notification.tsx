import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GrClearOption } from "react-icons/gr";
import api from "../Utils/axios";
import { useAuth } from "../context/AuthContext";
import { BiTransfer } from "react-icons/bi";

type Notification = {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  relatedId?: {
    _id: string;
    doctor?: {
      name: string;
    };
    patient?: {
      name: string;
    };
  };
};

const Notification = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [panelOpened, setPanelOpened] = useState(false);
  const unreadCount = panelOpened
    ? 0
    : notifications.filter((n) => !n.read).length;
  const { user } = useAuth();

  const clearNotiHandler = async () => {
    try {
      if (!window.confirm("Are you sure you want to clear all notifications"))
        return;
      const { data } = await api.delete("/notifications");
      setNotifications([]);
      toast.success(data.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Internal server error");
    }
  };
  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      setPanelOpened(false);
    };
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpenNotification(false);
      }
    };
    if (openNotification) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, [openNotification]);

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [oldDoctorId, setOldDoctorId] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);

  const openTransferModal = async (doctorId: any) => {
    setOldDoctorId(doctorId);
    setTransferModalOpen(true);

    try {
      const { data } = await api.get("/users/doctors");
      setDoctors(data.doctors);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  const handleTransfer = async () => {
    if (!selectedDoctor || !oldDoctorId) return;

    try {
      const response = await api.post("/appointments/transfer", {
        oldDoctorId,
        newDoctorId: selectedDoctor,
      });

      const { transferred, failed } = response.data;

      const { data } = await api.get("/notifications");
      setNotifications(data);

      console.log(response);

      if (transferred.length > 0) {
        toast.success(
          `${transferred.length} appointment(s) transferred successfully`,
        );
      }
      if (failed.length > 0) {
        const failedTimes = failed
          .map((appt: any) => {
            const d = new Date(appt.date);
            return d.toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            });
          })
          .join(", ");

        toast.error(
          `These appointments could not be transferred (slot full): ${failedTimes}`,
        );
      }

      if (failed.length === 0) {
        setTransferModalOpen(false);
      }
      setSelectedDoctor("");
      setOldDoctorId(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to transfer appointments",
      );
    }
  };

  const toggleNotifications = async () => {
    const opening = !openNotification;
    setOpenNotification(opening);

    if (opening) {
      setPanelOpened(true);

      try {
        await api.patch("/notifications/mark-all-read");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div ref={notificationRef} className="relative">
      {/* bell icon */}
      <div
        onClick={toggleNotifications}
        className="px-3 py-2 cursor-pointer select-none relative"
      >
        <svg
          className="w-5 h-5 text-gray-300 hover:text-white opacity-60 hover:opacity-100 transition"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] px-1.5  min-w-[16px] h-4 flex items-center justify-center bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* dropdown */}
      <div
        className={`absolute right-0 top-full mt-4 w-80 z-50 rounded-md shadow-xl border border-white/10 animate-in fade-in zoom-in transform transition-all duration-200 ease-out ${openNotification ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}
      >
        <div className="bg-[#111] rounded-xl shadow-xl border border-white/10">
          {/* header */}
          <div className="flex justify-between items-center  py-4 px-3 border-b border-white/10  ">
            <h2 className="text-sm font-semibold text-white">Notification</h2>
            <GrClearOption
              onClick={clearNotiHandler}
              className="text-gray-300 hover:text-white cursor-pointer"
            />
          </div>
          {/* notification list */}
          <div className="notification-scroll max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-400">
                No notifications
              </div>
            )}
            {notifications.map((noti) => (
              <div
                key={noti._id}
                className={`flex gap-3 py-3 px-3 border-b border-white/5 transition ${
                  noti.read
                    ? "opacity-60 hover:bg-white/5"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {/* unread dot */}
                <div className="w-2 flex justify-center pt-2 mt-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      noti.read ? "opacity-0" : "bg-blue-500"
                    }`}
                  />
                </div>

                {/* avatar */}
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white font-semibold shrink-0">
                  {noti?.relatedId?.doctor?.name?.charAt(0) ??
                    noti?.relatedId?.patient?.name?.charAt(0) ??
                    "S"}
                </div>

                {/* text */}
                <div className="flex-1 leading-snug">
                  <p className="text-sm text-gray-200">
                    <span className="font-semibold">
                      {noti?.relatedId?.doctor?.name ??
                        noti?.relatedId?.patient?.name ??
                        "System"}
                    </span>{" "}
                    <span className="text-gray-400">{noti.message}</span>
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>

                {noti.type === "doctor_removed" && !noti.read && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openTransferModal(noti.relatedId?._id);
                    }}
                    className="text-lg text-blue-400 hover:underline ml-2 cursor-pointer"
                  >
                    <BiTransfer />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/10 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Transfer Appointments
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Select a new doctor to transfer your appointments.
            </p>

            <select
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4"
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doc) => doc._id !== oldDoctorId)
                .map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTransferModalOpen(false)}
                className="px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="px-3 py-1 text-sm bg-blue-700 rounded hover:bg-blue-600 cursor-pointer"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
