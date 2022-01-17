import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEtape } from '../etape.model';

@Component({
  selector: 'jhi-etape-detail',
  templateUrl: './etape-detail.component.html',
})
export class EtapeDetailComponent implements OnInit {
  etape: IEtape | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etape }) => {
      this.etape = etape;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
