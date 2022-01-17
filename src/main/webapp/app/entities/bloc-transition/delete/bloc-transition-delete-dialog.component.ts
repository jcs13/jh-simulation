import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlocTransition } from '../bloc-transition.model';
import { BlocTransitionService } from '../service/bloc-transition.service';

@Component({
  templateUrl: './bloc-transition-delete-dialog.component.html',
})
export class BlocTransitionDeleteDialogComponent {
  blocTransition?: IBlocTransition;

  constructor(protected blocTransitionService: BlocTransitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blocTransitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
