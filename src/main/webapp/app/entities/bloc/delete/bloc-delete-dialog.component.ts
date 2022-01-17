import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBloc } from '../bloc.model';
import { BlocService } from '../service/bloc.service';

@Component({
  templateUrl: './bloc-delete-dialog.component.html',
})
export class BlocDeleteDialogComponent {
  bloc?: IBloc;

  constructor(protected blocService: BlocService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blocService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
