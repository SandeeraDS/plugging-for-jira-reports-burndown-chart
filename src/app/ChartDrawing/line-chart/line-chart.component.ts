import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

/** @class which draw the chart */
export class LineChartComponent implements OnInit {


  /** input graph data from GraphComponent*/
  @Input() dataObject;

  /**
   * @type {string[]} contains x coordinates
   */
  xCoords:string[]=[];

  /**
   * @type {number[]} contains y coordinates
   */
  yCoords:number[]=[];

  constructor() {}

  /**
   *@description fill coordinates from dataobject input
   */
  ngOnInit() {
    for (var i = 0; i < this.dataObject.length; i++) {
      this.xCoords[i] = this.dataObject[i]['label'];
      this.yCoords[i] = this.dataObject[i]['y'];
    }
  }


  /**
   * @type {Array<any>} provide y coordinates to chart drawer
   */
  public lineChartData: Array<any> = [
    {
      data: this.yCoords, label: 'Ideal Line'
    },
    { data: [], label: 'Actual Line' },
  ];


  /**
   * @type {Array<any>} provide x coordinates to chart drawer
   */
  public lineChartLabels: Array<any> = this.xCoords;


  /**
   * @type {*} provide chart's view details
   */
  public lineChartOptions: any = {
    responsive: true,
    legend: {
      display: true,
      position: 'right',
      labels: {
        fontColor: 'black',
        fontSize: 14

      }
    },
    scales: {
      yAxes: [{

        gridLines: {
          display: false,
          color: 'rgb(0, 0, 0)',
          lineWidth: 2,
        },
        scaleLabel: {
          display: true,
          labelString: 'REMAINING TIME ESTIMATE',
          fontSize: 14
        }
      }],
      xAxes: [{

        gridLines: {
          display: false,
          color: 'rgb(0, 0, 0)',
          lineWidth: 2
        },
        scaleLabel: {
          display: true,
          labelString: 'TIME',
          fontSize: 14
        }
      }]
    }
  };


  /**
   * @type {Array<any>} provide chart styles
   */
  public lineChartColors: Array<any> = [
    { // grey-Ideal Line
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(128,128,128,1)',
      //pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red - Actual Line
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(255,0,0,1)',
      //pointBackgroundColor: 'rgba(255,255,255,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];


  /**
   * @type {boolean} provide chart legend
   */
  public lineChartLegend: boolean = true;

  /**
   * @type {string} provide chart type
   */
  public lineChartType: string = 'line';
}
