import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBlocDefinition, BlocDefinition } from '../bloc-definition.model';
import { BlocDefinitionService } from '../service/bloc-definition.service';
import { IElement } from 'app/entities/element/element.model';
import { ElementService } from 'app/entities/element/service/element.service';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';

@Component({
  selector: 'jhi-bloc-definition-update',
  templateUrl: './bloc-definition-update.component.html',
})
export class BlocDefinitionUpdateComponent implements OnInit {
  isSaving = false;

  elementsCollection: IElement[] = [];
  etapeDefinitionsSharedCollection: IEtapeDefinition[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    element: [],
    etapeDefinition: [],
  });

  constructor(
    protected blocDefinitionService: BlocDefinitionService,
    protected elementService: ElementService,
    protected etapeDefinitionService: EtapeDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blocDefinition }) => {
      this.updateForm(blocDefinition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blocDefinition = this.createFromForm();
    if (blocDefinition.id !== undefined) {
      this.subscribeToSaveResponse(this.blocDefinitionService.update(blocDefinition));
    } else {
      this.subscribeToSaveResponse(this.blocDefinitionService.create(blocDefinition));
    }
  }

  trackElementById(index: number, item: IElement): number {
    return item.id!;
  }

  trackEtapeDefinitionById(index: number, item: IEtapeDefinition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlocDefinition>>): void {
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

  protected updateForm(blocDefinition: IBlocDefinition): void {
    this.editForm.patchValue({
      id: blocDefinition.id,
      name: blocDefinition.name,
      label: blocDefinition.label,
      element: blocDefinition.element,
      etapeDefinition: blocDefinition.etapeDefinition,
    });

    this.elementsCollection = this.elementService.addElementToCollectionIfMissing(this.elementsCollection, blocDefinition.element);
    this.etapeDefinitionsSharedCollection = this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(
      this.etapeDefinitionsSharedCollection,
      blocDefinition.etapeDefinition
    );
  }

  protected loadRelationshipsOptions(): void {
    this.elementService
      .query({ filter: 'blocdefinition-is-null' })
      .pipe(map((res: HttpResponse<IElement[]>) => res.body ?? []))
      .pipe(
        map((elements: IElement[]) => this.elementService.addElementToCollectionIfMissing(elements, this.editForm.get('element')!.value))
      )
      .subscribe((elements: IElement[]) => (this.elementsCollection = elements));

    this.etapeDefinitionService
      .query()
      .pipe(map((res: HttpResponse<IEtapeDefinition[]>) => res.body ?? []))
      .pipe(
        map((etapeDefinitions: IEtapeDefinition[]) =>
          this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(etapeDefinitions, this.editForm.get('etapeDefinition')!.value)
        )
      )
      .subscribe((etapeDefinitions: IEtapeDefinition[]) => (this.etapeDefinitionsSharedCollection = etapeDefinitions));
  }

  protected createFromForm(): IBlocDefinition {
    return {
      ...new BlocDefinition(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      element: this.editForm.get(['element'])!.value,
      etapeDefinition: this.editForm.get(['etapeDefinition'])!.value,
    };
  }
}
