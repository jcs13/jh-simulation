import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEtape, Etape } from '../etape.model';
import { EtapeService } from '../service/etape.service';
import { IParcours } from 'app/entities/parcours/parcours.model';
import { ParcoursService } from 'app/entities/parcours/service/parcours.service';

@Component({
  selector: 'jhi-etape-update',
  templateUrl: './etape-update.component.html',
})
export class EtapeUpdateComponent implements OnInit {
  isSaving = false;

  parcoursSharedCollection: IParcours[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    etapeDefinitionId: [null, [Validators.required]],
    display: [null, [Validators.required]],
    parcours: [],
  });

  constructor(
    protected etapeService: EtapeService,
    protected parcoursService: ParcoursService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etape }) => {
      this.updateForm(etape);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etape = this.createFromForm();
    if (etape.id !== undefined) {
      this.subscribeToSaveResponse(this.etapeService.update(etape));
    } else {
      this.subscribeToSaveResponse(this.etapeService.create(etape));
    }
  }

  trackParcoursById(index: number, item: IParcours): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtape>>): void {
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

  protected updateForm(etape: IEtape): void {
    this.editForm.patchValue({
      id: etape.id,
      name: etape.name,
      label: etape.label,
      etapeDefinitionId: etape.etapeDefinitionId,
      display: etape.display,
      parcours: etape.parcours,
    });

    this.parcoursSharedCollection = this.parcoursService.addParcoursToCollectionIfMissing(this.parcoursSharedCollection, etape.parcours);
  }

  protected loadRelationshipsOptions(): void {
    this.parcoursService
      .query()
      .pipe(map((res: HttpResponse<IParcours[]>) => res.body ?? []))
      .pipe(
        map((parcours: IParcours[]) =>
          this.parcoursService.addParcoursToCollectionIfMissing(parcours, this.editForm.get('parcours')!.value)
        )
      )
      .subscribe((parcours: IParcours[]) => (this.parcoursSharedCollection = parcours));
  }

  protected createFromForm(): IEtape {
    return {
      ...new Etape(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      etapeDefinitionId: this.editForm.get(['etapeDefinitionId'])!.value,
      display: this.editForm.get(['display'])!.value,
      parcours: this.editForm.get(['parcours'])!.value,
    };
  }
}
