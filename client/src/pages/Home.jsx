import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedSection from "../components/FeaturedSection";
import TrailersSection from "../components/TrailersSection";
/* trang chủ chính của website 
render các section(components) chính
đặt trong fragment <> </> giúp gọn và k tạo thẻ thừa

*/
const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
    </>
  );
};

export default Home;
