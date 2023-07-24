import React from "react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Hls, { Level } from "hls.js";
// import "./video.css";

interface VideoProps extends HTMLVideoElement {
  drmSystemConfig?: object;
  hls?: Hls;
}

const Video = ({ drmSystemConfig, ...props }: VideoProps): JSX.Element => {
  const videoRef = useRef<VideoProps>(null);
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

    console.log(video);
    console.log(video.src);

    if (Hls.isSupported()) onHLSSupported(video);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onHLSSupported(video: VideoProps) {
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

  console.log(bitRates);
  console.log(selectedBitRate);

  const onBitRateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newBitRate = parseInt(event.target.value);
    const video = videoRef.current;

    if (!video) return;
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
      {/* <video ref={videoRef} {...props}></video> */}
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

export default Video;
