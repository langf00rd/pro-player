import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Hls, { Level } from "hls.js";
import { IHTMLVideoElement, PlayerProps } from "./interfaces";

const Player = ({ drmSystemConfig, ...props }: PlayerProps): JSX.Element => {
  const videoRef = useRef<IHTMLVideoElement>(null);
  const [bitRates, setBitRates] = useState<number[]>([]);
  const [selectedBitRate, setSelectedBitRate] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      console.log("video player not mounted");
      return;
    }

    if (!video.src) {
      console.log("no video source passed", props);
      return;
    }

    console.log("video element ->", video);
    console.log("video src ->", video.src);

    if (Hls.isSupported()) onHLSSupported(video);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onHLSSupported(video: IHTMLVideoElement) {
    const hls = new Hls({ drmSystems: drmSystemConfig });
    video.hls = hls;
    hls.loadSource(video.src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      loadBitRates(hls);
    });
  }

  function loadBitRates(hls: Hls) {
    const bitRateLevels = hls.levels.map((level: Level) => level.height);
    setBitRates(bitRateLevels);
    setSelectedBitRate(hls.levels.length - 1);
  }

  const onBitRateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newBitRate = parseInt(event.target.value);
    const video = videoRef.current;

    if (!video) {
      console.log("video player not mounted");
      return;
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const hls = video.hls;
      if (hls && hls.levels[newBitRate]) {
        hls.currentLevel = newBitRate;
      }
    }

    setSelectedBitRate(newBitRate);
  };

  return (
    <div className="video-player-wrapper">
      <video ref={videoRef} src={props.src} {...props}></video>
      {bitRates && (
        <select
          className="bitrate-select"
          value={selectedBitRate}
          onChange={onBitRateChange}
        >
          {bitRates.map((bitRate: number, index: number) => (
            <option key={index} value={index}>
              {bitRate}p
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Player;
