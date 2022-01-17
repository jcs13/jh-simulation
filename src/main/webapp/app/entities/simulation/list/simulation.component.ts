import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISimulation } from '../simulation.model';
import { SimulationService } from '../service/simulation.service';
import { SimulationDeleteDialogComponent } from '../delete/simulation-delete-dialog.component';

@Component({
  selector: 'jhi-simulation',
  templateUrl: './simulation.component.html',
})
export class SimulationComponent implements OnInit {
  simulations?: ISimulation[];
  isLoading = false;

  constructor(protected simulationService: SimulationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.simulationService.query().subscribe({
      next: (res: HttpResponse<ISimulation[]>) => {
        this.isLoading = false;
        this.simulations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISimulation): number {
    return item.id!;
  }

  delete(simulation: ISimulation): void {
    const modalRef = this.modalService.open(SimulationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.simulation = simulation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
