export enum AltitudeMode {
  CLAMP_TO_GROUND = 'CLAMP_TO_GROUND'
}

export class Map3DElement implements Partial<HTMLElement> {

  mode = '';
  lines: Polyline3DElement[] = [];

  
  append(line: Polyline3DElement) {
    this.lines.push(line)
  }


  setAttribute(qualifiedName: string, value: string): void {
    if (qualifiedName === 'mode') {
      this.mode = value;
    }
  }

  addEventListener(): void {
    console.log('event listener');
  }

}

export class Polyline3DElement {

}