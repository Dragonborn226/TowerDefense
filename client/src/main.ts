import { Music } from "./music";
import { Stage } from "./stage";

const TITLE_IMAGE = "/assets/title_screen.png";
const MAP_IMAGE = "/assets/game_map.png";
const MUSIC_TRACK = encodeURI("/assets/Medieval Vol. 2/mp3/Medieval Vol. 2 1.mp3");

/** The START GAME button painted on title_screen.png, in image pixels. */
const START_BUTTON = { left: 575, right: 965, top: 480, bottom: 730 };

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const soundHint = document.querySelector<HTMLElement>("#sound-hint")!;

const stage = new Stage(canvas);
const music = new Music(
  MUSIC_TRACK,
  () => (soundHint.hidden = false),
  () => (soundHint.hidden = true),
);

function isOverStartButton(event: MouseEvent): boolean {
  const { x, y } = stage.toImagePoint(event.clientX, event.clientY);
  return (
    x >= START_BUTTON.left &&
    x <= START_BUTTON.right &&
    y >= START_BUTTON.top &&
    y <= START_BUTTON.bottom
  );
}

function showTitleScreen(): void {
  const listeners = new AbortController();
  const { signal } = listeners;

  const startGame = () => {
    listeners.abort();
    canvas.style.cursor = "";
    stage.show(MAP_IMAGE).catch(console.error);
  };

  canvas.addEventListener(
    "pointermove",
    (event) => (canvas.style.cursor = isOverStartButton(event) ? "pointer" : ""),
    { signal },
  );
  canvas.addEventListener(
    "click",
    (event) => {
      if (isOverStartButton(event)) startGame();
    },
    { signal },
  );
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") startGame();
    },
    { signal },
  );
}

stage.show(TITLE_IMAGE).then(showTitleScreen).catch(console.error);
music.start();
