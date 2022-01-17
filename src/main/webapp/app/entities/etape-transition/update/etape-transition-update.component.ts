import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEtapeTransition, EtapeTransition } from '../etape-transition.model';
import { EtapeTransitionService } from '../service/etape-transition.service';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';

@Component({
  selector: 'jhi-etape-transition-update',
  templateUrl: './etape-transition-update.component.html',
})
export class EtapeTransitionUpdateComponent implements OnInit {
  isSaving = false;

  parcoursDefinitionsCollection: IParcoursDefinition[] = [];
  currentsCollection: IEtapeDefinition[] = [];
  nextsCollection: IEtapeDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    transition: [null, [Validators.required]],
    parcoursDefinition: [],
    current: [],
    next: [],
  });

  constructor(
    protected etapeTransitionService: EtapeTransitionService,
    protected parcoursDefinitionService: ParcoursDefinitionService,
    protected etapeDefinitionService: EtapeDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etapeTransition }) => {
      this.updateForm(etapeTransition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etapeTransition = this.createFromForm();
    if (etapeTransition.id !== undefined) {
      this.subscribeToSaveResponse(this.etapeTransitionService.update(etapeTransition));
    } else {
      this.subscribeToSaveResponse(this.etapeTransitionService.create(etapeTransition));
    }
  }

  trackParcoursDefinitionById(index: number, item: IParcoursDefinition): number {
    return item.id!;
  }

  trackEtapeDefinitionById(index: number, item: IEtapeDefinition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtapeTransition>>): void {
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

  protected updateForm(etapeTransition: IEtapeTransition): void {
    this.editForm.patchValue({
      id: etapeTransition.id,
      transition: etapeTransition.transition,
      parcoursDefinition: etapeTransition.parcoursDefinition,
      current: etapeTransition.current,
      next: etapeTransition.next,
    });

    this.parcoursDefinitionsCollection = this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
      this.parcoursDefinitionsCollection,
      etapeTransition.parcoursDefinition
    );
    this.currentsCollection = this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(
      this.currentsCollection,
      etapeTransition.current
    );
    this.nextsCollection = this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(this.nextsCollection, etapeTransition.next);
  }

  protected loadRelationshipsOptions(): void {
    this.parcoursDefinitionService
      .query({ filter: 'etapetransition-is-null' })
      .pipe(map((res: HttpResponse<IParcoursDefinition[]>) => res.body ?? []))
      .pipe(
        map((parcoursDefinitions: IParcoursDefinition[]) =>
          this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
            parcoursDefinitions,
            this.editForm.get('parcoursDefinition')!.value
          )
        )
      )
      .subscribe((parcoursDefinitions: IParcoursDefinition[]) => (this.parcoursDefinitionsCollection = parcoursDefinitions));

    this.etapeDefinitionService
      .query({ filter: 'etapetransition-is-null' })
      .pipe(map((res: HttpResponse<IEtapeDefinition[]>) => res.body ?? []))
      .pipe(
        map((etapeDefinitions: IEtapeDefinition[]) =>
          this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(etapeDefinitions, this.editForm.get('current')!.value)
        )
      )
      .subscribe((etapeDefinitions: IEtapeDefinition[]) => (this.currentsCollection = etapeDefinitions));

    this.etapeDefinitionService
      .query({ filter: 'etapetransition-is-null' })
      .pipe(map((res: HttpResponse<IEtapeDefinition[]>) => res.body ?? []))
      .pipe(
        map((etapeDefinitions: IEtapeDefinition[]) =>
          this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(etapeDefinitions, this.editForm.get('next')!.value)
        )
      )
      .subscribe((etapeDefinitions: IEtapeDefinition[]) => (this.nextsCollection = etapeDefinitions));
  }

  protected createFromForm(): IEtapeTransition {
    return {
      ...new EtapeTransition(),
      id: this.editForm.get(['id'])!.value,
      transition: this.editForm.get(['transition'])!.value,
      parcoursDefinition: this.editForm.get(['parcoursDefinition'])!.value,
      current: this.editForm.get(['current'])!.value,
      next: this.editForm.get(['next'])!.value,
    };
  }
}
