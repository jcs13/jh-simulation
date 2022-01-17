import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEtapeTransition } from '../etape-transition.model';

@Component({
  selector: 'jhi-etape-transition-detail',
  templateUrl: './etape-transition-detail.component.html',
})
export class EtapeTransitionDetailComponent implements OnInit {
  etapeTransition: IEtapeTransition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etapeTransition }) => {
      this.etapeTransition = etapeTransition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
