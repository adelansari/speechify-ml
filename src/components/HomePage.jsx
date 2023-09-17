import React, { useState, useEffect, useRef } from "react";

export default function HomePage(props) {
  const { setAudioStream, setFile } = props;

  // handle recording
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [duration, setDuration] = useState(0);

  const mediaRecorder = useRef(null);
  const mimeType = "audio/webm";

  async function startRecording() {
    let tempStream;
    console.log("Start recording");

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      tempStream = streamData;
    } catch (err) {
      console.log(err.message);
      return;
    }
    setRecordingStatus("recording");
    const media = new MediaRecorder(tempStream, { type: mimeType });
    mediaRecorder.current = media;

    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") {
        return;
      }
      if (event.data.size === 0) {
        return;
      }
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  }

  async function stopRecording() {
    setRecordingStatus("inactive");
    console.log("Stop recording");

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioStream(audioBlob);
      setAudioChunks([]);
      setDuration(0);
    };
  }

  useEffect(() => {
    if (recordingStatus === "inactive") {
      return;
    }

    const interval = setInterval(() => {
      setDuration((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <main className="flex-1 flex flex-col  p-4 gap-3 sm:gap-4 md:gap-5 justify-center text-center pb-20">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        Spee<span className="text-orange-400 bold">Chify</span>
      </h1>

      <h3 className="font-medium md:text-lg">
        Record <i className="fa fa-circle-arrow-right text-orange-400"> </i>{" "}
        Transcribe <i className="fa fa-circle-arrow-right text-orange-400"> </i>{" "}
        Translate
      </h3>

      <button
        className="flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-xl"
        onClick={
          recordingStatus === "recording" ? stopRecording : startRecording
        }
      >
        <p className="text-orange-400">
          {recordingStatus === "inactive" ? "Record" : "Stop recording"}
        </p>
        <div className="flex item-center gap-2 ">
          {duration && <p className="text-sm">{duration}s</p>}
          <i
            className={
              "fa-solid duration-200 fa-microphone-lines " +
              (recordingStatus === "recording" ? " text-rose-400" : "")
            }
          ></i>
        </div>
      </button>
      <p>
        Or{" "}
        <label className="text-orange-400 cursor-pointer hover:text-orange-600 duration-200">
          upload{" "}
          <input
            className="hidden"
            type="file"
            accept=".mp3,.wave"
            onChange={(e) => {
              const tempFile = e.target.files[0];
              setFile(tempFile);
            }}
          />
        </label>{" "}
        a mp3 / wave file
      </p>
      <p className="italic text-slate-400">Halo, it is uncle roger</p>
    </main>
  );
}
