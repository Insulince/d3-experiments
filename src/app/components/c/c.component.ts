import {Component, OnInit} from "@angular/core";
import * as d3 from "d3";
import {BaseComponent} from "../base/base.component";

@Component({
  selector: "app-c",
  templateUrl: "./c.component.html",
  styleUrls: ["./c.component.css"]
})
export class CComponent extends BaseComponent implements OnInit {
  public constructor() {
    super();
  }

  public ngOnInit(): void {
    super.setup();
    this.experiment();
  }

  public experiment(): void {
    this.d3Wrapper.call(
      d3.zoom().on(
        "zoom",
        (): any => this.g.attr("transform", d3.event.transform)
      )
    );
  }
}
