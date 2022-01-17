import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISimulation } from '../simulation.model';
import { SimulationService } from '../service/simulation.service';

@Component({
  templateUrl: './simulation-delete-dialog.component.html',
})
export class SimulationDeleteDialogComponent {
  simulation?: ISimulation;

  constructor(protected simulationService: SimulationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.simulationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
