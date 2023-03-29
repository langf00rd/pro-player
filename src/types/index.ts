export interface IProPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    isStaticVideo: boolean
    showLogs?: boolean
    showControls?: boolean
    drmSystemConfig?: TDrmSystemConfig
    source: string
    videoTitle?: string
}

type TDrmSystemConfig = {
    [systemId: string]: {
        licenseUrl: string;
        serverCertificateUrl?: string;
    };
}

export interface IHTMLVideoElement extends HTMLVideoElement {
    hls: any
    requestPictureInPicture(): Promise<PictureInPictureWindow>
}