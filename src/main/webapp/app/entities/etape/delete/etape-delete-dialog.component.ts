import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtape } from '../etape.model';
import { EtapeService } from '../service/etape.service';

@Component({
  templateUrl: './etape-delete-dialog.component.html',
})
export class EtapeDeleteDialogComponent {
  etape?: IEtape;

  constructor(protected etapeService: EtapeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etapeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
