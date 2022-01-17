import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtapeTransition } from '../etape-transition.model';
import { EtapeTransitionService } from '../service/etape-transition.service';

@Component({
  templateUrl: './etape-transition-delete-dialog.component.html',
})
export class EtapeTransitionDeleteDialogComponent {
  etapeTransition?: IEtapeTransition;

  constructor(protected etapeTransitionService: EtapeTransitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etapeTransitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
