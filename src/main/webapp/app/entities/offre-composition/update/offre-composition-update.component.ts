import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOffreComposition, OffreComposition } from '../offre-composition.model';
import { OffreCompositionService } from '../service/offre-composition.service';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';

@Component({
  selector: 'jhi-offre-composition-update',
  templateUrl: './offre-composition-update.component.html',
})
export class OffreCompositionUpdateComponent implements OnInit {
  isSaving = false;

  offresCollection: IOffre[] = [];
  parcoursParentsCollection: IParcoursDefinition[] = [];
  parcoursChildrenCollection: IParcoursDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    inheritanceOrder: [null, [Validators.required]],
    offre: [],
    parcoursParent: [],
    parcoursChild: [],
  });

  constructor(
    protected offreCompositionService: OffreCompositionService,
    protected offreService: OffreService,
    protected parcoursDefinitionService: ParcoursDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offreComposition }) => {
      this.updateForm(offreComposition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offreComposition = this.createFromForm();
    if (offreComposition.id !== undefined) {
      this.subscribeToSaveResponse(this.offreCompositionService.update(offreComposition));
    } else {
      this.subscribeToSaveResponse(this.offreCompositionService.create(offreComposition));
    }
  }

  trackOffreById(index: number, item: IOffre): number {
    return item.id!;
  }

  trackParcoursDefinitionById(index: number, item: IParcoursDefinition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffreComposition>>): void {
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

  protected updateForm(offreComposition: IOffreComposition): void {
    this.editForm.patchValue({
      id: offreComposition.id,
      inheritanceOrder: offreComposition.inheritanceOrder,
      offre: offreComposition.offre,
      parcoursParent: offreComposition.parcoursParent,
      parcoursChild: offreComposition.parcoursChild,
    });

    this.offresCollection = this.offreService.addOffreToCollectionIfMissing(this.offresCollection, offreComposition.offre);
    this.parcoursParentsCollection = this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
      this.parcoursParentsCollection,
      offreComposition.parcoursParent
    );
    this.parcoursChildrenCollection = this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
      this.parcoursChildrenCollection,
      offreComposition.parcoursChild
    );
  }

  protected loadRelationshipsOptions(): void {
    this.offreService
      .query({ filter: 'offrecomposition-is-null' })
      .pipe(map((res: HttpResponse<IOffre[]>) => res.body ?? []))
      .pipe(map((offres: IOffre[]) => this.offreService.addOffreToCollectionIfMissing(offres, this.editForm.get('offre')!.value)))
      .subscribe((offres: IOffre[]) => (this.offresCollection = offres));

    this.parcoursDefinitionService
      .query({ filter: 'offrecomposition-is-null' })
      .pipe(map((res: HttpResponse<IParcoursDefinition[]>) => res.body ?? []))
      .pipe(
        map((parcoursDefinitions: IParcoursDefinition[]) =>
          this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
            parcoursDefinitions,
            this.editForm.get('parcoursParent')!.value
          )
        )
      )
      .subscribe((parcoursDefinitions: IParcoursDefinition[]) => (this.parcoursParentsCollection = parcoursDefinitions));

    this.parcoursDefinitionService
      .query({ filter: 'offrecomposition-is-null' })
      .pipe(map((res: HttpResponse<IParcoursDefinition[]>) => res.body ?? []))
      .pipe(
        map((parcoursDefinitions: IParcoursDefinition[]) =>
          this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
            parcoursDefinitions,
            this.editForm.get('parcoursChild')!.value
          )
        )
      )
      .subscribe((parcoursDefinitions: IParcoursDefinition[]) => (this.parcoursChildrenCollection = parcoursDefinitions));
  }

  protected createFromForm(): IOffreComposition {
    return {
      ...new OffreComposition(),
      id: this.editForm.get(['id'])!.value,
      inheritanceOrder: this.editForm.get(['inheritanceOrder'])!.value,
      offre: this.editForm.get(['offre'])!.value,
      parcoursParent: this.editForm.get(['parcoursParent'])!.value,
      parcoursChild: this.editForm.get(['parcoursChild'])!.value,
    };
  }
}
