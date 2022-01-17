import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IElement, Element } from '../element.model';
import { ElementService } from '../service/element.service';

@Component({
  selector: 'jhi-element-update',
  templateUrl: './element-update.component.html',
})
export class ElementUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    path: [null, [Validators.required]],
  });

  constructor(protected elementService: ElementService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ element }) => {
      this.updateForm(element);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const element = this.createFromForm();
    if (element.id !== undefined) {
      this.subscribeToSaveResponse(this.elementService.update(element));
    } else {
      this.subscribeToSaveResponse(this.elementService.create(element));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IElement>>): void {
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

  protected updateForm(element: IElement): void {
    this.editForm.patchValue({
      id: element.id,
      name: element.name,
      path: element.path,
    });
  }

  protected createFromForm(): IElement {
    return {
      ...new Element(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      path: this.editForm.get(['path'])!.value,
    };
  }
}
