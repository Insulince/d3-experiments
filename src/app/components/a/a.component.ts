import {Component, OnDestroy, OnInit} from "@angular/core";
import {interval, Subscription} from "rxjs";
import {data} from "../../util";
import {BaseComponent} from "../base/base.component";
import {Datum} from "../../models/datum/datum.model";

@Component({
  selector: "app-a",
  templateUrl: "./a.component.html",
  styleUrls: ["./a.component.css"]
})
export class AComponent extends BaseComponent implements OnInit, OnDestroy {
  public static readonly FrameRate: number = 500;

  public subscriptions: Array<Subscription> = [];

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

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public experiment(): void {
    this.g.selectAll("circle")
      .on(
        "click",
        (datum: Datum): any => datum.color = "#ffffff"
      );

    this.subscriptions.push(interval(AComponent.FrameRate).subscribe(
      (): void => {
        console.log("Frame");
        this.g.selectAll("circle")
          .data(data)
          .transition()
          .duration(AComponent.FrameRate)
          .attr("fill", (datum: Datum): string => datum.color);
      }
    ));
  }

  public refresh() {
    this.unsubscribe();
    super.refresh();
  }

  public unsubscribe(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }
}
