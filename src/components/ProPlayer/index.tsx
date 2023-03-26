import Hls from "hls.js"
import React, { ChangeEvent } from "react"
import { SUPPORTED_MIME_TYPES } from "../../constants"
import { IHTMLVideoElement, IProPlayerProps } from "../../types"
import { BiInfoSquare, BiLoader, BiPause, BiPlay } from "react-icons/bi"
import { MdFullscreen, MdOutlineForward10, MdReplay10 } from "react-icons/md"
import styles from "../../styles.module.css"

const ProPlayer: React.FC<IProPlayerProps> = ({ source, showLogs, isStaticVideo, poster }) => {
    const videoRef = React.useRef<IHTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(true)
    const [showControls, setShowControls] = React.useState<boolean>(true)
    const [currentTime, setCurrentTime] = React.useState<string>('00:00')
    const [currentTimeInt, setCurrentTimeInt] = React.useState<number>(0)
    const [durationInt, setDurationInt] = React.useState<number>(0)
    const [duration, setDuration] = React.useState<string>('00:00')
    const [logMessage, setLogMessage] = React.useState<string>('00:00')
    const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false)
    const [selectedQuality, setSelectedQuality] = React.useState<number>(0)
    const [qualities, setQualities] = React.useState<number[]>([])

    React.useEffect(() => {
        onPlayerLoad()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source, isStaticVideo])

    React.useEffect(() => {
        listenForMouseMoveOverVideoElement()
    }, [])

    React.useEffect(() => {
        toggleShowVideoControls()
    }, [showControls])

    function onPlayerLoad() {
        if (!source) {
            setLogMessage('video source not provided')
            return
        } else setLogMessage('')

        const video = videoRef.current

        if (!video) {
            showLogMessage("video element not mounted on DOM", 'ERROR')
            return
        }

        setLoading(true)

        if (isStaticVideo) {
            listenForVideoPlayerEvents()
        } else { // set up player for HLS URL
            if (Hls.isSupported()) {
                const hls = new Hls()

                showLogMessage("hls supported", 'LOG')

                video.hls = hls

                hls.loadSource(source)
                hls.attachMedia(video)
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setQualities(hls.levels.map((level: any) => level.height))
                    setSelectedQuality(hls.levels.length - 1)
                    listenForVideoPlayerEvents()
                })
            } else if (video.canPlayType(SUPPORTED_MIME_TYPES[0])) {
                video.src = source
                listenForVideoPlayerEvents()
            }
        }
    }

    const handleQualityChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newQuality = parseInt(event.target.value)
        const video = videoRef.current

        setSelectedQuality(newQuality)

        if (!video) {
            showLogMessage('video element not mounted on DOM', 'ERROR')
            return
        }

        //*
        // video.addEventListener('loadstart', () => {
        //     setLoading(true)
        // })
        //*
        // video.addEventListener('canplaythrough', () => {
        //     setLoading(false)
        // })

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const hls = video.hls

            if (hls && hls.levels[newQuality]) {
                hls.currentLevel = newQuality
            }
        }

        //*
        // return () => {
        //     video.removeEventListener('loadstart', handleLoadStart);
        //     video.removeEventListener('canplaythrough', handleCanPlayThrough);
        // };
    }

    function listenForVideoPlayerEvents() {
        const video = videoRef.current

        if (!video) {
            showLogMessage("video element not mounted on DOM", 'ERROR')
            return
        }

        showLogMessage('loading metadata...', 'LOG')

        video.addEventListener('loadedmetadata', () => {
            setIsPlaying(video.paused)
            setDuration(formatTime(video.duration))
            setDurationInt(video.duration)
            setLoading(false)
        })

        video.addEventListener("timeupdate", () => {
            setCurrentTime(formatTime(video.currentTime))
            setCurrentTimeInt(video.currentTime)
        })

        video.addEventListener("ended", () => {
            setIsPlaying(false)
        })

        //*
        // video.addEventListener('loadstart', () => {
        //     console.log('Video is loading...');
        //     setLoading(true)
        // });

        //*
        // video.addEventListener('loadeddata', () => {
        //     console.log('Video has finished loading.');
        //     setLoading(false)
        // });
    }

    function showLogMessage(logMessage_: string, logType?: string) {
        if (showLogs === true) {
            if (logType === "ERROR") console.error(logMessage_)
            if (logType === "WARN") console.warn(logMessage_)
            else console.log(logMessage_)
        }
    }

    function listenForMouseMoveOverVideoElement() {
        const videoPlayerElement = document.querySelector('.playerVideo')

        if (!videoPlayerElement) return

        videoPlayerElement.addEventListener('mousemove', () => {
            setShowControls(true)
        })
    }

    function toggleShowVideoControls() {
        const timeoutId = setTimeout(() => {
            setShowControls(false)
        }, 5000)

        return () => { clearTimeout(timeoutId) }
    }

    function formatTime(seconds: number) {
        const hours = Number((Math.floor(seconds / 3600)).toFixed(0))
        const minutes = Number(Math.floor((seconds - hours * 3600) / 60).toFixed(0))
        const remainingSeconds = Number((seconds - hours * 3600 - minutes * 60).toFixed(0))

        return (
            (hours > 0 ? hours + ":" : "") +
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds)
        )
    }

    const handlePlayPause = () => {
        const video = videoRef.current

        if (!video) {
            showLogMessage('video element not mounted on DOM', 'ERROR')
            return
        }

        if (isPlaying) video.pause()
        else video.play()
        setIsPlaying(!isPlaying)
    }

    const handleForwardRewind = (actionType: string) => {
        const video = videoRef.current

        if (!video) {
            showLogMessage("video element not mounted on DOM", 'ERROR')
            return
        }

        if (actionType === "FORWARD") video.currentTime += 10
        if (actionType === "REWIND") video.currentTime -= 10
    }

    const toggleFullScreen = () => {
        const video = videoRef.current

        if (!video) {
            showLogMessage('video element not mounted on DOM', 'ERROR')
            return
        }

        if (isFullScreen) document.exitFullscreen()
        else video.requestFullscreen()
        setIsFullScreen(!isFullScreen)
    }

    const handleProgress = (event: any) => {
        const seekTime = event.target.value
        const video = videoRef.current

        if (!video) {
            showLogMessage('video element not mounted on DOM', 'ERROR')
            return
        }

        video.currentTime = seekTime
        setCurrentTimeInt(seekTime)
        setCurrentTime(formatTime(seekTime))
    }

    const onVideoElementHover = () => {
        setShowControls(true)
    }

    return (
        <div>
            <div className={styles.playerContainer}>
                {logMessage && <div className={styles.playerContainerOverlay}>
                    <div className={styles.playerLogMessageContainerOverlay}>
                        <div><BiInfoSquare size={30} /></div>
                        <p>{logMessage}</p>
                    </div>
                </div>}

                {loading && <div className={styles.playerContainerOverlay}>
                    <div className={styles.playerContainerOverlaySpinner}><BiLoader size={30} /></div>
                </div>}

                <span>
                    <video poster={poster} onMouseEnter={onVideoElementHover} ref={videoRef} autoPlay className={styles.playerVideo} src={source}>
                        Your browser does not support the video tag.
                    </video>

                    {showControls &&
                        <div className={styles.playerControls}>
                            <div className={styles.playerControlsMainWrapper}>
                                <input type="range" min="0" max={durationInt} value={currentTimeInt} onChange={handleProgress} className={styles.playerProgressRange} />

                                <div className={styles.playerControlsWrapper}>
                                    <div className={styles.playerControlIcons}>
                                        <button><MdFullscreen onClick={toggleFullScreen} size={30} /></button>
                                        <span onClick={handlePlayPause}>
                                            {isPlaying
                                                ? <button><BiPause size={33} /></button>
                                                : <button><BiPlay size={33} /></button>}
                                        </span>
                                        <button><MdReplay10 onClick={() => handleForwardRewind("REWIND")} size={30} /></button>
                                        <button><MdOutlineForward10 onClick={() => handleForwardRewind("FORWARD")} size={30} /></button>
                                    </div>

                                    <div className={styles.playerDuration}>
                                        <span>{currentTime}</span>
                                        <span>/</span>
                                        <span>{duration}</span>
                                    </div>

                                    {!isStaticVideo && qualities.length > 0 && (
                                        <select value={selectedQuality} onChange={handleQualityChange} className={styles.playerQualitySelector}>
                                            {qualities.map((quality, index) => (
                                                <option key={index} value={index}>
                                                    {quality}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>
                    }
                </span>
            </div>
        </div>
    )
}

export default ProPlayer
