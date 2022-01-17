import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IElement } from '../element.model';
import { ElementService } from '../service/element.service';

@Component({
  templateUrl: './element-delete-dialog.component.html',
})
export class ElementDeleteDialogComponent {
  element?: IElement;

  constructor(protected elementService: ElementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.elementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
