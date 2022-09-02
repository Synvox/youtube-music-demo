import { mdiPause, mdiPlay } from "@mdi/js";
import { StyleSheet } from "infused";
import { useEffect, useRef, useState } from "react";
import { Song } from "~/types";
import { IconButton } from "./Button";
import { Flex } from "./Flex";
import { iconOf } from "./Icons";
import { Stack } from "./Stack";
import { Text } from "./Text";

const PlayIcon = iconOf(mdiPlay);
const PauseIcon = iconOf(mdiPause);

const { styled } = StyleSheet("player");

export function Player({ song }: { song: Song }) {
  const ref = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [{ currentTime, duration }, setTimes] = useState({
    currentTime: 0,
    duration: 0,
  });

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    const playHandler = () => setIsPlaying(true);
    const pauseHandler = () => setIsPlaying(false);

    audio.addEventListener("play", playHandler);
    audio.addEventListener("pause", pauseHandler);

    let interval = setInterval(() => {
      setTimes({ currentTime: audio.currentTime, duration: audio.duration });
    }, 500);

    setIsPlaying(!audio.paused);

    return () => {
      clearInterval(interval);
      audio.removeEventListener("play", playHandler);
      audio.removeEventListener("pause", pauseHandler);
    };
  }, [song.id]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const audio = ref.current!;
    if (!canvas || !audio) return;
    if (!isPlaying) return;

    const ctx = canvas.getContext("2d")!;
    const audioCtx = new window.AudioContext();
    let audioSource = null;

    // cache the analyzer on the dom element because
    // createMediaElementSource can only be called once
    // per <audio> element.
    // @ts-expect-error
    let analyser = audio._analyzer;
    if (!analyser) {
      analyser = audioCtx.createAnalyser();
      audioSource = audioCtx.createMediaElementSource(audio);
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      //@ts-expect-error
      audio._analyzer = analyser;
    }

    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function cloneCanvas(oldCanvas: HTMLCanvasElement) {
      const newCanvas = document.createElement("canvas");
      const ctx = newCanvas.getContext("2d")!;
      newCanvas.width = oldCanvas.width;
      newCanvas.height = oldCanvas.height;
      ctx.drawImage(oldCanvas, 0, 0);
      return newCanvas;
    }

    let baseTh = 0;

    let animFrame = 0;
    function animate() {
      baseTh += 0.0025;
      const newCanvas = cloneCanvas(canvas);
      canvas.width = canvas.offsetWidth;
      ctx.globalCompositeOperation = "hue";
      ctx.drawImage(newCanvas, -2.5, 0);
      analyser.getByteTimeDomainData(dataArray);

      const scale = 0.5;
      const getAmplitude = (x: number) => (x / 255 - 0.5) * 2 * scale;

      ctx.beginPath();
      const [cx, cy] = [canvas.width - canvas.height / 2, canvas.height / 2];
      for (let i = 0; i < bufferLength; i++) {
        const amp = getAmplitude(dataArray[i]) * canvas.height;
        const th = (Math.PI * i) / bufferLength;
        if (i === 0)
          ctx.moveTo(cx + Math.cos(th) * amp, cy + Math.sin(th) * amp);
        else ctx.lineTo(cx + Math.cos(th) * amp, cy + Math.sin(th) * amp);
      }
      for (let i = bufferLength - 1; i >= 0; i--) {
        const amp = getAmplitude(dataArray[i]) * canvas.height;
        const th = (-Math.PI * i) / bufferLength;
        ctx.lineTo(cx + Math.cos(th) * amp, cy + Math.sin(th) * amp);
      }
      ctx.lineWidth = 1;
      ctx.fillStyle = `hsla(${(baseTh / (Math.PI * 2)) * 360}deg, 50%, 50%, 1)`;
      ctx.fill();

      animFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animFrame);
  }, [song.id, isPlaying]);

  return (
    <Footer>
      <Canvas ref={canvasRef} />
      <Audio key={song.id} ref={ref} src={`/api/stream/${song.id}`} autoPlay />
      <Elevated>
        <Flex direction="row" alignItems="center">
          <Stack space="medium">
            <Stack space="small">
              {isPlaying ? (
                <IconButton onClick={() => ref.current?.pause()} size="large">
                  <PauseIcon />
                </IconButton>
              ) : (
                <IconButton onClick={() => ref.current?.play()} size="large">
                  <PlayIcon />
                </IconButton>
              )}
            </Stack>
            <Img src={song.img} />
            <Stack>
              <Flex>
                <Stack space="xsmall">
                  <Text variant="title" nowrap>
                    {song.name}
                  </Text>
                  <Text variant="light" nowrap>
                    {song.artistName}
                  </Text>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </Flex>
      </Elevated>
    </Footer>
  );
}

const Img = styled.img`
  width: 4rem;
  height: 4rem;
`;

const Footer = styled.footer`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5rem;
  background: #22222288;
  border-top: 1px solid #0003;
  box-shadow: 0px 1px 0px #fff3 inset, 0px 0px 3rem #000 inset;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  padding: 1rem;
  z-index: 100;
`;

const Audio = styled.audio`
  display: none;
`;

const Canvas = styled.canvas`
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% + 5rem);
  height: 100%;
  pointer-events: none;
`;

const Elevated = styled.div`
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 1px 1px #000c);
`;
