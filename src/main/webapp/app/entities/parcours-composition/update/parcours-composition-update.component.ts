import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IParcoursComposition, ParcoursComposition } from '../parcours-composition.model';
import { ParcoursCompositionService } from '../service/parcours-composition.service';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';

@Component({
  selector: 'jhi-parcours-composition-update',
  templateUrl: './parcours-composition-update.component.html',
})
export class ParcoursCompositionUpdateComponent implements OnInit {
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
    protected parcoursCompositionService: ParcoursCompositionService,
    protected offreService: OffreService,
    protected parcoursDefinitionService: ParcoursDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parcoursComposition }) => {
      this.updateForm(parcoursComposition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parcoursComposition = this.createFromForm();
    if (parcoursComposition.id !== undefined) {
      this.subscribeToSaveResponse(this.parcoursCompositionService.update(parcoursComposition));
    } else {
      this.subscribeToSaveResponse(this.parcoursCompositionService.create(parcoursComposition));
    }
  }

  trackOffreById(index: number, item: IOffre): number {
    return item.id!;
  }

  trackParcoursDefinitionById(index: number, item: IParcoursDefinition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParcoursComposition>>): void {
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

  protected updateForm(parcoursComposition: IParcoursComposition): void {
    this.editForm.patchValue({
      id: parcoursComposition.id,
      inheritanceOrder: parcoursComposition.inheritanceOrder,
      offre: parcoursComposition.offre,
      parcoursParent: parcoursComposition.parcoursParent,
      parcoursChild: parcoursComposition.parcoursChild,
    });

    this.offresCollection = this.offreService.addOffreToCollectionIfMissing(this.offresCollection, parcoursComposition.offre);
    this.parcoursParentsCollection = this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
      this.parcoursParentsCollection,
      parcoursComposition.parcoursParent
    );
    this.parcoursChildrenCollection = this.parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing(
      this.parcoursChildrenCollection,
      parcoursComposition.parcoursChild
    );
  }

  protected loadRelationshipsOptions(): void {
    this.offreService
      .query({ filter: 'parcourscomposition-is-null' })
      .pipe(map((res: HttpResponse<IOffre[]>) => res.body ?? []))
      .pipe(map((offres: IOffre[]) => this.offreService.addOffreToCollectionIfMissing(offres, this.editForm.get('offre')!.value)))
      .subscribe((offres: IOffre[]) => (this.offresCollection = offres));

    this.parcoursDefinitionService
      .query({ filter: 'parcourscomposition-is-null' })
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
      .query({ filter: 'parcourscomposition-is-null' })
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

  protected createFromForm(): IParcoursComposition {
    return {
      ...new ParcoursComposition(),
      id: this.editForm.get(['id'])!.value,
      inheritanceOrder: this.editForm.get(['inheritanceOrder'])!.value,
      offre: this.editForm.get(['offre'])!.value,
      parcoursParent: this.editForm.get(['parcoursParent'])!.value,
      parcoursChild: this.editForm.get(['parcoursChild'])!.value,
    };
  }
}
