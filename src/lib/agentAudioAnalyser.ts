export type AudioLevelTarget = { current: number };

/**
 * Samples a remote WebRTC audio track without creating a second audible path.
 * LiveKit's attached audio element remains responsible for playback; this
 * graph terminates at a zero-gain node so it only drives avatar mouth motion.
 */
export class AgentAudioAnalyser {
  private readonly levelTarget: AudioLevelTarget;
  private context: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private silentGain: GainNode | null = null;
  private samples: Float32Array<ArrayBuffer> | null = null;
  private frameId: number | null = null;
  private activeTrackId: string | null = null;
  private generation = 0;
  private lastFrameAt = 0;

  constructor(levelTarget: AudioLevelTarget) {
    this.levelTarget = levelTarget;
  }

  /** Call from a user gesture when possible so browsers may resume audio. */
  async prepare() {
    if (!this.context || this.context.state === "closed") {
      this.context = new AudioContext({ latencyHint: "interactive" });
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  async attach(track: MediaStreamTrack) {
    const generation = ++this.generation;
    this.detachGraph();
    this.activeTrackId = track.id;

    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let silentGain: GainNode | null = null;

    try {
      await this.prepare();
      if (generation !== this.generation || !this.context) return;

      source = this.context.createMediaStreamSource(new MediaStream([track]));
      analyser = this.context.createAnalyser();
      silentGain = this.context.createGain();

      analyser.fftSize = 512;
      silentGain.gain.value = 0;
      source.connect(analyser);
      analyser.connect(silentGain);
      silentGain.connect(this.context.destination);

      this.source = source;
      this.analyser = analyser;
      this.silentGain = silentGain;
      this.samples = new Float32Array(analyser.fftSize);
      this.lastFrameAt = performance.now();
      this.frameId = requestAnimationFrame(this.sample);
    } catch (error) {
      source?.disconnect();
      analyser?.disconnect();
      silentGain?.disconnect();
      if (generation === this.generation) this.detachGraph();
      throw error;
    }
  }

  detach(track?: MediaStreamTrack) {
    if (track && track.id !== this.activeTrackId) return;
    this.generation += 1;
    this.detachGraph();
  }

  async dispose() {
    this.detach();
    const context = this.context;
    this.context = null;
    if (context && context.state !== "closed") {
      await context.close().catch(() => undefined);
    }
  }

  private readonly sample = (now: number) => {
    const analyser = this.analyser;
    const samples = this.samples;
    if (!analyser || !samples) return;

    analyser.getFloatTimeDomainData(samples);
    let squareSum = 0;
    for (let index = 0; index < samples.length; index += 1) {
      const sample = samples[index];
      squareSum += sample * sample;
    }

    const rms = Math.sqrt(squareSum / samples.length);
    const normalized = Math.min(1, Math.max(0, (rms - 0.012) / 0.085));
    const target = Math.pow(normalized, 0.65);
    const delta = Math.min(Math.max((now - this.lastFrameAt) / 1000, 0), 0.05);
    const timeConstant = target > this.levelTarget.current ? 0.045 : 0.14;
    const blend = 1 - Math.exp(-delta / timeConstant);

    this.levelTarget.current +=
      (target - this.levelTarget.current) * blend;
    if (this.levelTarget.current < 0.001) this.levelTarget.current = 0;

    this.lastFrameAt = now;
    this.frameId = requestAnimationFrame(this.sample);
  };

  private detachGraph() {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.silentGain?.disconnect();
    this.source = null;
    this.analyser = null;
    this.silentGain = null;
    this.samples = null;
    this.activeTrackId = null;
    this.levelTarget.current = 0;
  }
}
