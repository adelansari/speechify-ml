import React from "react";

export default function Transcription(props) {
  const { segments, textElement } = props;

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Display textElement in a card */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <div className="text-gray-800">{textElement}</div>
      </div>

      {/* Create a grid/table layout for timestamps and text */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}
