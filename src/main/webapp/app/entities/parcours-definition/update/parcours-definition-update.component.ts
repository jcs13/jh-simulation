import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IParcoursDefinition, ParcoursDefinition } from '../parcours-definition.model';
import { ParcoursDefinitionService } from '../service/parcours-definition.service';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';

@Component({
  selector: 'jhi-parcours-definition-update',
  templateUrl: './parcours-definition-update.component.html',
})
export class ParcoursDefinitionUpdateComponent implements OnInit {
  isSaving = false;

  offresSharedCollection: IOffre[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    offre: [],
  });

  constructor(
    protected parcoursDefinitionService: ParcoursDefinitionService,
    protected offreService: OffreService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parcoursDefinition }) => {
      this.updateForm(parcoursDefinition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parcoursDefinition = this.createFromForm();
    if (parcoursDefinition.id !== undefined) {
      this.subscribeToSaveResponse(this.parcoursDefinitionService.update(parcoursDefinition));
    } else {
      this.subscribeToSaveResponse(this.parcoursDefinitionService.create(parcoursDefinition));
    }
  }

  trackOffreById(index: number, item: IOffre): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParcoursDefinition>>): void {
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

  protected updateForm(parcoursDefinition: IParcoursDefinition): void {
    this.editForm.patchValue({
      id: parcoursDefinition.id,
      name: parcoursDefinition.name,
      label: parcoursDefinition.label,
      offre: parcoursDefinition.offre,
    });

    this.offresSharedCollection = this.offreService.addOffreToCollectionIfMissing(this.offresSharedCollection, parcoursDefinition.offre);
  }

  protected loadRelationshipsOptions(): void {
    this.offreService
      .query()
      .pipe(map((res: HttpResponse<IOffre[]>) => res.body ?? []))
      .pipe(map((offres: IOffre[]) => this.offreService.addOffreToCollectionIfMissing(offres, this.editForm.get('offre')!.value)))
      .subscribe((offres: IOffre[]) => (this.offresSharedCollection = offres));
  }

  protected createFromForm(): IParcoursDefinition {
    return {
      ...new ParcoursDefinition(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      offre: this.editForm.get(['offre'])!.value,
    };
  }
}
