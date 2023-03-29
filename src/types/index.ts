export interface IProPlayerProps {
    source: string // url of video
    poster?: string // video poster
    showLogs?: boolean // show logs in console
    isStaticVideo: boolean // whether or not video source passed is for a static video or HLS/DASH
    theme?: string
    showControls?: boolean
    title?: string
    autoPlay?: boolean
    muted?: boolean
    drmSystemConfig?: TDrmSystemConfig
}

type TDrmSystemConfig = {
    [systemId: string]: {
        licenseUrl: string;
        serverCertificateUrl?: string;
    };
};


export interface IHTMLVideoElement extends HTMLVideoElement {
    hls: any
}