import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParcours, Parcours } from '../parcours.model';
import { ParcoursService } from '../service/parcours.service';

@Component({
  selector: 'jhi-parcours-update',
  templateUrl: './parcours-update.component.html',
})
export class ParcoursUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    offreId: [null, [Validators.required]],
  });

  constructor(protected parcoursService: ParcoursService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parcours }) => {
      this.updateForm(parcours);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parcours = this.createFromForm();
    if (parcours.id !== undefined) {
      this.subscribeToSaveResponse(this.parcoursService.update(parcours));
    } else {
      this.subscribeToSaveResponse(this.parcoursService.create(parcours));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParcours>>): void {
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

  protected updateForm(parcours: IParcours): void {
    this.editForm.patchValue({
      id: parcours.id,
      name: parcours.name,
      label: parcours.label,
      offreId: parcours.offreId,
    });
  }

  protected createFromForm(): IParcours {
    return {
      ...new Parcours(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      offreId: this.editForm.get(['offreId'])!.value,
    };
  }
}
