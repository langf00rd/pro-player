/// <reference types="react" />
import Hls from "hls.js";
interface VideoProps extends HTMLVideoElement {
    drmSystemConfig?: object;
    hls?: Hls;
}
declare const Video: ({ drmSystemConfig, ...props }: VideoProps) => JSX.Element;
export default Video;
