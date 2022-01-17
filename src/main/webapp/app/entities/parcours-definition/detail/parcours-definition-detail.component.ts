import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParcoursDefinition } from '../parcours-definition.model';

@Component({
  selector: 'jhi-parcours-definition-detail',
  templateUrl: './parcours-definition-detail.component.html',
})
export class ParcoursDefinitionDetailComponent implements OnInit {
  parcoursDefinition: IParcoursDefinition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parcoursDefinition }) => {
      this.parcoursDefinition = parcoursDefinition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
