import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISimulation, Simulation } from '../simulation.model';
import { SimulationService } from '../service/simulation.service';
import { IParcours } from 'app/entities/parcours/parcours.model';
import { ParcoursService } from 'app/entities/parcours/service/parcours.service';

@Component({
  selector: 'jhi-simulation-update',
  templateUrl: './simulation-update.component.html',
})
export class SimulationUpdateComponent implements OnInit {
  isSaving = false;

  parcoursCollection: IParcours[] = [];
  parentsCollection: ISimulation[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    affaire: [],
    client: [],
    parc: [],
    adresseInstallation: [],
    status: [],
    created: [null, [Validators.required]],
    modifier: [],
    parcours: [],
    parent: [],
  });

  constructor(
    protected simulationService: SimulationService,
    protected parcoursService: ParcoursService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ simulation }) => {
      this.updateForm(simulation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const simulation = this.createFromForm();
    if (simulation.id !== undefined) {
      this.subscribeToSaveResponse(this.simulationService.update(simulation));
    } else {
      this.subscribeToSaveResponse(this.simulationService.create(simulation));
    }
  }

  trackParcoursById(index: number, item: IParcours): number {
    return item.id!;
  }

  trackSimulationById(index: number, item: ISimulation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISimulation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(simulation: ISimulation): void {
    this.editForm.patchValue({
      id: simulation.id,
      name: simulation.name,
      affaire: simulation.affaire,
      client: simulation.client,
      parc: simulation.parc,
      adresseInstallation: simulation.adresseInstallation,
      status: simulation.status,
      created: simulation.created,
      modifier: simulation.modifier,
      parcours: simulation.parcours,
      parent: simulation.parent,
    });

    this.parcoursCollection = this.parcoursService.addParcoursToCollectionIfMissing(this.parcoursCollection, simulation.parcours);
    this.parentsCollection = this.simulationService.addSimulationToCollectionIfMissing(this.parentsCollection, simulation.parent);
  }

  protected loadRelationshipsOptions(): void {
    this.parcoursService
      .query({ filter: 'simulation-is-null' })
      .pipe(map((res: HttpResponse<IParcours[]>) => res.body ?? []))
      .pipe(
        map((parcours: IParcours[]) =>
          this.parcoursService.addParcoursToCollectionIfMissing(parcours, this.editForm.get('parcours')!.value)
        )
      )
      .subscribe((parcours: IParcours[]) => (this.parcoursCollection = parcours));

    this.simulationService
      .query({ filter: 'simulation-is-null' })
      .pipe(map((res: HttpResponse<ISimulation[]>) => res.body ?? []))
      .pipe(
        map((simulations: ISimulation[]) =>
          this.simulationService.addSimulationToCollectionIfMissing(simulations, this.editForm.get('parent')!.value)
        )
      )
      .subscribe((simulations: ISimulation[]) => (this.parentsCollection = simulations));
  }

  protected createFromForm(): ISimulation {
    return {
      ...new Simulation(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      affaire: this.editForm.get(['affaire'])!.value,
      client: this.editForm.get(['client'])!.value,
      parc: this.editForm.get(['parc'])!.value,
      adresseInstallation: this.editForm.get(['adresseInstallation'])!.value,
      status: this.editForm.get(['status'])!.value,
      created: this.editForm.get(['created'])!.value,
      modifier: this.editForm.get(['modifier'])!.value,
      parcours: this.editForm.get(['parcours'])!.value,
      parent: this.editForm.get(['parent'])!.value,
    };
  }
}
