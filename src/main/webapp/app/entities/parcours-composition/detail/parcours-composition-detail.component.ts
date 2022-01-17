import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParcoursComposition } from '../parcours-composition.model';

@Component({
  selector: 'jhi-parcours-composition-detail',
  templateUrl: './parcours-composition-detail.component.html',
})
export class ParcoursCompositionDetailComponent implements OnInit {
  parcoursComposition: IParcoursComposition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parcoursComposition }) => {
      this.parcoursComposition = parcoursComposition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
