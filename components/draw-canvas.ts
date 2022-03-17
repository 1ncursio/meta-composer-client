export interface ADrawCanvas {
  //   schema: {};
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  init(): void;
  tick(t: number): void;
}

export default AFRAME.registerComponent<ADrawCanvas>('draw-canvas', {
  canvas: null,
  context: null,
  init() {
    this.canvas = document.getElementById('sheet') as HTMLCanvasElement | null;
    this.context = this.canvas!.getContext('2d');
    // this.canvas!.width = 500;
    // this.canvas!.height = 500;
    // this.x = 200;
    // this.y = 100;
    // this.dx = 5;
    // this.dy = 3;
  },
  tick(t) {
    if (!this.context) return;

    // clear canvas
    // const randomHexColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    // this.context.fillStyle = randomHexColor;
    // this.context.fillRect(0, 0, 500, 500);
    // draw rectangle
    // this.context.fillStyle = '#FF0000';
    // this.context.fillRect(this.x, this.y, 50, 50);
  },
});
