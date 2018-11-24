import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "../base/base.component";
import * as d3 from "d3";
import {Datum} from "../../models/datum/datum.model";

@Component({
  selector: "app-e",
  templateUrl: "./e.component.html",
  styleUrls: ["./e.component.css"]
})
export class EComponent extends BaseComponent implements OnInit {
  public static readonly snapSize: number = 175;

  public static hsnapDatum(datum: Datum): number {
    const x: number = datum.x + datum.radius;

    const hcutoff: number = EComponent.snapSize / 2;
    const hdelta: number = x % EComponent.snapSize;

    let sx: number;
    if (hdelta < hcutoff) {
      sx = Math.floor(x / EComponent.snapSize) * EComponent.snapSize;
    } else {
      sx = Math.ceil(x / EComponent.snapSize) * EComponent.snapSize;
    }

    datum.x = sx - datum.radius;
    return sx;
  }

  public static vsnapDatum(datum: Datum): number {
    const y: number = datum.y + datum.radius;

    const vcutoff: number = EComponent.snapSize / 2;
    const vdelta: number = y % EComponent.snapSize;

    let sy: number;
    if (vdelta < vcutoff) {
      sy = Math.floor(y / EComponent.snapSize) * EComponent.snapSize;
    } else {
      sy = Math.ceil(y / EComponent.snapSize) * EComponent.snapSize;
    }

    datum.y = sy - datum.radius;
    return sy;
  }

  public constructor() {
    super();
  }

  public ngOnInit(): void {
    this.setup();
    this.experiment();
  }

  public setup(): void {
    super.setup();
  }

  public experiment(): void {
    this.g.selectAll("line")
      .data(this.generateGridData())
      .enter()
      .append("line")
      .attr("x1", (datum: any): number => datum.x1)
      .attr("x2", (datum: any): number => datum.x2)
      .attr("y1", (datum: any): number => datum.y1)
      .attr("y2", (datum: any): number => datum.y2)
      .attr("style", "stroke:rgb(200,200,200);stroke-width:1");

    this.svg.call(
      d3.zoom().on(
        "zoom",
        (): any => this.g.attr("transform", d3.event.transform)
      )
    );

    this.g.selectAll("circle")
      .attr("cx", EComponent.hsnapDatum)
      .attr("cy", EComponent.vsnapDatum);

    this.g.selectAll("circle").call(
      d3.drag()
        .on(
          "drag",
          (): void => {
            d3.select(`#${d3.event.subject.id}`)
              .attr("cx", (datum: Datum): number => d3.event.x + datum.radius)
              .attr("cy", (datum: Datum): number => d3.event.y + datum.radius);
            d3.event.subject.x = d3.event.x;
            d3.event.subject.y = d3.event.y;
          }
        )
        .on(
          "end",
          (): void => {
            d3.select(`#${d3.event.subject.id}`)
              .attr("cx", EComponent.hsnapDatum)
              .attr("cy", EComponent.vsnapDatum);
          }
        )
    );
  }

  public refresh() {
    super.refresh();
  }

  public generateGridData(): Array<any> {
    const lines: Array<any> = [];

    const LINES = 50;
    const MIN = LINES * EComponent.snapSize / -2;
    const MAX = LINES * EComponent.snapSize / 2;

    for (let i: number = 0; i < LINES; i++) {
      lines.push({
        x1: (i - (LINES / 2)) * EComponent.snapSize,
        x2: (i - (LINES / 2)) * EComponent.snapSize,
        y1: MIN,
        y2: MAX
      });
      lines.push({
        x1: MIN,
        x2: MAX,
        y1: (i - (LINES / 2)) * EComponent.snapSize,
        y2: (i - (LINES / 2)) * EComponent.snapSize
      });
    }

    return lines;
  }
}
