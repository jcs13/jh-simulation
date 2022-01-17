import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBlocTransition, BlocTransition } from '../bloc-transition.model';
import { BlocTransitionService } from '../service/bloc-transition.service';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';
import { IBlocDefinition } from 'app/entities/bloc-definition/bloc-definition.model';
import { BlocDefinitionService } from 'app/entities/bloc-definition/service/bloc-definition.service';

@Component({
  selector: 'jhi-bloc-transition-update',
  templateUrl: './bloc-transition-update.component.html',
})
export class BlocTransitionUpdateComponent implements OnInit {
  isSaving = false;

  etapeDefinitionsCollection: IEtapeDefinition[] = [];
  currentsCollection: IBlocDefinition[] = [];
  nextsCollection: IBlocDefinition[] = [];

  editForm = this.fb.group({
    id: [],
    transition: [null, [Validators.required]],
    etapeDefinition: [],
    current: [],
    next: [],
  });

  constructor(
    protected blocTransitionService: BlocTransitionService,
    protected etapeDefinitionService: EtapeDefinitionService,
    protected blocDefinitionService: BlocDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blocTransition }) => {
      this.updateForm(blocTransition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blocTransition = this.createFromForm();
    if (blocTransition.id !== undefined) {
      this.subscribeToSaveResponse(this.blocTransitionService.update(blocTransition));
    } else {
      this.subscribeToSaveResponse(this.blocTransitionService.create(blocTransition));
    }
  }

  trackEtapeDefinitionById(index: number, item: IEtapeDefinition): number {
    return item.id!;
  }

  trackBlocDefinitionById(index: number, item: IBlocDefinition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlocTransition>>): void {
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

  protected updateForm(blocTransition: IBlocTransition): void {
    this.editForm.patchValue({
      id: blocTransition.id,
      transition: blocTransition.transition,
      etapeDefinition: blocTransition.etapeDefinition,
      current: blocTransition.current,
      next: blocTransition.next,
    });

    this.etapeDefinitionsCollection = this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(
      this.etapeDefinitionsCollection,
      blocTransition.etapeDefinition
    );
    this.currentsCollection = this.blocDefinitionService.addBlocDefinitionToCollectionIfMissing(
      this.currentsCollection,
      blocTransition.current
    );
    this.nextsCollection = this.blocDefinitionService.addBlocDefinitionToCollectionIfMissing(this.nextsCollection, blocTransition.next);
  }

  protected loadRelationshipsOptions(): void {
    this.etapeDefinitionService
      .query({ filter: 'bloctransition-is-null' })
      .pipe(map((res: HttpResponse<IEtapeDefinition[]>) => res.body ?? []))
      .pipe(
        map((etapeDefinitions: IEtapeDefinition[]) =>
          this.etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing(etapeDefinitions, this.editForm.get('etapeDefinition')!.value)
        )
      )
      .subscribe((etapeDefinitions: IEtapeDefinition[]) => (this.etapeDefinitionsCollection = etapeDefinitions));

    this.blocDefinitionService
      .query({ filter: 'bloctransition-is-null' })
      .pipe(map((res: HttpResponse<IBlocDefinition[]>) => res.body ?? []))
      .pipe(
        map((blocDefinitions: IBlocDefinition[]) =>
          this.blocDefinitionService.addBlocDefinitionToCollectionIfMissing(blocDefinitions, this.editForm.get('current')!.value)
        )
      )
      .subscribe((blocDefinitions: IBlocDefinition[]) => (this.currentsCollection = blocDefinitions));

    this.blocDefinitionService
      .query({ filter: 'bloctransition-is-null' })
      .pipe(map((res: HttpResponse<IBlocDefinition[]>) => res.body ?? []))
      .pipe(
        map((blocDefinitions: IBlocDefinition[]) =>
          this.blocDefinitionService.addBlocDefinitionToCollectionIfMissing(blocDefinitions, this.editForm.get('next')!.value)
        )
      )
      .subscribe((blocDefinitions: IBlocDefinition[]) => (this.nextsCollection = blocDefinitions));
  }

  protected createFromForm(): IBlocTransition {
    return {
      ...new BlocTransition(),
      id: this.editForm.get(['id'])!.value,
      transition: this.editForm.get(['transition'])!.value,
      etapeDefinition: this.editForm.get(['etapeDefinition'])!.value,
      current: this.editForm.get(['current'])!.value,
      next: this.editForm.get(['next'])!.value,
    };
  }
}
