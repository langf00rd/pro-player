import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';

const Video = ({ drmSystemConfig, ...props }) => {
    const videoRef = useRef(null);
    const [bitRates, setBitRates] = useState([]);
    const [selectedBitRate, setSelectedBitRate] = useState(0);
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
        if (Hls.isSupported())
            onHLSSupported(video);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function onHLSSupported(video) {
        const hls = new Hls({ drmSystems: drmSystemConfig });
        video.hls = hls;
        hls.loadSource(video.src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            loadBitRates(hls);
        });
    }
    function loadBitRates(hls) {
        const bitRateLevels = hls.levels.map((level) => level.height);
        setBitRates(bitRateLevels);
        setSelectedBitRate(hls.levels.length - 1);
    }
    console.log(bitRates);
    console.log(selectedBitRate);
    const onBitRateChange = (event) => {
        const newBitRate = parseInt(event.target.value);
        const video = videoRef.current;
        if (!video)
            return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const hls = video.hls;
            if (hls && hls.levels[newBitRate]) {
                hls.currentLevel = newBitRate;
            }
        }
        setSelectedBitRate(newBitRate);
    };
    return (React.createElement("div", { className: "video-player-wrapper" }, bitRates && (React.createElement("select", { className: "bitrate-select", value: selectedBitRate, onChange: onBitRateChange }, bitRates.map((bitRate, index) => (React.createElement("option", { key: index, value: index },
        bitRate,
        "p")))))));
};

export { Video };
//# sourceMappingURL=index.js.map
