import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOffre } from '../offre.model';

@Component({
  selector: 'jhi-offre-detail',
  templateUrl: './offre-detail.component.html',
})
export class OffreDetailComponent implements OnInit {
  offre: IOffre | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offre }) => {
      this.offre = offre;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
