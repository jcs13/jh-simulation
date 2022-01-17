import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessUnit } from '../business-unit.model';
import { BusinessUnitService } from '../service/business-unit.service';
import { BusinessUnitDeleteDialogComponent } from '../delete/business-unit-delete-dialog.component';

@Component({
  selector: 'jhi-business-unit',
  templateUrl: './business-unit.component.html',
})
export class BusinessUnitComponent implements OnInit {
  businessUnits?: IBusinessUnit[];
  isLoading = false;

  constructor(protected businessUnitService: BusinessUnitService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.businessUnitService.query().subscribe({
      next: (res: HttpResponse<IBusinessUnit[]>) => {
        this.isLoading = false;
        this.businessUnits = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBusinessUnit): number {
    return item.id!;
  }

  delete(businessUnit: IBusinessUnit): void {
    const modalRef = this.modalService.open(BusinessUnitDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.businessUnit = businessUnit;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
