import React, { useRef, useCallback, useEffect } from "react";
import { sourceImage, messageImage } from "./data";
import { MutableRefObject } from "react";
import { resolveMessage, drawMessage } from "./functions";

function drawImg(
  ref: MutableRefObject<HTMLCanvasElement | null>,
  imgSrc: string
) {
  if (ref.current) {
    const img = new Image();
    img.src = imgSrc;
    img.addEventListener("load", () => {
      ref.current?.getContext("2d")?.drawImage(img, 0, 0);
    });
  }
}

function App() {
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const messageRef = useRef<HTMLCanvasElement>(null);
  const solverRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    drawImg(sourceRef, sourceImage);
  }, [sourceRef]);
  useEffect(() => {
    drawImg(messageRef, messageImage);
  }, [messageRef]);
  const decode = useCallback(() => {
    console.log("Please wait...");
    const message = resolveMessage(
      // @ts-ignore
      sourceRef.current?.getContext("2d"),
      messageRef.current?.getContext("2d")
    );
    // @ts-ignore
    drawMessage(solverRef.current?.getContext("2d"), message);
    console.log("Done");
  }, [sourceRef, messageRef, solverRef]);
  return (
    <div className="App">
      <h1>
        Decoding image takes time, so please wait after you click on button
      </h1>
      <div>
        <button onClick={decode}>Decode</button>
      </div>
      <div>
        <canvas ref={sourceRef} width="600" height="400" />
        <canvas ref={messageRef} width="600" height="400" />
        <canvas ref={solverRef} width="600" height="400" />
      </div>
    </div>
  );
}

export default App;
