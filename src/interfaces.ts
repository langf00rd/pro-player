import Hls from "hls.js";
import { VideoHTMLAttributes } from "react";

export interface PlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  drmSystemConfig?: TDrmSystemConfig;
  showBitrateSelector?: boolean;
}

type TDrmSystemConfig = {
  [systemId: string]: {
    licenseUrl: string;
    serverCertificateUrl?: string;
  };
};

export interface IHTMLVideoElement extends HTMLVideoElement {
  hls: Hls;
}
