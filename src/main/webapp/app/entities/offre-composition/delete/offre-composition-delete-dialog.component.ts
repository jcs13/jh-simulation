import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOffreComposition } from '../offre-composition.model';
import { OffreCompositionService } from '../service/offre-composition.service';

@Component({
  templateUrl: './offre-composition-delete-dialog.component.html',
})
export class OffreCompositionDeleteDialogComponent {
  offreComposition?: IOffreComposition;

  constructor(protected offreCompositionService: OffreCompositionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.offreCompositionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
