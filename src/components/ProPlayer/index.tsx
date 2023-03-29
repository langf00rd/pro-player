import Hls from 'hls.js'
import React, { ChangeEvent } from 'react'
import { SUPPORTED_MIME_TYPES } from '../../constants'
import { IHTMLVideoElement, IProPlayerProps } from '../../types'
import { BiInfoSquare, BiLoader } from 'react-icons/bi'
import { IoPause, IoPlay } from 'react-icons/io5'
import { MdOutlineForward10, MdReplay10 } from 'react-icons/md'
import { BsFillPipFill } from 'react-icons/bs'
import { RxEnterFullScreen } from 'react-icons/rx'
import { ImVolumeMedium, ImVolumeLow, ImVolumeHigh, ImVolumeMute2 } from 'react-icons/im'
import { formatDuration } from '../../utils/formatDuration.util'
import styles from '../../styles.module.css'

const ProPlayer: React.FC<IProPlayerProps> = ({ drmSystemConfig, videoTitle, source, showControls, isStaticVideo, ...videoProps }) => {
    const videoRef = React.useRef<IHTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(true)
    const [showControls_, setShowControls_] = React.useState<boolean>(true)
    const [showVolumeSlider, setShowVolumeSlider] = React.useState<boolean>(false)
    const [currentTimeInt, setCurrentTimeInt] = React.useState<number>(0)
    const [durationInt, setDurationInt] = React.useState<number>(0)
    const [duration, setDuration] = React.useState<string>('00:00')
    const [remainingduration, setRemainingDuration] = React.useState<string>('00:00')
    const [logMessage, setLogMessage] = React.useState<string>('00:00')
    const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false)
    const [selectedQuality, setSelectedQuality] = React.useState<number>(0)
    const [volumeLevel, setVolumeLevel] = React.useState<number>(0)
    const [qualities, setQualities] = React.useState<number[]>([])

    React.useEffect(() => {
        onPlayerLoad()
    }, [source, isStaticVideo])

    React.useEffect(() => {
        if (showControls) setShowControls_(true)
        else setShowControls_(false)
    }, [showControls])

    React.useEffect(() => {
        setTimeout(() => {
            setShowControls_(false)
        }, 5000);
    }, [showControls_])

    function onPlayerLoad() {
        const video = videoRef.current

        if (!video) return

        if (!source) {
            setLogMessage('Invalid video source')
            return
        } else setLogMessage('')

        setLoading(true)

        if (isStaticVideo) listenForVideoPlayerEvents()
        else {
            // set up player for HLS URL

            if (Hls.isSupported()) {
                const hls = new Hls({ drmSystems: drmSystemConfig })

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

        if (!video) return

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const hls = video.hls

            if (hls && hls.levels[newQuality]) {
                hls.currentLevel = newQuality
            }
        }
    }

    function listenForVideoPlayerEvents() {
        const video = videoRef.current

        if (!video) return

        video.addEventListener('loadedmetadata', () => {
            setTimeout(() => {
                video.muted = videoProps.muted || false
                video.volume = 30 / 100

                if (videoProps.autoPlay === true) {
                    document.body.addEventListener('load', function () {
                        video.play()
                    })
                }

                setIsPlaying(!video.paused)
                setDuration(formatDuration(video.duration))
                setDurationInt(video.duration)
                setLoading(false)
                setVolumeLevel(30)
            }, 1000)
        })

        video.addEventListener('timeupdate', () => {
            setCurrentTimeInt(video.currentTime)
            setRemainingDuration(formatDuration(video.duration - video.currentTime))
        })

        video.addEventListener('ended', () => {
            setIsPlaying(false)
        })

        video.addEventListener('waiting', () => {
            setLoading(true)
        })

        video.addEventListener('canplaythrough', () => {
            setLoading(false)
        })

        // return () => {
        //     video.removeEventListener('timeupdate', timeUpdateEvent);
        //     video.removeEventListener('ended', endedEvent);
        // };
    }

    const showControlsOnHoverOrClick = () => {
        if (showControls === false) return
        setShowControls_(true)
    }

    const handlePlayPause = () => {
        const video = videoRef.current

        if (!video) return

        if (isPlaying) video.pause()
        else video.play()
        setIsPlaying(!isPlaying)
    }

    const handleForwardRewind = (actionType: string) => {
        const video = videoRef.current

        if (!video) return

        if (actionType === 'FORWARD') video.currentTime += 10
        if (actionType === 'REWIND') video.currentTime -= 10
    }

    const toggleFullScreen = () => {
        const video = videoRef.current

        if (!video) return

        if (isFullScreen) document.exitFullscreen()
        else video.requestFullscreen()
        setIsFullScreen(!isFullScreen)
    }

    const handleProgress = (event: any) => {
        const seekTime = event.target.value
        const video = videoRef.current

        if (!video) return

        video.currentTime = seekTime

        setCurrentTimeInt(seekTime)
        setCurrentTimeInt(video.currentTime)
        setRemainingDuration(formatDuration(video.duration - video.currentTime))
    }

    const handleChangeVolume = (event: ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current
        const volumeLevel_ = Number(event.target.value) / 100

        if (!video) return

        setVolumeLevel(volumeLevel_ * 100)
        video.muted = false
        video.volume = volumeLevel_
    }

    const handlePiP = () => {
        const video = videoRef.current
        if (!video) return

        video.requestPictureInPicture()
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
                    <video
                        onClick={showControlsOnHoverOrClick}
                        onMouseMove={showControlsOnHoverOrClick}
                        ref={videoRef}
                        className={styles.playerVideo}
                        src={source}
                        {...videoProps}>
                        Your browser does not support the video tag.
                    </video>
                    {showControls_ &&
                        <div className={styles.playerControls}>
                            <div className={styles.playerControlsMainWrapper}>
                                <div className={styles.playerProgressRangeWrapper}>
                                    <input type='range' min='0' max={durationInt} value={currentTimeInt} onChange={handleProgress} className={styles.playerProgressRange} />
                                    <small>{remainingduration === '00:00' ? duration : remainingduration}</small>
                                </div>
                                <div className={styles.playerControlsWrapper}>
                                    <div className={styles.playerControlCol}>
                                        <div className={styles.playerControlCol}>
                                            <span onClick={handlePlayPause}>
                                                {isPlaying
                                                    ? <button><IoPause size={30} /></button>
                                                    : <button><IoPlay size={30} /></button>}
                                            </span>
                                        </div>
                                        <button><BsFillPipFill onClick={handlePiP} size={25} /></button>
                                        <button><MdReplay10 onClick={() => handleForwardRewind('REWIND')} size={30} /></button>
                                        <button><MdOutlineForward10 onClick={() => handleForwardRewind('FORWARD')} size={30} /></button>
                                        <div className={styles.playerVolumeColWrapper} onMouseLeave={() => setShowVolumeSlider(false)} onMouseEnter={() => setShowVolumeSlider(true)} onClick={() => setShowVolumeSlider(true)} >
                                            {volumeLevel > 0 && volumeLevel < 70 && <button><ImVolumeLow size={26} /></button>}
                                            {volumeLevel >= 70 && volumeLevel < 100 && <button><ImVolumeMedium size={26} /></button>}
                                            {volumeLevel === 0 && <button><ImVolumeMute2 size={26} /></button>}
                                            {volumeLevel === 100 && <button><ImVolumeHigh size={26} /></button>}
                                            {showVolumeSlider && <input type='range' value={volumeLevel} onChange={handleChangeVolume} className={styles.playerVolumeProgressRange} />}
                                        </div>
                                    </div>
                                    <p className={styles.playerTitle}>{videoTitle}</p>
                                    <div className={styles.playerControlCol}>
                                        {!isStaticVideo && qualities.length > 0 && (
                                            <select value={selectedQuality} onChange={handleQualityChange} className={styles.playerQualitySelector}>
                                                {qualities.map((quality, index) => (
                                                    <option key={index} value={index}>
                                                        {quality}p
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        <button><RxEnterFullScreen onClick={toggleFullScreen} size={25} /></button>
                                    </div>
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
