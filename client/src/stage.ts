import { TargetCamera } from "@babylonjs/core/Cameras/targetCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";

/**
 * Draws one full-window image, letterboxed so none of it is cropped.
 * World units are image pixels with the origin at the image centre, so
 * anything added later (towers, enemies) can be positioned from the artwork.
 */
export class Stage {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly camera: TargetCamera;
  private readonly backdrop: Mesh;
  private readonly material: StandardMaterial;
  private width = 1;
  private height = 1;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true, undefined, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.04, 0.05, 0.04, 1);

    this.camera = new TargetCamera("camera", new Vector3(0, 0, -10), this.scene);
    this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    this.camera.setTarget(Vector3.Zero());

    this.material = new StandardMaterial("backdrop", this.scene);
    this.material.disableLighting = true;

    this.backdrop = CreatePlane("backdrop", { size: 1 }, this.scene);
    this.backdrop.material = this.material;
    this.backdrop.isVisible = false;

    window.addEventListener("resize", () => {
      this.engine.resize();
      this.fitCamera();
    });
    this.engine.runRenderLoop(() => this.scene.render());
  }

  /** Resolves once the image has loaded and replaced the previous one. */
  show(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const texture: Texture = new Texture(
        url,
        this.scene,
        false,
        true,
        Texture.TRILINEAR_SAMPLINGMODE,
        () => {
          const { width, height } = texture.getSize();
          this.width = width;
          this.height = height;
          this.backdrop.scaling.set(width, height, 1);
          this.backdrop.isVisible = true;

          this.material.emissiveTexture?.dispose();
          this.material.emissiveTexture = texture;
          this.fitCamera();
          resolve();
        },
        (message) => reject(new Error(`Could not load ${url}: ${message}`)),
      );
    });
  }

  /** Converts window coordinates to pixel coordinates on the current image. */
  toImagePoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / this.width, rect.height / this.height);
    return {
      x: (clientX - rect.left - (rect.width - this.width * scale) / 2) / scale,
      y: (clientY - rect.top - (rect.height - this.height * scale) / 2) / scale,
    };
  }

  private fitCamera(): void {
    const renderWidth = this.engine.getRenderWidth();
    const renderHeight = this.engine.getRenderHeight();
    const scale = Math.min(renderWidth / this.width, renderHeight / this.height);
    const halfWidth = renderWidth / scale / 2;
    const halfHeight = renderHeight / scale / 2;

    this.camera.orthoLeft = -halfWidth;
    this.camera.orthoRight = halfWidth;
    this.camera.orthoTop = halfHeight;
    this.camera.orthoBottom = -halfHeight;
  }
}
