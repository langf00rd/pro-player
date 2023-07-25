import Hls from "hls.js";
import React, { ChangeEvent, useEffect } from "react";
import { IHTMLVideoElement, PlayerProps } from "./interfaces";
import { SUPPORTED_MIME_TYPES } from "./constants";

const Player = ({ drmSystemConfig, showBitrateSelector, ...props }: PlayerProps) => {
  const videoRef = React.useRef<IHTMLVideoElement>(null);
  const [selectedBitRate, setSelectedBitRate] = React.useState<number>(0);
  const [bitRates, setBitRates] = React.useState<number[]>([]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      console.error("video player element not mounted", video);
      return;
    }

    if (!props.src) {
      console.error("could not find video source", props.src);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ drmSystems: drmSystemConfig });
      video.hls = hls;
      hls.loadSource(props.src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        let bitRates_ = hls.levels.map((level: any) => level.height);
        setBitRates(bitRates_);
        setSelectedBitRate(bitRates_.length - 1);
      });
    } else if (video.canPlayType(SUPPORTED_MIME_TYPES[0])) video.src = props.src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBitRateChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const newBitRate = parseInt(event.target.value);
    const video = videoRef.current;

    setSelectedBitRate(newBitRate);

    if (!video) {
      console.error("video player element not mounted");
      return;
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const hls = video.hls;
      if (hls && hls.levels[newBitRate]) {
        hls.currentLevel = newBitRate;
      }
    }
  };

  return (
    <div id="pro-video-player-wrapper">
      <video ref={videoRef} {...props} id="pro-video-player">
        Your browser does not support the video tag.
      </video>
      {showBitrateSelector && bitRates.length > 0 && (
        <select
          value={selectedBitRate}
          onChange={onBitRateChanged}
          id="pro-bitrate-select"
        >
          {bitRates.map((quality, index) => (
            <option key={index} value={index}>
              {quality}p
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Player;
