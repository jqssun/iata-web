declare module 'bwip-js' {
  interface RenderOptions {
    bcid: string;
    text: string;
    scale?: number;
    padding?: number;
    backgroundcolor?: string;
    [key: string]: unknown;
  }
  export function toCanvas(canvas: HTMLCanvasElement, opts: RenderOptions): HTMLCanvasElement;
}
