import {data, newData} from "../../util";
import * as d3 from "d3";
import {Datum} from "../../models/datum/datum.model";
import {Selection} from "d3";

export abstract class BaseComponent {
  public static readonly D3WrapperId: string = "d3-wrapper";
  public static readonly SVGBackgroundColor: string = "#666666";

  public d3Wrapper: Selection<any, any, any, any>;
  public svg: Selection<any, any, any, any>;
  public g: Selection<any, any, any, any>;

  protected constructor() {
    newData();
  }

  public setup(): void {
    // Setup display elements.
    this.d3Wrapper = d3.select(`#${BaseComponent.D3WrapperId}`);

    this.svg = this.d3Wrapper.append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("background-color", BaseComponent.SVGBackgroundColor);

    this.g = this.svg.append("g");

    // Create display contents.
    this.g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("id", (datum: Datum): string | number => datum.id)
      .attr("r", (datum: Datum): number => datum.radius)
      .attr("cx", (datum: Datum): number => datum.x + datum.radius)
      .attr("cy", (datum: Datum): number => datum.y + datum.radius)
      .attr("fill", (datum: Datum): string => datum.color)
      .attr("stroke", "black")
      .attr("stroke-width", "3");
  }

  public abstract experiment(): void;

  public refresh(): void {
    d3.selectAll("svg").remove();
    newData();
    this.setup();
    this.experiment();
  }
}
