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
      src="https://live-par-2-abr.livepush.io/vod/bigbuckbunny/index.m3u8"
    />
  ),
};

// https://live-par-2-abr.livepush.io/vod/bigbuckbunny/index.m3u8
// https://live-par-1-abr-cdn.livepush.io/live_abr_cdn/emaIqCGoZw-6/index.m3u8
