import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/Appcontext";
import isoTimeFormat from "../../lib/isotimeFormat";
import {
  Ticket,
  User,
  Calendar,
  Armchair,
  DollarSign,
  Inbox,
  Clock,
  Film,
} from "lucide-react";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { axios, getToken, user } = useAppContext();

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/show/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) getAllBookings();
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <Title text1="All" text2="Bookings" className="text-4xl" />
        <div className="flex items-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 rounded-full text-sm font-bold shadow-lg">
          <Ticket size={18} />
          <span>
            Total: {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <table className="w-full text-left">
            {/* Header */}
            <thead>
              <tr className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 text-gray-300 text-xs uppercase tracking-widest border-b border-gray-800">
                <th className="px-6 py-5 font-semibold flex items-center gap-2">
                  <User size={16} className="text-pink-400" /> Customer
                </th>
                <th className="px-6 py-5 font-semibold">
                  <Film size={16} className="inline mr-2 text-purple-400" />
                  Movie
                </th>
                <th className="px-6 py-5 font-semibold">
                  <Calendar size={16} className="inline mr-2 text-blue-400" />
                  Date & Time
                </th>
                <th className="px-6 py-5 font-semibold">
                  <Armchair size={16} className="inline mr-2 text-green-400" />
                  Seats
                </th>
                <th className="px-6 py-5 font-semibold text-right">
                  <DollarSign
                    size={16}
                    className="inline mr-1 text-yellow-400"
                  />
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-6 text-gray-500">
                      <div className="relative">
                        <div className="absolute inset-0 blur-3xl bg-pink-500/20 rounded-full"></div>
                        <div className="relative bg-gray-900/80 p-8 rounded-full border border-gray-800">
                          <Inbox size={80} className="text-gray-700" />
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-400">
                          No bookings yet
                        </p>
                        <p className="text-gray-600 mt-2">
                          When customers book tickets, they will appear here
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/5 transition-all duration-300 group cursor-pointer"
                  >
                    {/* Customer */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {item.user?.name?.[0] || "U"}
                        </div>
                        <span className="font-medium text-white group-hover:text-pink-400 transition-colors">
                          {item.user?.name || "Guest User"}
                        </span>
                      </div>
                    </td>

                    {/* Movie */}
                    <td className="px-6 py-5">
                      <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        {item.show?.movie?.title || "Unknown Movie"}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-gray-300 font-medium">
                          {dateFormat(item.show.showDateTime)}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {isoTimeFormat(item.show.showDateTime)}
                        </p>
                      </div>
                    </td>

                    {/* Seats */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {item.bookedSeats.map((seat, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 text-xs font-bold tracking-wider"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-5 text-right">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                        {currency}
                        {item.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Note */}
      {bookings.length > 0 && (
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>✨ All bookings are processed securely • Real-time updates</p>
        </div>
      )}
    </div>
  );
};

export default ListBookings;
