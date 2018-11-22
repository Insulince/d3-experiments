import {Component, OnInit} from "@angular/core";
import * as d3 from "d3";
import {Datum} from "../../models/datum/datum.model";
import {BaseComponent} from "../base/base.component";

@Component({
  selector: "app-b",
  templateUrl: "./b.component.html",
  styleUrls: ["./b.component.css"]
})
export class BComponent extends BaseComponent implements OnInit {
  public constructor() {
    super();
  }

  public ngOnInit(): void {
    super.setup();
    this.experiment();
  }

  public experiment(): void {
    this.g.selectAll("circle").call(
      d3.drag().on(
        "drag",
        (): any => {
          d3.select(`#${d3.event.subject.id}`)
            .attr("cx", (datum: Datum): number => d3.event.x + datum.radius)
            .attr("cy", (datum: Datum): number => d3.event.y + datum.radius);
          d3.event.subject.x = d3.event.x;
          d3.event.subject.y = d3.event.y;
        }
      )
    );
  }
}
