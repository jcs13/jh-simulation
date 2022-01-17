import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlocDefinition } from '../bloc-definition.model';
import { BlocDefinitionService } from '../service/bloc-definition.service';

@Component({
  templateUrl: './bloc-definition-delete-dialog.component.html',
})
export class BlocDefinitionDeleteDialogComponent {
  blocDefinition?: IBlocDefinition;

  constructor(protected blocDefinitionService: BlocDefinitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blocDefinitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
