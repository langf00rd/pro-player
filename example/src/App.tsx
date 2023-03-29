import React from 'react'
import ProPlayer from 'pro-player'
import 'pro-player/dist/index.css'

const App = () => {
  return <ProPlayer
    source='https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
    poster='http://cdn.bongobd.com/upload/content/landscape/hd/O1rJFgE8KTD.jpg'
    isStaticVideo={false}
    showLogs={true}
    videoTitle="Tears of steel"
    showControls={true}
    autoPlay={false}
    muted={true}
    drmSystemConfig={
      {
        'com.apple.fps': {
          licenseUrl: 'https://your-fps-license-server/path',
          serverCertificateUrl: 'https://your-fps-license-server/certificate/path',
        },
        'com.widevine.alpha': {
          licenseUrl: 'https://your-widevine-license-server/path'
        }
      }
    }
  />
}

export default App
