import React, { useState, useEffect, useRef } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

export default function Information(props) {
  const { output, finished } = props;
  const [tab, setTab] = useState("transcription");
  const [translation, setTranslation] = useState(null);
  const [toLanguage, setToLanguage] = useState("Select language");
  const [translating, setTranslating] = useState(null);
  const worker = useRef();

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../utils/translate.worker.js", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = async (e) => {
      switch (e.data.status) {
        case "initiate":
          console.log("DOWNLOADING");
          break;
        case "progress":
          console.log("LOADING");
          break;
        case "update":
          setTranslation(e.data.output);
          console.log(e.data.output);
          break;
        case "complete":
          setTranslating(false);
          console.log("DONE");
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  function handleCopy() {
    navigator.clipboard.writeText(textElement);
  }

  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([textElement], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `SpeeChify_${new Date().toString()}.txt`;
    document.body.appendChild(element);
    element.click();
  }

  function generateTranslation() {
    if (translating || toLanguage === "Select language") {
      return;
    }

    setTranslating(true);

    worker.current.postMessage({
      text: output.map((val) => val.text),
      src_lang: "eng_Latn",
      tgt_lang: toLanguage,
    });
  }

  const textElement =
    tab === "transcription"
      ? (() => {
          // split the output string into an array of sentences
          let sentences = output.map((val) => val.text);
          // console.log("sentences", Object.prototype.toString.call(sentences));
          console.log("sentences: ", sentences);
          // join the sentences array with a space separator
          let text = sentences.join(" ");
          // trim any leading or trailing whitespace
          text = text.trim();

          return text;
        })()
      : translation || "No Translation";

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

      <div className="my-8 flex flex-col">
        {tab === "transcription" ? (
          <Transcription {...props} textElement={textElement} />
        ) : (
          <Translation
            {...props}
            toLanguage={toLanguage}
            textElement={textElement}
            translating={translating}
            finished={finished}
            setTranslation={setTranslation}
            setTranslating={setTranslating}
            setToLanguage={setToLanguage}
            generateTranslation={generateTranslation}
          />
        )}
      </div>

      <div className="flex item-center gap-4 mx-auto">
        <button
          onClick={handleCopy}
          title="Copy"
          className="bg-white p-2 px-2 rounded-full aspect-square grid place-items-center text-orange-300 hover:text-orange-600 duration-200"
        >
          <i className="fa-solid fa-copy"></i>
        </button>
        <button
          onClick={handleDownload}
          title="Download"
          className="bg-white p-2 px-2 rounded-full aspect-square grid place-items-center text-orange-300 hover:text-orange-600 duration-200"
        >
          <i className="fa-solid fa-download"></i>
        </button>
      </div>
    </main>
  );
}
