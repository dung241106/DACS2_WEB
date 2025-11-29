import React, { useEffect, useState } from "react";
import {
  dummyShowsData,
  generateDynamicDateTimeData,
} from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import isoTimeFormat from "../../lib/isotimeFormat"; // Cần thêm hàm này
const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]); // tạo 1 biến state tên là show, setShow là cập nhật giá trị
  const [loading, setLoading] = useState(true);
  // đã tạo state thì phải fetch data đó
  const getAllShows = async () => {
    try {
      const allDynamicShows = generateDynamicDateTimeData();
      const pricePerSeat = 8; // Giả sử giá $8 (giống SeatLayout)
      const allShowsList = [];
      // Lặp qua mỗi NGÀY (ví dụ: "2025-11-18")
      Object.keys(allDynamicShows).forEach((dateKey) => {
        // Lặp qua mỗi SUẤT CHIẾU trong ngày đó (ví dụ: 09:00, 12:00)
        allDynamicShows[dateKey].forEach((showTime) => {
          // Thêm dữ liệu suất chiếu vào mảng
          allShowsList.push({
            // Tạm thời gán 1 phim ngẫu nhiên (vì data của bạn không map 1-1)
            // Ở đây tôi gán 5 suất cho 5 phim đầu tiên
            movie: dummyShowsData[allShowsList.length % 5] || dummyShowsData[0],
            showDateTime: showTime.time,
            showPrice: pricePerSeat,
            // Giả lập một vài ghế đã đặt
            occupiedSeats: generateRandomSeats(),
          });
        });
      });

      setShows(allShowsList);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm nhỏ để giả lập ghế đã đặt (cho vui)
  const generateRandomSeats = () => {
    const seats = {};
    // SỬA Ở ĐÂY: Đổi * 10 thành * 6 (để random từ 0 đến 5 ghế)
    const num = Math.floor(Math.random() * 6);

    for (let i = 0; i < num; i++) {
      seats[`A${i + 1}`] = `user_${i}`;
    }
    return seats;
  };
  useEffect(() => {
    getAllShows();
  }, []);
  return !loading ? (
    <>
      <Title text1="List " text2="Shows" />
      <div className=" max-w-4xl mt-6 overflow-x-auto">
        <table className=" w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className=" bg-primary/20 text-left text-white">
              <th className=" p-2 font-medium pl-5">Movie Name</th>
              <th className=" p-2 font-medium ">Show Time</th>
              <th className=" p-2 font-medium ">Total Bookings</th>
              <th className=" p-2 font-medium ">Earnings</th>
            </tr>
          </thead>
          <tbody className=" text-sm font-light ">
            {shows.map((show, index) => (
              <tr
                className="border-b border-primary-primary/10 bg-primary/5 even:bg-primary/10 "
                key={index}
              >
                <td className=" p-2 min-w-45 pl-5">{show.movie.title}</td>
                <td className=" p-2 ">{dateFormat(show.showDateTime)}</td>
                <td className=" p-2 ">
                  {Object.keys(show.occupiedSeats).length}
                </td>
                <td className=" p-2 ">
                  {currency}
                  {Object.keys(show.occupiedSeats).length * show.showPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
