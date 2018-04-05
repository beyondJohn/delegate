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
    if (jsondata['svg'].length > 0) {
      jsondata['svg'].forEach(svgobj => {
        let percentagesToPlot = svgobj['d'].split(",");
        this.svgs.push(svgobj);
      });
    }
    if (jsondata['fn'] !== undefined) {
      let myeval = eval(jsondata['fn'][0]);
      this.executejsonfn(myeval);
      let checkadder = this.adder;
    }
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
  // (click)="bodyclick($event,'divbody')"
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
     // pix locations = "M121 127, H 34, V 92,  H 59,  V 74,  H 35,  V 46, H 124, Z"