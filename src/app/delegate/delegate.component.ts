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
  canvasadder = 0;
  breaker;
  ngOnInit() {
    this.getJson().subscribe(json => this.processJson(json), json => this.error(json), () => this.complete());
  }
  myjson;
  getJson() {
    return this._http.get("../../assets/myjson.json").map(response => response.json()); //map response.json() converts response to JSON object
  }
  executejsonfn(fn) {
    this.canvasadder = fn(this.canvasadder);
    this.breaker = "hi";
  }
  processJson(jsondata) {
    this.myjson = jsondata;
    if (this.myjson['fn'] !== undefined) {
      let myeval = eval(this.myjson['fn'][0]);
      this.executejsonfn(myeval);
      let checkadder = this.canvasadder;
    }
  }
  mover(ev) {
    document.getElementById(ev).style.fill = 'blue';
    document.getElementById(ev).style.cursor = 'pointer';
    console.log(ev);
  }
  mout(ev) {
    document.getElementById(ev).style.fill = 'lime';
  }
  canvasarray = [{ id: "canvas0", width: "300", height: "300", style: "" }, { id: "canvas0", width: "300", height: "300", style: "" }];

  createCanvas() {
    this.canvasarray.forEach(element => {
      let mycanvas = <HTMLCanvasElement>document.getElementById(element.id);
      if (mycanvas.getContext('2d')) {
        // let canvas: HTMLCanvasElement;
        let mycanvasobj = { id: "canvas" + this.canvasadder };
        let ctx: CanvasRenderingContext2D;
        ctx = mycanvas.getContext('2d');
        // Stroked triangle
        ctx.beginPath();
        ctx.moveTo(125, 125);
        ctx.lineTo(125, 45);
        ctx.lineTo(45, 125);
        ctx.closePath();
        ctx.stroke();
      }
      else {
        this.createCanvas();
      }
    });
  }
  clicked() {
    console.log('clicked , canvasadder: ', this.canvasadder);
  }
  bodyclick(ev, id) {

    let topclick, leftclick, parentwidth, parentheight, toppercent, leftpercent, scaledwidth, found, top, left;
    topclick = ev.layerY;
    leftclick = ev.layerX;
    console.log(topclick, ' : ', leftclick);
    parentwidth = document.getElementById(id).parentElement.clientWidth;
    parentheight = document.getElementById(id).parentElement.clientHeight;
    leftpercent = parseFloat(((parseInt(leftclick) * 100) / parseInt(parentwidth)).toString()).toFixed(0);
    toppercent = parseFloat(((parseInt(topclick) * 100) / parseInt(parentheight)).toString()).toFixed(0);
  }
  error(json) {
    console.log(json);
  }
  complete() {
    this.createCanvas();
    console.log("fin");
  }
  // If final connection comes from above then adding all points to (left) of border
  // If final connection comes from below than add all points to right of border

  // Have to track each point for left and right turns to determine direction of calculation 

  //https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
}
