import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParcoursDefinition } from '../parcours-definition.model';
import { ParcoursDefinitionService } from '../service/parcours-definition.service';

@Component({
  templateUrl: './parcours-definition-delete-dialog.component.html',
})
export class ParcoursDefinitionDeleteDialogComponent {
  parcoursDefinition?: IParcoursDefinition;

  constructor(protected parcoursDefinitionService: ParcoursDefinitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parcoursDefinitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
