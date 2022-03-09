import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirmation-leave',
  templateUrl: './confirmation-leave.component.html',
  styleUrls: ['./confirmation-leave.component.css']
})
export class ConfirmationLeaveComponent implements OnInit {

  subject: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef) { }

  action(value: boolean) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

  ngOnInit(): void {
  }


}
