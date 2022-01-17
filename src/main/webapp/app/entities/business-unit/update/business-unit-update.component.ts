import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBusinessUnit, BusinessUnit } from '../business-unit.model';
import { BusinessUnitService } from '../service/business-unit.service';

@Component({
  selector: 'jhi-business-unit-update',
  templateUrl: './business-unit-update.component.html',
})
export class BusinessUnitUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
  });

  constructor(protected businessUnitService: BusinessUnitService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessUnit }) => {
      this.updateForm(businessUnit);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const businessUnit = this.createFromForm();
    if (businessUnit.id !== undefined) {
      this.subscribeToSaveResponse(this.businessUnitService.update(businessUnit));
    } else {
      this.subscribeToSaveResponse(this.businessUnitService.create(businessUnit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessUnit>>): void {
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

  protected updateForm(businessUnit: IBusinessUnit): void {
    this.editForm.patchValue({
      id: businessUnit.id,
      code: businessUnit.code,
      name: businessUnit.name,
      label: businessUnit.label,
    });
  }

  protected createFromForm(): IBusinessUnit {
    return {
      ...new BusinessUnit(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
    };
  }
}
