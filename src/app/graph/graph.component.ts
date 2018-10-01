import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServices } from '../GraphFactory.model';
import { Graph } from '../Models/graph.model';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

/** @class which used to get related graph data for the given scenario*/
export class GraphComponent implements OnInit {

  /**
   * @type {number} conatain relavant ideal line scenario
   */
  graphtype: number;
  showGraph:boolean=false;

  /**
   *@type {[]} contain x coordinates and y coordinates
   */
  dataPoints = [{}];

  constructor(private apiServices: ApiServices,private cdRef:ChangeDetectorRef) { }


  /**
   * @description here get project id from the link and trigger getBoardId method
   */
  ngOnInit() {

    setTimeout(() => {
      this.apiServices.getProjectID().subscribe(
        (data: string) => {
          this.getBoardId(data)
        },
        (error: string) => { console.log(error) },
        () => { console.log('completed') }
      );
    }, 5000);  
  }

  /**
   * @description get the board id of the project and triger GetSprintData method
   * @param {string} p_id 
   */
  getBoardId(p_id: string) {
    this.apiServices.getBoardID(p_id).subscribe(
      (data: string) => { this.getSprintData(data); },
      (error: string) => { console.log(error) },
      () => { console.log('completed') }
    );
  }


  /**
   * @description get relavant sprint details and trigger getGraphData method
   * @param {string} boardID
   */
  getSprintData(boardID: string) {
    this.apiServices.getSprintDetails(boardID).subscribe(
      (data: object) => { console.log(data); this.getPlannedTime(data['sId']) },
      (error: string) => { console.log(error) },
      () => { console.log('completed') }
    );
  }

  getPlannedTime(sprintId: string) {
    this.apiServices.getIdealLineStatus(sprintId).subscribe(
      (data: string) => {
        
        if(data == null){
          alert("try ageain")
        }
        else{
          this.getGraphData(sprintId)
        }
      },
      (error: string) => { console.log(error) },
      () => { console.log('completed') }
    );
  }


  /**
   * @description get the all the information which needs to draw ideal line and triger loadSenario method
   * @param {string} sprintId
   */
  getGraphData(sprintId: string) {
    console.log("in graph method " + sprintId);
    this.apiServices.getGraphData(sprintId).subscribe(
      (data: Graph) => { console.log("in subcribe time" + data.hours); this.loadScenario(data); },
      (error: string) => { console.log(error) },
      () => { console.log('completed') }
    );
  }  

  /**
   * @description manipulate x coordinates and y coordinates according to chart's input type
   * @param {number} senario
   */
  loadScenario(graph: Graph) {
    console.log(this.showGraph);
    // let gf:GraphFactory = new GraphFactory();

    // let graph:Graph = gf.getGraphObject(senario);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    console.log("in load Scenario " + graph.dates);
    console.log("in load Scenario " + graph.hours);
    console.log("graph true");
    //get y=mx ==>m
    var average = graph.hours / (graph.dates.length);

    this.dataPoints = []; //this contain data which needs to  draw graph
    for (var i = 0; i <= graph.dates.length; i++) {
      if (i < graph.dates.length) {
        this.dataPoints.push({
          label: monthNames[(graph.dates[i]).getMonth()] + " " + (graph.dates[i]).getDate(),
          y: (average * (graph.dates.length - i))
        });
      } else {
        this.dataPoints.push({
          label: monthNames[(graph.dates[i - 1]).getMonth()] + " " + ((graph.dates[i - 1]).getDate() + 1),
          y: 0
        });
      }
    }
    console.log(this.dataPoints);
    this.showGraph=true;
    this.cdRef.detectChanges();
    console.log(this.showGraph);
    
    //for trigger particular graph
  
  }
}




