import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOffre, Offre } from '../offre.model';
import { OffreService } from '../service/offre.service';
import { IBusinessUnit } from 'app/entities/business-unit/business-unit.model';
import { BusinessUnitService } from 'app/entities/business-unit/service/business-unit.service';

@Component({
  selector: 'jhi-offre-update',
  templateUrl: './offre-update.component.html',
})
export class OffreUpdateComponent implements OnInit {
  isSaving = false;

  businessUnitsSharedCollection: IBusinessUnit[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    label: [null, [Validators.required]],
    businessUnit: [],
  });

  constructor(
    protected offreService: OffreService,
    protected businessUnitService: BusinessUnitService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offre }) => {
      this.updateForm(offre);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offre = this.createFromForm();
    if (offre.id !== undefined) {
      this.subscribeToSaveResponse(this.offreService.update(offre));
    } else {
      this.subscribeToSaveResponse(this.offreService.create(offre));
    }
  }

  trackBusinessUnitById(index: number, item: IBusinessUnit): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffre>>): void {
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

  protected updateForm(offre: IOffre): void {
    this.editForm.patchValue({
      id: offre.id,
      name: offre.name,
      label: offre.label,
      businessUnit: offre.businessUnit,
    });

    this.businessUnitsSharedCollection = this.businessUnitService.addBusinessUnitToCollectionIfMissing(
      this.businessUnitsSharedCollection,
      offre.businessUnit
    );
  }

  protected loadRelationshipsOptions(): void {
    this.businessUnitService
      .query()
      .pipe(map((res: HttpResponse<IBusinessUnit[]>) => res.body ?? []))
      .pipe(
        map((businessUnits: IBusinessUnit[]) =>
          this.businessUnitService.addBusinessUnitToCollectionIfMissing(businessUnits, this.editForm.get('businessUnit')!.value)
        )
      )
      .subscribe((businessUnits: IBusinessUnit[]) => (this.businessUnitsSharedCollection = businessUnits));
  }

  protected createFromForm(): IOffre {
    return {
      ...new Offre(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      label: this.editForm.get(['label'])!.value,
      businessUnit: this.editForm.get(['businessUnit'])!.value,
    };
  }
}
