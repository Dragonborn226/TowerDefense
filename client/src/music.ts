/** Looping background music that works around browser autoplay blocking. */
export class Music {
  private readonly audio: HTMLAudioElement;

  /** `onBlocked` fires if the browser refuses to play until the user interacts. */
  constructor(
    url: string,
    private readonly onBlocked: () => void,
    onPlaying: () => void,
  ) {
    this.audio = new Audio(url);
    this.audio.loop = true;
    this.audio.volume = 0.5;
    this.audio.addEventListener("playing", onPlaying);
    this.audio.addEventListener("error", () => console.error(`Could not load music: ${url}`));
  }

  start(): void {
    this.audio.play().catch((error: DOMException) => {
      if (error.name !== "NotAllowedError") return;
      this.onBlocked();
      this.retryOnFirstInteraction();
    });
  }

  private retryOnFirstInteraction(): void {
    const controller = new AbortController();
    const retry = () => {
      controller.abort();
      void this.audio.play();
    };
    window.addEventListener("pointerdown", retry, { signal: controller.signal });
    window.addEventListener("keydown", retry, { signal: controller.signal });
  }
}
