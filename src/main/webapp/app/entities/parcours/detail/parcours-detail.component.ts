import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParcours } from '../parcours.model';

@Component({
  selector: 'jhi-parcours-detail',
  templateUrl: './parcours-detail.component.html',
})
export class ParcoursDetailComponent implements OnInit {
  parcours: IParcours | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parcours }) => {
      this.parcours = parcours;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
