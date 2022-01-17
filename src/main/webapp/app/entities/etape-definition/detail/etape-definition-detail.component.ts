import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEtapeDefinition } from '../etape-definition.model';

@Component({
  selector: 'jhi-etape-definition-detail',
  templateUrl: './etape-definition-detail.component.html',
})
export class EtapeDefinitionDetailComponent implements OnInit {
  etapeDefinition: IEtapeDefinition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etapeDefinition }) => {
      this.etapeDefinition = etapeDefinition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
