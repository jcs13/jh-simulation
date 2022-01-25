import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOffreComposition } from '../offre-composition.model';

@Component({
  selector: 'jhi-offre-composition-detail',
  templateUrl: './offre-composition-detail.component.html',
})
export class OffreCompositionDetailComponent implements OnInit {
  offreComposition: IOffreComposition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offreComposition }) => {
      this.offreComposition = offreComposition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
