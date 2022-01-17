import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParcours } from '../parcours.model';
import { ParcoursService } from '../service/parcours.service';

@Component({
  templateUrl: './parcours-delete-dialog.component.html',
})
export class ParcoursDeleteDialogComponent {
  parcours?: IParcours;

  constructor(protected parcoursService: ParcoursService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parcoursService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
