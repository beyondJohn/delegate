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
// If final connection comes from above then adding all points to (left) of border
// If final connection comes from below than add all points to right of border

// Have to track each point for left and right turns to determine direction of calculation 
  
  //https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
}
