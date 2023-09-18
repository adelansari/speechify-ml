import React, { useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

export default function Information() {
  const [tab, setTab] = useState("transcription");
  return (
    <main className="flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
        Your <span className="text-orange-400 bold">Transcription</span>
      </h1>

      <div className="grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden item-center">
        <button
          className={
            "px-4 duration-200 py-1 font-medium" +
            (tab === "transcription"
              ? " bg-orange-300 text-white"
              : " text-orange-400 hover:text-orange-600")
          }
          onClick={() => setTab("transcription")}
        >
          Transcription
        </button>
        <button
          className={
            "px-4 duration-200 py-1 font-medium" +
            (tab === "translation"
              ? " bg-orange-300 text-white"
              : " text-orange-400 hover:text-orange-600")
          }
          onClick={() => setTab("translation")}
        >
          Translation
        </button>
      </div>
      {tab === "transcription" ? <Transcription /> : <Translation />}
    </main>
  );
}
