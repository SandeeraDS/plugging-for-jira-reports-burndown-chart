import { Graph } from "./Models/graph.model";
import { Observable, Observer } from "rxjs";

declare var AP: any;

/**
 * @class which handle the api calls
 */
export class ApiServices {


    /**
     * @type {string} contains the project id
     */
    p_id: string = '';


    /**
     * @description get the project id
     * @returns {string} myObeserble contains project id
     */
    getProjectID() {
        const myObeserble = Observable.create((observer: Observer<string>) => {

            if (AP === undefined)
                this.getProjectID();
            else {

                AP.getLocation(function (location) {

                    //get projectid and project name from the link
                    var url = new URL(location);
                    this.p_key = url.searchParams.get("project.key");
                    this.p_id = url.searchParams.get("project.id");
                    console.log("Project Id in Observable = " + this.p_id);
                    console.log("Project Key Observable = " + this.p_key);
                    localStorage.setItem("projectID", this.p_id);
                    observer.next(this.p_id);
                });

            }
        });
        return myObeserble;
    }

    /**
     * @description get the board id
     * @param {string} p_id
     * @returns {string} myObeserble contains board id
     */
    getBoardID(p_id: string) {
        const myObeserble = Observable.create((observer: Observer<string>) => {

            if (AP === undefined)
                observer.error('error');
            else {

                AP.request('/rest/agile/1.0/board', {
                    contentType: 'application/json',
                    success: function (responseText) {
                        var data = JSON.parse(responseText);
                        var i, boardID;
                        for (i in data.values) {
                            if (p_id == data.values[i].location.projectId) {
                                boardID = data.values[i].id;
                                break;
                            }
                        }
                        localStorage.setItem("boardID", boardID);
                        observer.next(boardID);
                    },
                    error: function (xhr, statusText, errorThrown) {
                        console.log(arguments);
                        observer.error('error');
                    }
                });
            }
        });
        return myObeserble;
    }

    /**
     * @description get the sprint data - name and id
     * @param {string} boardID
     * @returns {string} myObeserble contains activesprintdata{id,name}
     */
    getSprintDetails(boardID: string) {
        const myObeserble = Observable.create((observer: Observer<object>) => {

            if (AP === undefined)
                observer.error('error');
            else {
                AP.request('/rest/agile/1.0/board/' + boardID + '/sprint', {
                    contentType: 'application/json',
                    success: function (responseText) {
                        var boardData = JSON.parse(responseText);

                        var activeSprintData: { sId: string, sName: string }, i;
                        for (i in boardData.values) {
                            if (boardData.values[i].state == 'active') {
                                console.log(boardData.values[i].id);
                                console.log(boardData.values[i].name);

                                activeSprintData = ({
                                    sId: boardData.values[i].id,
                                    sName: boardData.values[i].name
                                })
                                break;
                            }
                        }
                        observer.next(activeSprintData);
                    },
                    error: function (xhr, statusText, errorThrown) {
                        console.log(arguments);
                    }
                });
            }
        });
        return myObeserble;
    }


    /**
     * @description create graph objet which contains graph data
     * @param {string} sprintId
     * @returns {Graph} myObeserble contains graph coordinates (x coordinates and y coordinates)
     */
    getGraphData(sprintId: string) {

        let sprintStartDate: Date;
        let sprintEndDate: Date;
        let sum: number = 0;
        let dates: Date[];
        let graphObj: Graph;
        const myObeserble = Observable.create((observer: Observer<Graph>) => {

            if (AP === undefined)
                observer.error('error');
            else {

                AP.request('/rest/agile/1.0/sprint/' + sprintId, {
                    contentType: 'application/json',
                    success: function (responseText) {
                        var data = JSON.parse(responseText);

                        sprintStartDate = new Date(data.startDate);
                        sprintEndDate = new Date(data.endDate);
                        console.log(sprintEndDate);
                        console.log(sprintStartDate);

                        AP.request('/rest/agile/1.0/board/' + localStorage.getItem("boardID") + '/sprint/' + sprintId + '/issue?fields=timetracking,created,summary&maxResults=100', {
                            contentType: 'application/json',
                            success: function (responseText) {
                                //console.log(responseText);

                                var data = JSON.parse(responseText);
                                var i;

                                for (i in data.issues) {
                                    if (!(data.issues[i].fields.timetracking.originalEstimateSeconds === undefined) &&
                                        (sprintStartDate >= new Date(data.issues[i].fields.created))) {
                                        sum = Number(data.issues[i].fields.timetracking.originalEstimateSeconds) + sum
                                    }
                                }

                                var timeDiff = Math.abs(sprintEndDate.getTime() - sprintStartDate.getTime());
                                var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));

                                var dates: Date[] = new Array(dayDifference);
                                for (var j = 0; j <= dayDifference ; j++) {
                                    var day = new Date(sprintStartDate)
                                    day.setDate(sprintStartDate.getDate() + j)
                                    if (j <= dayDifference) {
                                        dates[j] = day
                                    }
                                }
                                sum=sum/3600;
                                graphObj = new Graph(dates, sum);
                                console.log(graphObj);
                                observer.next(graphObj);
                            },
                            error: function (xhr, statusText, errorThrown) {
                                console.log(arguments);
                            }
                        });
                    },
                    error: function (xhr, statusText, errorThrown) {
                        console.log(arguments);
                        observer.error('error');
                    }
                });
            }
        });
        return myObeserble;
    }


}

