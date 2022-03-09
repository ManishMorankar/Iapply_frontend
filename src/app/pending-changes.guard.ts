import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
//import { Subject } from 'rxjs/Subject';
import { BsModalService } from 'ngx-bootstrap';
import {ConfirmationLeaveComponent} from './confirmation-leave/confirmation-leave.component';
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}
@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<unknown> {
  constructor(private modalService: BsModalService) {}
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    if(!component.canDeactivate()){
      const subject = new Subject<boolean>();

      const modal = this.modalService.show(ConfirmationLeaveComponent, {'class': 'modal-dialog-primary'});
      modal.content.subject = subject;

      return subject.asObservable();
    }
    return true;
  }

}
