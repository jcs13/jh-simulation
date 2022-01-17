import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOffre } from '../offre.model';
import { OffreService } from '../service/offre.service';

@Component({
  templateUrl: './offre-delete-dialog.component.html',
})
export class OffreDeleteDialogComponent {
  offre?: IOffre;

  constructor(protected offreService: OffreService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.offreService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
