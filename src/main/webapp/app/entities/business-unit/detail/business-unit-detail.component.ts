import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusinessUnit } from '../business-unit.model';

@Component({
  selector: 'jhi-business-unit-detail',
  templateUrl: './business-unit-detail.component.html',
})
export class BusinessUnitDetailComponent implements OnInit {
  businessUnit: IBusinessUnit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessUnit }) => {
      this.businessUnit = businessUnit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
