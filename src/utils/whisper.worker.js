import { pipeline } from "@xenova/transformers";
import { MessageTypes } from "./presets";

// handling the transcription pipeline for automatic speech recognition
class MyTranscriptionPipeline {
  static task = "automatic-speech-recognition";
  static model = "openai/whisper-tiny"; // remove the '.en'
  static instance = null;

  // get an instance of the pipeline
  static async getInstance(progress_callback = null, language = "en") {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, `${this.model}.${language}`, {
        progress_callback,
      });
    }

    return this.instance;
  }
}

// event listener for messages from the main thread
self.addEventListener("message", async (event) => {
  const { type, audio } = event.data;
  if (type === MessageTypes.INFERENCE_REQUEST) {
    await transcribe(audio);
  }
});

// transcribing audio
async function transcribe(audio, language) {
  sendLoadingMessage("loading");

  let pipeline;

  try {
    pipeline = await MyTranscriptionPipeline.getInstance(
      load_model_callback,
      language
    );
  } catch (err) {
    console.log(err.message);
  }

  sendLoadingMessage("success");

  const stride_length_s = 5;

  const generationTracker = new GenerationTracker(pipeline, stride_length_s);
  await pipeline(audio, {
    top_k: 0,
    do_sample: false,
    chunk_length: 30,
    stride_length_s,
    return_timestamps: true,
    callback_function:
      generationTracker.callbackFunction.bind(generationTracker),
    chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
  });
  generationTracker.sendFinalResult();
}

// callback function for loading model
async function load_model_callback(data) {
  const { status } = data;
  if (status === "progress") {
    const { file, progress, loaded, total } = data;
    sendDownloadingMessage(file, progress, loaded, total);
  }
}

// send loading message to main thread
function sendLoadingMessage(status) {
  self.postMessage({
    type: MessageTypes.LOADING,
    status,
  });
}

// send downloading message to main thread
async function sendDownloadingMessage(file, progress, loaded, total) {
  self.postMessage({
    type: MessageTypes.DOWNLOADING,
    file,
    progress,
    loaded,
    total,
  });
}

// tracking the generation of transcription
class GenerationTracker {
  constructor(pipeline, stride_length_s) {
    this.pipeline = pipeline;
    this.stride_length_s = stride_length_s;
    this.chunks = [];
    this.time_precision =
      pipeline?.processor.feature_extractor.config.chunk_length /
      pipeline.model.config.max_source_positions;
    this.processed_chunks = [];
    this.callbackFunctionCounter = 0;
  }

  sendFinalResult() {
    self.postMessage({ type: MessageTypes.INFERENCE_DONE });
  }

  callbackFunction(beams) {
    this.callbackFunctionCounter += 1;
    if (this.callbackFunctionCounter % 10 !== 0) {
      return;
    }

    const bestBeam = beams[0];
    let text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
      skip_special_tokens: true,
    });

    const result = {
      text,
      start: this.getLastChunkTimestamp(),
      end: undefined,
    };

    createPartialResultMessage(result);
  }

  // callback function for each chunk of audio processed by the model
  chunkCallback(data) {
    this.chunks.push(data);
    const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(
      this.chunks,
      {
        time_precision: this.time_precision,
        return_timestamps: true,
        force_full_sequence: false,
      }
    );

    // method to process a chunk of audio and return its transcription and timestamp
    this.processed_chunks = chunks.map((chunk, index) => {
      return this.processChunk(chunk, index);
    });

    createResultMessage(
      this.processed_chunks,
      false,
      this.getLastChunkTimestamp()
    );
  }

  getLastChunkTimestamp() {
    if (this.processed_chunks.length === 0) {
      return 0;
    }
  }

  processChunk(chunk, index) {
    const { text, timestamp } = chunk;
    const [start, end] = timestamp;

    return {
      index,
      text: `${text.trim()}`,
      start: Math.round(start),
      end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s),
    };
  }
}

function createResultMessage(results, isDone, completedUntilTimestamp) {
  self.postMessage({
    type: MessageTypes.RESULT,
    results,
    isDone,
    completedUntilTimestamp,
  });
}

function createPartialResultMessage(result) {
  self.postMessage({
    type: MessageTypes.RESULT_PARTIAL,
    result,
  });
}
