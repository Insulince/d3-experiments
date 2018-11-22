export class Datum {
  public static idIter: number = 0;

  public readonly id: string;

  public radius: number;
  public x: number;
  public y: number;
  public color: string;
  public value: string;

  constructor(width: number, height: number, color: string, name: string) {
    this.id = `circle-${Datum.idIter}`;
    Datum.idIter++;
    this.radius = Math.random() * (width < height ? width / 2 : height / 2);
    this.x = Math.random() * (width - this.radius * 2);
    this.y = Math.random() * (height - this.radius * 2);
    this.color = color;
    this.value = name;
  }

  public mutate(): void {
    this.color = "rgba(255, 255, 255, 1.0)";
  }
}
