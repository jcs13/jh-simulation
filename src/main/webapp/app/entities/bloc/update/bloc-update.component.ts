import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBloc, Bloc } from '../bloc.model';
import { BlocService } from '../service/bloc.service';
import { IEtape } from 'app/entities/etape/etape.model';
import { EtapeService } from 'app/entities/etape/service/etape.service';

@Component({
  selector: 'jhi-bloc-update',
  templateUrl: './bloc-update.component.html',
})
export class BlocUpdateComponent implements OnInit {
  isSaving = false;

  etapesSharedCollection: IEtape[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    elementName: [null, [Validators.required]],
    elementPath: [null, [Validators.required]],
    etapeDefinitionId: [null, [Validators.required]],
    blocDefinitionId: [null, [Validators.required]],
    display: [null, [Validators.required]],
    etape: [],
  });

  constructor(
    protected blocService: BlocService,
    protected etapeService: EtapeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bloc }) => {
      this.updateForm(bloc);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bloc = this.createFromForm();
    if (bloc.id !== undefined) {
      this.subscribeToSaveResponse(this.blocService.update(bloc));
    } else {
      this.subscribeToSaveResponse(this.blocService.create(bloc));
    }
  }

  trackEtapeById(index: number, item: IEtape): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBloc>>): void {
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

  protected updateForm(bloc: IBloc): void {
    this.editForm.patchValue({
      id: bloc.id,
      name: bloc.name,
      label: bloc.label,
      elementName: bloc.elementName,
      elementPath: bloc.elementPath,
      etapeDefinitionId: bloc.etapeDefinitionId,
      blocDefinitionId: bloc.blocDefinitionId,
      display: bloc.display,
      etape: bloc.etape,
    });

    this.etapesSharedCollection = this.etapeService.addEtapeToCollectionIfMissing(this.etapesSharedCollection, bloc.etape);
  }

  protected loadRelationshipsOptions(): void {
    this.etapeService
      .query()
      .pipe(map((res: HttpResponse<IEtape[]>) => res.body ?? []))
      .pipe(map((etapes: IEtape[]) => this.etapeService.addEtapeToCollectionIfMissing(etapes, this.editForm.get('etape')!.value)))
      .subscribe((etapes: IEtape[]) => (this.etapesSharedCollection = etapes));
  }

  protected createFromForm(): IBloc {
    return {
      ...new Bloc(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      elementName: this.editForm.get(['elementName'])!.value,
      elementPath: this.editForm.get(['elementPath'])!.value,
      etapeDefinitionId: this.editForm.get(['etapeDefinitionId'])!.value,
      blocDefinitionId: this.editForm.get(['blocDefinitionId'])!.value,
      display: this.editForm.get(['display'])!.value,
      etape: this.editForm.get(['etape'])!.value,
    };
  }
}
