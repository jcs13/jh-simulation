import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParcoursDefinition, ParcoursDefinition } from '../parcours-definition.model';
import { ParcoursDefinitionService } from '../service/parcours-definition.service';

@Component({
  selector: 'jhi-parcours-definition-update',
  templateUrl: './parcours-definition-update.component.html',
})
export class ParcoursDefinitionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
  });

  constructor(
    protected parcoursDefinitionService: ParcoursDefinitionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parcoursDefinition }) => {
      this.updateForm(parcoursDefinition);
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
    });
  }

  protected createFromForm(): IParcoursDefinition {
    return {
      ...new ParcoursDefinition(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
    };
  }
}
