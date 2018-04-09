import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//import 'rxjs/RX';

@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.css']
})
export class DelegateComponent implements OnInit {
  constructor(
    private _http: Http
  ) { }
  adder = 0;
  myjson;
  svgs = [];
  polys = [];
  circs = [];
  imageurl;
  ngOnInit() {
    this.getJson().subscribe(json => { this.myjson = json; this.processJson(json) }, er => this.error(er), () => this.complete());
  }
  getJson() {
    return this._http.get("../../assets/myjson.json").map(response => response.json()); //map response.json() converts response to JSON object
  }
  processJson(jsondata) {
    this.imageurl = jsondata['imageurl'];
    if (jsondata['svg'].length > 0) {
      jsondata['svg'].forEach(svgobj => {
        if (svgobj['type'] === "path") {
          let percentagesToPlot = svgobj['d'].split(",");
          this.convertPathPercentsToPixels(percentagesToPlot, (d: string) => {
            svgobj['d'] = d
            this.svgs.push(svgobj);
          });
        }
        else if (svgobj['type'] === 'poly') {
          let percentagesToPlot = svgobj['points'].split(" ");
          this.convertPolyPercentsToPixels(percentagesToPlot, (points: string) => {
            svgobj['points'] = points
            this.polys.push(svgobj);
          });
        }
        else if (svgobj['type'] === 'circ') {
          let percentagesToPlot = svgobj['points'];
          this.convertCircPercentsToPixels(percentagesToPlot, (points: Array<number>) => {
            svgobj['points'] = points
            this.circs.push(svgobj);
          });
        }
      });
    }
    if (jsondata['fn'] !== undefined) {
      let myeval = eval(jsondata['fn'][0]);
      this.executejsonfn(myeval);
      let checkadder = this.adder;
    }
  }
  convertPathPercentsToPixels(svgPathAsPercentagesArray, callback) {
    let svgPathString = "";
    const myarray = svgPathAsPercentagesArray;
    let arrayadder = 0;
    const parentwidth = document.getElementById("divimg").clientWidth;
    const parentheight = document.getElementById("divimg").clientHeight;
    setTimeout(() => {
      if (parentheight < 50 || parentwidth < 50) {
        this.convertPathPercentsToPixels(myarray, callback);
      }
      else {
        myarray.forEach(element => {
          let myparentheight = parentheight;
          let myparentwidth = parentwidth;
          let directionarray = element.split(" ");
          let y = parseInt(directionarray[1]);
          let x = parseInt(directionarray[2]);
          let xmultiplier = parseFloat((x * .01).toString());
          let ymultiplier = parseFloat((y * .01).toString());
          let ypos = myparentheight * ymultiplier;
          let xpos = myparentwidth * xmultiplier;
          if (arrayadder === 0) {
            //convert M coordinates from percents to top,left
            svgPathString += "M" + Math.round(xpos) + " " + Math.round(ypos);
          }
          else {
            //convert H, V, from percents to top,left 
            //if H take xpos if V take ypos
            if (directionarray[0] === "H") {
              svgPathString += ",H" + Math.round(xpos);
            }
            else if (directionarray[0] === "V") {
              svgPathString += ",V" + Math.round(ypos);
            }
            else if (directionarray[0] === "Z") {
              svgPathString += ",Z";
            }
          }
          arrayadder++;
        });
        callback(svgPathString);
      }
    }, 1);
  }
  convertPolyPercentsToPixels(svgPolyAsPercentagesArray, callback) {
    let polyString = "";
    const myarray = svgPolyAsPercentagesArray;
    const parentwidth = document.getElementById("divimg").clientWidth;
    const parentheight = document.getElementById("divimg").clientHeight;
    setTimeout(() => {
      if (parentheight < 50 || parentwidth < 50) {
        this.convertPolyPercentsToPixels(myarray, callback);
      }
      else {
        myarray.forEach(element => {
          let myparentheight = parentheight;
          let myparentwidth = parentwidth;
          let pointsarray = element.split(",");
          let y = parseInt(pointsarray[0]);
          let x = parseInt(pointsarray[1]);
          let xmultiplier = parseFloat((x * .01).toString());
          let ymultiplier = parseFloat((y * .01).toString());
          let ypos = myparentheight * ymultiplier;
          let xpos = myparentwidth * xmultiplier;
          //convert  coordinates from percents to top,left
          polyString += Math.round(xpos) + "," + Math.round(ypos) + " ";
          let checkhere = " ";
        });
        callback(polyString);
      }
    }, 1);
  }
  convertCircPercentsToPixels(svgCircAsPercentagesArray, callback) {
    let circarray = [];
    const myarray = svgCircAsPercentagesArray;
    const parentwidth = document.getElementById("divimg").clientWidth;
    const parentheight = document.getElementById("divimg").clientHeight;
    setTimeout(() => {
      if (parentheight < 50 || parentwidth < 50) {
        this.convertCircPercentsToPixels(myarray, callback);
      }
      else {
        let myparentheight = parentheight;
        let myparentwidth = parentwidth;
        let y = parseInt(myarray[0]);
        let x = parseInt(myarray[1]);
        let xmultiplier = parseFloat((x * .01).toString());
        let ymultiplier = parseFloat((y * .01).toString());
        let ypos = myparentheight * ymultiplier;
        let xpos = myparentwidth * xmultiplier;
        circarray[0] = Math.round(xpos);
        circarray[1] = Math.round(ypos);
        circarray[2] = myarray[2];
        let checkhere = " ";
        callback(circarray);
      }
    }, 1);
  }
  executejsonfn(fn) {
    this.adder = fn(this.adder);
  }
  error(json) {
    console.log("error: ", json);
  }
  complete() {
    console.log("fin");
  }
  // Page Events
  mover(ev) {
    //document.getElementById(ev).style.fill = 'blue';
    document.getElementById(ev).style.fillOpacity = '0.2';
    //document.getElementById(ev).style.cursor = 'pointer';
  }
  mout(ev) {
    document.getElementById(ev).style.fillOpacity = '0';
    //document.getElementById(ev).style.fill = 'none';
  }
  svgclick(id) {
    console.log("clicked svg with id: ", id);
  }
  // the following is used in browser to collect top & left percent points.
  // use in chrome and set "divSvgContainer" display to 'none', after which clicking on map will report click locations.
  // mimic myjson.json path 'd' attribute marking H or V values on each click 
  areaclick(ev, id) {
    let topclick, leftclick, parentwidth, parentheight, toppercent, leftpercent, scaledwidth, found, top, left;
    topclick = ev.layerY;
    leftclick = ev.layerX;
    parentwidth = document.getElementById(id).clientWidth;
    parentheight = document.getElementById(id).clientHeight;
    leftpercent = parseFloat(((parseInt(leftclick) * 100) / parseInt(parentwidth)).toString()).toFixed(0);
    toppercent = parseFloat(((parseInt(topclick) * 100) / parseInt(parentheight)).toString()).toFixed(0);
    console.log(toppercent, " : ", leftpercent);
  }
}
