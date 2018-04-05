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
  imageurl;
  ngOnInit() {
    this.getJson().subscribe(json => { this.myjson = json; this.processJson(json) }, er => this.error(er), () => this.complete());
  }
  getJson() {
    return this._http.get("../../assets/myjson.json").map(response => response.json()); //map response.json() converts response to JSON object
  }
  processJson(jsondata) {
    this.imageurl = jsondata['imageurl'];
    let addertemp = 0;
    if (jsondata['svg'].length > 0) {
      jsondata['svg'].forEach(svgobj => {
        let percentagesToPlot = svgobj['d'].split(",");
        this.convertPercentsToPixels(percentagesToPlot, (d: string) => {
          svgobj['d'] = d
          this.svgs.push(svgobj);
        });
        addertemp++;
      });
    }
    if (jsondata['fn'] !== undefined) {
      let myeval = eval(jsondata['fn'][0]);
      this.executejsonfn(myeval);
      let checkadder = this.adder;
    }
  }
  convertPercentsToPixels(svgPathAsPercentagesArray, callback) {
    let svgPathString = "";
    const myarray = svgPathAsPercentagesArray;
    let arrayadder = 0;
    const parentwidth = document.getElementById("divimg").clientWidth;
    const parentheight = document.getElementById("divimg").clientHeight;
    setTimeout(() => {
      if (parentheight < 50 || parentwidth < 50) {
        this.convertPercentsToPixels(myarray, callback);
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
            let checkhere = " ";
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
    }, 1)
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

  //create canvas (not used intended for production, decided to use svg for production)
  // <div *ngFor="let canv of canvasarray">
  //     <canvas id="{{canv.id}}" width="{{canv.width}}" height="{{canv.height}}" (click)="clicked()"></canvas>
  // </div>
  // canvasarray = [{ id: "canvas0", width: "300", height: "300", style: "" }, { id: "canvas0", width: "300", height: "300", style: "" }];
  // createCanvas() {
  //   this.canvasarray.forEach(element => {
  //     let mycanvas = <HTMLCanvasElement>document.getElementById(element.id);
  //     if (mycanvas.getContext('2d')) {
  //       // let canvas: HTMLCanvasElement;
  //       let mycanvasobj = { id: "canvas" + this.canvasadder };
  //       let ctx: CanvasRenderingContext2D;
  //       ctx = mycanvas.getContext('2d');
  //       // Stroked triangle
  //       ctx.beginPath();
  //       ctx.moveTo(125, 125);
  //       ctx.lineTo(125, 45);
  //       ctx.lineTo(45, 125);
  //       ctx.closePath();
  //       ctx.stroke();
  //     }
  //     else {
  //       this.createCanvas();
  //     }
  //   });
  // }
  // clicked() {
  //   console.log('clicked , canvasadder: ', this.canvasadder);
  // }
}


// 69  :  54

// 69  :  99
// 80  :  99
// 80  :  62
// 92  :  62
// 93  :  54
// 69  :  54

// {"divpos":{"position":"absolute","top":"400px","left":"350px"}, "divid":"svg2","pathid": "path2", 
// "d":"M121 127, H 34, V 92,  H 59,  V 74,  H 35,  V 46, H 124, Z", "style": {"fill":"lime","stroke":"purple","stroke-width":"1"}}
     // percentages = "M69 54, H 99, V 80, H 62, v 92, H54, Z"
     // percentages unfiltered = "M69 54,H 66 99,V 80 99,H 80 62,V 92 62,H 93 54, Z 69 54"
     // pix locations = "M121 127, H 34, V 92,  H 59,  V 74,  H 35,  V 46, H 124, Z"