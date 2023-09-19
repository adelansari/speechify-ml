import React from "react";

export default function Transcription(props) {
  const { segments, textElement } = props;

  // Function to convert seconds to "mm:ss" format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 text-left">
      {/* Display textElement in a card */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <div className="text-gray-800">{textElement}</div>
      </div>

      <div className="w-full flex flex-col my-2 p-4 max-h-[20rem] overflow-y-auto text-left">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="w-full flex flex-row mb-2 bg-white rounded-lg p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
          >
            <div className="mr-5">{`${formatTime(segment.start)}`}</div>
            {segment.text}
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
