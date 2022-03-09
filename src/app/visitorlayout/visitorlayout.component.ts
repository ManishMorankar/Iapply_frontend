import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-visitorlayout',
  templateUrl: './visitorlayout.component.html',

})
export class VisitorlayoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
