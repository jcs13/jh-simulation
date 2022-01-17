import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISimulation } from '../simulation.model';

@Component({
  selector: 'jhi-simulation-detail',
  templateUrl: './simulation-detail.component.html',
})
export class SimulationDetailComponent implements OnInit {
  simulation: ISimulation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ simulation }) => {
      this.simulation = simulation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
