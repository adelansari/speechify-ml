import React from "react";

export default function FileDisplay(props) {
  const { handleAudioReset, file, audioStream } = props;
  return (
    <main className="flex-1 flex flex-col  p-4 gap-3 sm:gap-4 md:gap-5 justify-center text-center pb-20 w-fit max-w-full mx-auto">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
        Your <span className="text-orange-400 bold">File</span>
      </h1>
      <div className="mx-auto flex flex-col text-left my-4">
        <h3 className="font-semibold">Name</h3>
        <p>{file.name}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          className="text-slate-400 hover:text-red-600 duration-200"
          onClick={handleAudioReset}
        >
          Reset
        </button>
        <button className="specialBtn px-4 py-2 rounded-lg text-orange-400">
          <p>Transcribe</p>
        </button>
      </div>
    </main>
  );
}
