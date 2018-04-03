import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.css']
})
export class DelegateComponent implements OnInit {

  constructor(
    private _http: Http
  ) { }

  ngOnInit() {
    this._http.get("../../assets/myjson.json").subscribe((data) => {
      this.myjson = JSON.parse(data["_body"]);
      let myeval = eval(this.myjson['fn'][0]);
      this.processjson(myeval);
      this.createCanvas();
    });

  }
  myjson;
  processjson(fn){
    fn();
  }
  mover(ev){
    document.getElementById(ev).style.fill = 'blue';
    document.getElementById(ev).style.cursor = 'pointer';
    console.log(ev);
  }
  mout(ev){
    document.getElementById(ev).style.fill = 'lime';
  }
  canvasarray = [{id: "canvas0", width: "300", height: "300", style:""}];
  canvasadder = 0;
  createCanvas(){
    this.canvasarray.forEach(element => {
      let mycanvas = <HTMLCanvasElement>document.getElementById(element.id);
      if(mycanvas.getContext('2d')){
        // let canvas: HTMLCanvasElement;
        // let mycanvasobj = {id: "canvas" + this.canvasadder};
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
      else{
        this.createCanvas();
      }
    });
    

     //this.canvasadder++;
  }
// If final connection comes from above then adding all points to (left) of border
// If final connection comes from below than add all points to right of border

// Have to track each point for left and right turns to determine direction of calculation 
  
  //https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
}
