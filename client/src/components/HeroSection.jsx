import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, Calendar, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
/* Đây là section lớn ở đầu trang Home

Background hình lớn

Logo Marvel

Tiêu đề phim (Guardians of the Galaxy)

Thông tin phim (thể loại, năm, thời lượng)

Mô tả phim

Nút Explore Movies → điều hướng đến /movies

 */
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col  items-start justify-center gap-4 px-6 md:px-16  lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen '>
      <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20 " />
      <h1 className=" text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110 ">
        Guardians <br />
        of the Galaxy
      </h1>
      <div className=" flex items-centre gap-4  text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>
        <div className=" flex  items-centre gap-1 ">
          <CalendarIcon className=" w-4.5 h-4.5" />
          2025
        </div>

        <div className=" flex  items-centre gap-1 ">
          <ClockIcon className=" w-4.5 h-4.5" />
          2h 8m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        As cities hunt and consume one another, two strangers in London hold the
        key to stopping a doomsday weapon capable of ending the survival war—by
        wiping out everyone.
      </p>
      <button
        onClick={() => {
          navigate("/movies");
          scrollTo(0, 0);
        }}
        className=" flex items-centre  gap-1 px-6  py-3 text-sm  bg-primary hover:bg-primary-dull transition  rounded-full font-medium  cursor-pointer "
      >
        Explore Movies
        <ArrowRight className="  w-4 h-4" />
      </button>
    </div>
  );
};

export default HeroSection;
