"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const hls_js_1 = __importDefault(require("hls.js"));
const Player = (_a) => {
    var { drmSystemConfig } = _a, props = __rest(_a, ["drmSystemConfig"]);
    const videoRef = (0, react_2.useRef)(null);
    const [bitRates, setBitRates] = (0, react_2.useState)([]);
    const [selectedBitRate, setSelectedBitRate] = (0, react_2.useState)(0);
    (0, react_2.useEffect)(() => {
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
        if (hls_js_1.default.isSupported())
            onHLSSupported(video);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function onHLSSupported(video) {
        const hls = new hls_js_1.default({ drmSystems: drmSystemConfig });
        video.hls = hls;
        hls.loadSource(video.src);
        hls.attachMedia(video);
        hls.on(hls_js_1.default.Events.MANIFEST_PARSED, () => {
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
    return (react_1.default.createElement("div", { className: "video-player-wrapper" },
        react_1.default.createElement("video", Object.assign({ ref: videoRef }, props)),
        bitRates && (react_1.default.createElement("select", { className: "bitrate-select", value: selectedBitRate, onChange: onBitRateChange }, bitRates.map((bitRate, index) => (react_1.default.createElement("option", { key: index, value: index },
            bitRate,
            "p")))))));
};
exports.default = Player;
//# sourceMappingURL=Player.js.map