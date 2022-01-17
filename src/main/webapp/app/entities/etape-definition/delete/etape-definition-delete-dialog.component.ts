import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtapeDefinition } from '../etape-definition.model';
import { EtapeDefinitionService } from '../service/etape-definition.service';

@Component({
  templateUrl: './etape-definition-delete-dialog.component.html',
})
export class EtapeDefinitionDeleteDialogComponent {
  etapeDefinition?: IEtapeDefinition;

  constructor(protected etapeDefinitionService: EtapeDefinitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etapeDefinitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
