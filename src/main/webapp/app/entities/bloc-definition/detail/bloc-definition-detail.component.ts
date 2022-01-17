import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlocDefinition } from '../bloc-definition.model';

@Component({
  selector: 'jhi-bloc-definition-detail',
  templateUrl: './bloc-definition-detail.component.html',
})
export class BlocDefinitionDetailComponent implements OnInit {
  blocDefinition: IBlocDefinition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blocDefinition }) => {
      this.blocDefinition = blocDefinition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
