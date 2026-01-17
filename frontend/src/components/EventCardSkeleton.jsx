import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EventCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Image placeholder */}
      <div className="relative aspect-video overflow-hidden">
        <Skeleton height="100%" />
      </div>

      {/* Content section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <Skeleton width="80%" height={24} className="mb-2" />

        {/* Location */}
        <div className="flex items-center mb-2">
          <Skeleton circle width={16} height={16} className="mr-2" />
          <Skeleton width="70%" height={16} />
        </div>

        {/* Date and Time */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <Skeleton circle width={16} height={16} className="mr-2" />
            <Skeleton width={60} height={16} />
          </div>
          <div className="flex items-center">
            <Skeleton circle width={16} height={16} className="mr-2" />
            <Skeleton width={40} height={16} />
          </div>
        </div>

        {/* Artists placeholder (with consistent spacing) */}
        <div className="mb-3 min-h-[1.5rem]">
          <div className="flex items-center">
            <Skeleton circle width={16} height={16} className="mr-2" />
            <Skeleton width="50%" height={16} />
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-center mt-auto pt-3">
          <div className="flex items-center">
            <Skeleton circle width={16} height={16} className="mr-2" />
            <Skeleton width={40} height={16} />
          </div>
          <div className="flex items-center">
            <Skeleton circle width={16} height={16} className="mr-2" />
            <Skeleton width={50} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
