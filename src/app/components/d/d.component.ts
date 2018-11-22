import {Component, OnInit} from "@angular/core";
import * as d3 from "d3";
import {Datum} from "../../models/datum/datum.model";
import {BaseComponent} from "../base/base.component";

@Component({
  selector: "app-d",
  templateUrl: "./d.component.html",
  styleUrls: ["./d.component.css"]
})
export class DComponent extends BaseComponent implements OnInit {
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
    this.svg.call(
      d3.zoom().on(
        "zoom",
        (): any => this.g.attr("transform", d3.event.transform)
      )
    );

    this.g.selectAll("circle").call(
      d3.drag().on(
        "drag",
        (): void => {
          d3.select(`#${d3.event.subject.id}`)
            .attr("cx", (datum: Datum): number => d3.event.x + datum.radius)
            .attr("cy", (datum: Datum): number => d3.event.y + datum.radius);
          d3.event.subject.x = d3.event.x;
          d3.event.subject.y = d3.event.y;
        }
      )
    );
  }

  public refresh() {
    super.refresh();
  }
}
