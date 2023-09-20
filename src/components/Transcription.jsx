import React, { useState, useEffect } from "react";

export default function Transcription(props) {
  const { segments, textElement } = props;
  const [displayedSegments, setDisplayedSegments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // convert seconds to "mm:ss" format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const displaySegmentsWithAnimation = () => {
    if (currentIndex < segments.length) {
      setTimeout(() => {
        setDisplayedSegments((prevSegments) => [
          ...prevSegments,
          segments[currentIndex],
        ]);
        setCurrentIndex(currentIndex + 1);
      }, 500); // Adjust the delay as needed
    }
  };

  useEffect(() => {
    const animationInterval = setInterval(() => {
      if (currentIndex < segments.length) {
        setDisplayedSegments((prevSegments) => [
          ...prevSegments,
          segments[currentIndex],
        ]);
        setCurrentIndex(currentIndex + 1);
      }
    }, 500);

    // Clear the interval when all segments are displayed
    if (currentIndex === segments.length) {
      clearInterval(animationInterval);
    }

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(animationInterval);
    };
  }, [currentIndex, segments]);

  return (
    <div className="grid grid-cols-1 gap-4 text-left">
      {/* Display textElement in a card */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <div className="text-gray-800">{textElement}</div>
      </div>

      <div className="w-full flex flex-col my-2 max-h-[20rem] overflow-y-auto text-left">
        {displayedSegments.map((segment, index) => (
          <div
            key={index}
            className="w-full flex flex-row mb-2 bg-white rounded-lg p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
          >
            <div className="mr-5">{`${formatTime(segment.start)}`}</div>
            <div className="text-animation">{segment.text}</div>
          </div>
        ))}
      </div>

      {/* Create a grid/table layout for timestamps and text */}
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg flex flex-col gap-2"
          >
            <div className="p-2 bg-gray-100 font-semibold">
              {`${segment.start}s - ${segment.end}s`}
            </div>
            <div className="p-2 text-gray-800">{segment.text}</div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
