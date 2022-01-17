import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessUnit } from '../business-unit.model';
import { BusinessUnitService } from '../service/business-unit.service';

@Component({
  templateUrl: './business-unit-delete-dialog.component.html',
})
export class BusinessUnitDeleteDialogComponent {
  businessUnit?: IBusinessUnit;

  constructor(protected businessUnitService: BusinessUnitService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.businessUnitService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
