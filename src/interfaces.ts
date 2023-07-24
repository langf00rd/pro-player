// import Hls from "hls.js";
import Hls from "hls.js";
import { VideoHTMLAttributes } from "react";

// export interface PlayerProps extends HTMLVideoElement {
//   drmSystemConfig?: object;
//   hls?: Hls;
//   //   crossOrigin: "" | "anonymous" | "use-credentials";
// }

export interface PlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  //   isStaticVideo: boolean;
  //   showLogs?: boolean;
  //   showControls?: boolean;
  drmSystemConfig?: TDrmSystemConfig;
  //   source: string;
  //   videoTitle?: string;
}

type TDrmSystemConfig = {
  [systemId: string]: {
    licenseUrl: string;
    serverCertificateUrl?: string;
  };
};

export interface IHTMLVideoElement extends HTMLVideoElement {
  hls: Hls;
  requestPictureInPicture(): Promise<PictureInPictureWindow>;
}
