/** @class representing data which used to draw a graph */
export class Graph {
  
  /**
   * @type {Date[]}
   */
  dates: Date[];

  /**
    * @type {number}
   */
  hours: number;


  /**
   *Creates an instance of Graph.
   * @param {Date[]} dates
   * @param {number} hours
   */
  constructor(dates: Date[], hours: number) {
    this.dates = dates;
    this.hours = hours;
  }
}
