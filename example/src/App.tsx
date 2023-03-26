import React from 'react'
import ProPlayer from 'pro-player'
import 'pro-player/dist/index.css'

const App = () => {
  return <ProPlayer
    poster='http://cdn.bongobd.com/upload/content/landscape/hd/O1rJFgE8KTD.jpg'
    isStaticVideo={false}
    showLogs={true}
    source='https://live-par-2-abr.livepush.io/vod/bigbuckbunny/index.m3u8'
  />
}

export default App
