/**
 * Video Processing Worker
 * Handles frame extraction, decoding (WebCodecs), and composition logic off-main-thread.
 */

let videoDecoder = null;
let offscreenCanvas = null;
let ctx = null;

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT_CANVAS':
      offscreenCanvas = payload.canvas;
      ctx = offscreenCanvas.getContext('2d');
      break;

    case 'PROCESS_FRAME':
      // Off-main-thread frame rendering logic
      if (ctx && payload.frame) {
        ctx.drawImage(payload.frame, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        payload.frame.close(); // Crucial for memory management
      }
      break;

    case 'DECODE_VIDEO':
      // Skeleton for WebCodecs VideoDecoder integration
      // This will handle high-performance stream decoding
      break;
  }
};

