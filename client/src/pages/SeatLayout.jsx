import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  dummyShowsData,
  assets,
  generateDynamicDateTimeData,
} from "../assets/assets.js";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isotimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/Appcontext.jsx";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];
  const { user, getToken, axios } = useAppContext();
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Please select time first ");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast.error("You can only select 5 seats");
    }
    if (occupiedSeats.includes(seatId)) {
      return toast("This Seat is already booked");
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary cursor-pointer text-white-400 hover:bg-primary/20 ${
                selectedSeats.includes(seatId) && "bg-primary text-white"
              }${
                occupiedSeats.includes(seatId) &&
                "opacity-50 pointer-events-none"
              }`} // Thêm pointer-events-none
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats = async () => {
    if (!selectedTime) return; // Safety check
    try {
      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime.showId}`
      );
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const bookTickets = async () => {
    try {
      if (!user) {
        return toast.error("Please log in to continue");
      }

      if (!selectedTime || selectedSeats.length === 0) {
        return toast.error("Please select showtime and seats");
      }

      // Loading toast đẹp lung linh
      const loadingToast = toast.loading("Redirecting to payment...");

      const { data } = await axios.post(
        "/api/booking/create",
        {
          showId: selectedTime.showId,
          selectedSeats,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      // Tắt loading
      toast.dismiss(loadingToast);

      if (data.success && data.url) {
        // Chuyển ngay sang Stripe – mượt như nước chảy!
        window.location.href = data.url;
        return;
      }

      if (data.success) {
        toast.success("Tickets booked successfully!", {
          icon: "success",
          style: {
            borderRadius: "12px",
            background: "#1a1a1a",
            color: "#fff",
            fontWeight: "600",
            duration: 4000,
          },
        });
        navigate("/my-bookings");
      } else {
        toast.error(data.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Payment gateway error. Please try again later.", {
        icon: "warning",
        duration: 5000,
      });
      console.error("Booking error:", error);
    }
  };
  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  useEffect(() => {
    getShow();
  }, [id, date]);

  const pricePerSeat = 8;
  const availableTimes = show ? show.dateTime[date] : null;

  return show ? (
    <div className=" flex flex-col md:flex-row px-6 md:px-16 lg:px-40 pt-30 md:pt-50 pb-40 md:gap-8">
      {/* Available Timing */}
      <div className=" w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className=" text-lg font-semibold px-6">Availble Timing</p>
        <div className=" mt-5 space-y-1">
          {availableTimes && availableTimes.length > 0 ? (
            availableTimes.map((item) => (
              <div
                key={item.showId}
                onClick={() => {
                  setSelectedTime(item);
                  setSelectedSeats([]); // Reset ghế khi đổi giờ
                }}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.showId === item.showId
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                <ClockIcon className=" w-4 h-4" />
                <p className=" text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <p className="px-6 text-sm text-gray-400">No showtimes available</p>
          )}
        </div>
      </div>
      {/* Seat Layout */}
      <div className=" relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />
        <h1 className=" text-2xl font-semibold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen " />
        <p className=" text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        {/* div Row A,B */}
        <div className=" flex flex-col items-center mt-10 text-xs text-gray-300 ">
          <div className=" grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6 ">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11 ">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* <-- ĐÓNG THẺ DIV CỦA SEAT LAYOUT TẠI ĐÂY */}
      {/* --- THANH CHECKOUT (ĐÃ CHUYỂN RA NGOÀI) --- */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-gray-950 border-t border-primary/20 p-4 md:p-6 z-50 
  transition-transform duration-300 ease-in-out
  ${selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto px-6 md:px-16 lg:px-40">
          {/* Phần tóm tắt (Trái) */}
          <div className="flex items-center gap-6 md:gap-10">
            <div>
              <p className="text-gray-400 text-sm">Seats</p>
              <p className="text-white font-semibold text-lg truncate max-w-[150px] md:max-w-xs">
                {selectedSeats.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Price</p>
              <p className="text-primary font-semibold text-lg">
                ${selectedSeats.length * pricePerSeat}
              </p>
            </div>
          </div>

          {/* Nút bấm (Phải) */}
          <button
            onClick={bookTickets}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
          >
            <span className="max-md:hidden">Process To CheckOut</span>
            <span className="md:hidden">Checkout</span>
            <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* --- HẾT THANH CHECKOUT --- */}
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
