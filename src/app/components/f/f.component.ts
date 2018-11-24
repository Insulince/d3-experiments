import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "../base/base.component";
import {Datum} from "../../models/datum/datum.model";
import * as d3 from "d3";
import {data} from "../../util";
import {EComponent} from "../e/e.component";

@Component({
  selector: "app-f",
  templateUrl: "./f.component.html",
  styleUrls: ["./f.component.css"]
})
export class FComponent extends BaseComponent implements OnInit {
  public static readonly snapSize: number = 175;

  public links: Array<any> = [];

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
    const defs = this.svg.append("defs");

    const marker = defs.append("marker")
      .attr("id", "head")
      .attr("orient", "auto")
      .attr("markerWidth", "2")
      .attr("markerHeight", "4")
      .attr("refX", "0.1")
      .attr("refY", "2");

    const path = marker.append("path")
      .attr("d", "M0,0 V4 L2,2 Z")
      .attr("fill", "black");

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

    this.links = this.generateLinkData();
    console.log(this.links);
    this.g.selectAll(".link")
      .data(this.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (datum: any): number => datum.x1)
      .attr("x2", (datum: any): number => datum.x2)
      .attr("y1", (datum: any): number => datum.y1)
      .attr("y2", (datum: any): number => datum.y2)
      .attr("style", "stroke:rgb(0,0,0);stroke-width:3")
      .attr("marker-end", "url(#head)");

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

            this.linksDragged();
          }
        )
        .on(
          "end",
          (): void => {
            d3.select(`#${d3.event.subject.id}`)
              .attr("cx", EComponent.hsnapDatum)
              .attr("cy", EComponent.vsnapDatum);

            this.linksDragged();
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
    const MIN = LINES * FComponent.snapSize / -2;
    const MAX = LINES * FComponent.snapSize / 2;

    for (let i: number = 0; i < LINES; i++) {
      lines.push({
        x1: (i - (LINES / 2)) * FComponent.snapSize,
        x2: (i - (LINES / 2)) * FComponent.snapSize,
        y1: MIN,
        y2: MAX
      });
      lines.push({
        x1: MIN,
        x2: MAX,
        y1: (i - (LINES / 2)) * FComponent.snapSize,
        y2: (i - (LINES / 2)) * FComponent.snapSize
      });
    }

    return lines;
  }

  public generateLinkData(): Array<any> {
    const links: Array<any> = [];

    const MAX_LINKS: number = 10;
    const NUM_LINKS: number = Math.floor(Math.random() * (MAX_LINKS + 1));

    for (let i: number = 0; i < NUM_LINKS; i++) {
      const randomDataSourceIndex = Math.floor(Math.random() * data.length);
      let randomDataTargetIndex = Math.floor(Math.random() * data.length);

      // TODO: Make this not necessary.
      while (randomDataTargetIndex === randomDataSourceIndex) {
        randomDataTargetIndex = Math.floor(Math.random() * data.length);
      }

      let currentLink: any = {};
      const source = data[randomDataSourceIndex];
      const target = data[randomDataTargetIndex];

      currentLink.source = source;
      currentLink.target = target;
      currentLink = this.mapLinkCoords(currentLink);
      links.push(currentLink);
    }

    return links;
  }

  public linksDragged(): void {
    this.links = this.updateLinkData(this.links);
    d3.selectAll(".link")
      .data(this.links)
      .attr("x1", (datum: any): number => datum.x1)
      .attr("x2", (datum: any): number => datum.x2)
      .attr("y1", (datum: any): number => datum.y1)
      .attr("y2", (datum: any): number => datum.y2);
  }

  public updateLinkData(links: Array<any>): Array<any> {
    const NUM_LINKS: number = links.length;

    links.forEach((link, i) => links[i] = this.mapLinkCoords(link));

    for (let i: number = 0; i < NUM_LINKS; i++) {
      links[i] = this.mapLinkCoords(links[i]);
    }

    return links;
  }

  public mapLinkCoords(link: any): any {
    const source = link.source;
    const target = link.target;

    link.x1 = source.x + source.radius;
    link.x2 = target.x + target.radius;
    link.y1 = source.y + source.radius;
    link.y2 = target.y + target.radius;

    link = this.updateForNodeRadii(link);

    return link;
  }

  public updateForNodeRadii(link: any): any {
    const rise = link.y2 - link.y1;
    const run = link.x2 - link.x1;
    const totalHypot = Math.sqrt(Math.pow(rise, 2) + Math.pow(run, 2));

    // TODO: Bad Justin. Don't use hacky fixes just cause your tired.

    {
      const hypot = link.source.radius;
      const hypotProportion = totalHypot / hypot;
      const opposite = rise / hypotProportion;
      const adjacent = run / hypotProportion;
      link.x1 += adjacent;
      link.y1 += opposite;
    }

    {
      const hypot = link.target.radius + 5.75;
      const hypotProportion = totalHypot / hypot;
      const opposite = rise / hypotProportion;
      const adjacent = run / hypotProportion;
      link.x2 -= adjacent;
      link.y2 -= opposite;
    }

    return link;
  }
}
