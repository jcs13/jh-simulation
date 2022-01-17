import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBloc } from '../bloc.model';

@Component({
  selector: 'jhi-bloc-detail',
  templateUrl: './bloc-detail.component.html',
})
export class BlocDetailComponent implements OnInit {
  bloc: IBloc | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bloc }) => {
      this.bloc = bloc;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
