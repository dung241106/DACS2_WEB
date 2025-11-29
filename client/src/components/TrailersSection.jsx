import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  // Tạo link embed từ URL YouTube
  let embedUrl = "";
  if (currentTrailer) {
    try {
      const videoUrl = new URL(currentTrailer.videoUrl);
      const videoId = videoUrl.searchParams.get("v");
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (error) {
      console.error("Link video trong assets.js bị lỗi:", error);
    }
  }

  if (!embedUrl) return null;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>

      {/* Video */}
      <div className="relative mt-6 mx-auto max-w-[960px] aspect-video">
        <BlurCircle top="-100px" right="-100px" />

        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded Trailer"
          className="rounded-lg"
        ></iframe>
      </div>

      {/* List trailers */}
      <div className="group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            className="relative group-hover:opacity-50 hover:opacity-100 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer"
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt=""
              className="rounded-lg w-full h-full object-cover brightness-75"
            />

            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2 text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
