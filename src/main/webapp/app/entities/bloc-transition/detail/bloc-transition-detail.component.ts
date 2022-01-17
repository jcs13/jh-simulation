import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlocTransition } from '../bloc-transition.model';

@Component({
  selector: 'jhi-bloc-transition-detail',
  templateUrl: './bloc-transition-detail.component.html',
})
export class BlocTransitionDetailComponent implements OnInit {
  blocTransition: IBlocTransition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blocTransition }) => {
      this.blocTransition = blocTransition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
