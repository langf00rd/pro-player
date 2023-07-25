import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Player from "../src";

const meta: Meta<typeof Player> = {
  component: Player,
};

export default meta;
type Story = StoryObj<typeof Player>;

export const Default: Story = {
  render: ({ ...props }) => (
    <Player
      {...props}
      controls
      src=" https://mtngb.tvanywhereafrica.com:11610/auth-streaming/2,da103fe00ecc256f1c7ac15835a45ffeec194a6e,1690306750,txtgh0550202871,0-bosom_ba_pt_2_hd-hls-NONE,3,3,3,3,3,3,DESKTOP,339695,all,none,txtgh,172.20.1.31/hls/vod/0-bosom_ba_pt_2_hd-hls-NONE/0-bosom_ba_pt_2_hd-hls-NONE_h264_p_120k_256x144/0-bosom_ba_pt_2_hd-hls-NONE_h264_p_120k_256x144.m3u8"
    />
  ),
};

// https://live-par-2-abr.livepush.io/vod/bigbuckbunny/index.m3u8
// https://live-par-1-abr-cdn.livepush.io/live_abr_cdn/emaIqCGoZw-6/index.m3u8
