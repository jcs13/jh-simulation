import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParcoursComposition } from '../parcours-composition.model';
import { ParcoursCompositionService } from '../service/parcours-composition.service';

@Component({
  templateUrl: './parcours-composition-delete-dialog.component.html',
})
export class ParcoursCompositionDeleteDialogComponent {
  parcoursComposition?: IParcoursComposition;

  constructor(protected parcoursCompositionService: ParcoursCompositionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parcoursCompositionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
