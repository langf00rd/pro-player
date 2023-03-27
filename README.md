# Pro Player

> An advanced React video player component that allows you to play HLS (m3u8) files and supports DRM. It provides a customizable video player with lots of features including a quality selector.

[![NPM](https://img.shields.io/npm/v/pro-player.svg)](https://www.npmjs.com/package/pro-player) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Installation

You can install pro-player using npm or yarn.

## NPM

```bash
npm install pro-player
```

## Yarn

```bash
yarn add pro-player
```

# Usage

First, import pro-player and its stylesheet into your project:

```jsx
import React from 'react'
import ProPlayer from 'pro-player'
import 'pro-player/dist/index.css'
```

Then, you can use the ProPlayer component in your app by passing in the source, poster, drmSystemConfig, etc props:

```jsx
const App = () => {
  return (
    <ProPlayer
      source='HLS_URL'
      poster='POSTER_URL'
      drmSystemConfig={{
        'com.apple.fps': {
          licenseUrl: 'LICENSE_URL',
          serverCertificateUrl: 'SERVER_CERTIFICATE_URL'
        },
        'com.widevine.alpha': {
          licenseUrl: 'LICENSE_URL'
        }
      }}
    />
  )
}

export default App
```

# Contributing

Contributions are welcome! If you'd like to contribute to pro-player, please submit a pull request with your changes.

## License

MIT © [langford-dev](https://github.com/langford-dev)
