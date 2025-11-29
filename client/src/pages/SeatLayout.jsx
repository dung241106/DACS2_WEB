import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateDynamicDateTimeData,
  dummyShowsData,
  assets,
} from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isotimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    const allDynamicDateTimes = generateDynamicDateTimeData();
    if (show) {
      setShow({
        movie: show,
        dateTime: allDynamicDateTimes,
      });
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Please select time first ");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast.error("You can only select 5 seats");
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
              className={`h-8 w-8 rounded border border-primary cursor-pointer text-white-400 hover:bg-primary/20  ${
                selectedSeats.includes(seatId) && "bg-primary text-white"
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );
  useEffect(() => {
    getShow();
  }, [id, date]);
  const pricePerSeat = 8;
  const availableTimes = show ? show.dateTime[date] : null;
  return show ? (
    <div className=" flex flex-col md:flex-row px-6 md:px-16 lg:px-40 pt-30 md:pt-50 pb-40 md:gap-8">
      {/* Available Timing */}

      <div className=" w-60  bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className=" text-lg font-semibold px-6">Availble Timing</p>
        <div className=" mt-5 space-y-1">
          {availableTimes && availableTimes.length > 0 ? (
            availableTimes.map((item) => (
              <div
                key={item.showId}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition  ${
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
            // <-- THÊM PHẦN NÀY VÀO
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
          <div className="grid grid-cols-2 gap-11  ">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>
        {/* <button
          onClick={() => navigate("/my-bookings")}
          className=" flex items-center justify-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Process To CheckOut
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button> */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-gray-950 border-t border-primary/20 p-4 md:p-6 z-50 
  transition-transform duration-300 ease-in-out
  ${selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full"}`}
        >
          {/* Dùng div này để căn giữa nội dung giống layout của bạn */}
          <div className="flex items-center justify-between max-w-6xl mx-auto px-6 md:px-16 lg:px-40">
            {/* Phần tóm tắt (Trái) */}
            <div className="flex items-center gap-6 md:gap-10">
              <div>
                <p className="text-gray-400 text-sm">Seats</p>
                <p className="text-white font-semibold text-lg truncate max-w-[150px] md:max-w-xs">
                  {/* Hiển thị các ghế đã chọn, ví dụ: "A1, B2, C3" */}
                  {selectedSeats.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Price</p>
                <p className="text-primary font-semibold text-lg">
                  {/* Tự động nhân giá tiền */}$
                  {selectedSeats.length * pricePerSeat}
                </p>
              </div>
            </div>

            {/* Nút bấm (Phải) */}
            <button
              onClick={() => {
                // Chúng ta đã kiểm tra selectedSeats.length > 0 ở trên
                navigate("/my-bookings");
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
            >
              <span className="max-md:hidden">Process To CheckOut</span>
              <span className="md:hidden">Checkout</span>{" "}
              {/* Text ngắn hơn cho mobile */}
              <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
