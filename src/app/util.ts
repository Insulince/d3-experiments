import {Datum} from "./models/datum/datum.model";

export const data: Array<Datum> = [
  new Datum(window.innerWidth, window.innerHeight / 2, "rgba(255, 0, 0, 0.5)", "a"),
  new Datum(window.innerWidth, window.innerHeight / 2, "rgba(0, 0, 255, 0.5)", "b"),
  new Datum(window.innerWidth, window.innerHeight / 2, "rgba(255, 255, 0, 0.5)", "c"),
  new Datum(window.innerWidth, window.innerHeight / 2, "rgba(0, 255, 0, 0.5)", "d"),
  new Datum(window.innerWidth, window.innerHeight / 2, "rgba(255, 128, 0, 0.5)", "e"),
  new Datum(window.innerWidth, window.innerHeight / 2, "rgba(127, 0, 255, 0.2)", "f")
];

export const newData: () => void = () => {
  data.length = 0;
  data.push(new Datum(window.innerWidth, window.innerHeight / 2, "rgba(255, 0, 0, 0.5)", "a"));
  data.push(new Datum(window.innerWidth, window.innerHeight / 2, "rgba(0, 0, 255, 0.5)", "b"));
  data.push(new Datum(window.innerWidth, window.innerHeight / 2, "rgba(255, 255, 0, 0.5)", "c"));
  data.push(new Datum(window.innerWidth, window.innerHeight / 2, "rgba(0, 255, 0, 0.5)", "d"));
  data.push(new Datum(window.innerWidth, window.innerHeight / 2, "rgba(255, 128, 0, 0.5)", "e"));
  data.push(new Datum(window.innerWidth, window.innerHeight / 2, "rgba(127, 0, 255, 0.2)", "f"));
};
