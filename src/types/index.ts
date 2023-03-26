export interface IProPlayerProps {
    source: string // url of video
    poster?: string // video poster
    showLogs?: boolean // show logs in console
    isStaticVideo: boolean, // whether or not video source passed is for a static video or HLS/DASH
}

export interface IHTMLVideoElement extends HTMLVideoElement {
    hls: any
}