import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEtapeDefinition, EtapeDefinition } from '../etape-definition.model';
import { EtapeDefinitionService } from '../service/etape-definition.service';

@Component({
  selector: 'jhi-etape-definition-update',
  templateUrl: './etape-definition-update.component.html',
})
export class EtapeDefinitionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
  });

  constructor(
    protected etapeDefinitionService: EtapeDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etapeDefinition }) => {
      this.updateForm(etapeDefinition);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etapeDefinition = this.createFromForm();
    if (etapeDefinition.id !== undefined) {
      this.subscribeToSaveResponse(this.etapeDefinitionService.update(etapeDefinition));
    } else {
      this.subscribeToSaveResponse(this.etapeDefinitionService.create(etapeDefinition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtapeDefinition>>): void {
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

  protected updateForm(etapeDefinition: IEtapeDefinition): void {
    this.editForm.patchValue({
      id: etapeDefinition.id,
      name: etapeDefinition.name,
      label: etapeDefinition.label,
    });
  }

  protected createFromForm(): IEtapeDefinition {
    return {
      ...new EtapeDefinition(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
    };
  }
}
