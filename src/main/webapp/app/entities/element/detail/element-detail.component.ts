import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IElement } from '../element.model';

@Component({
  selector: 'jhi-element-detail',
  templateUrl: './element-detail.component.html',
})
export class ElementDetailComponent implements OnInit {
  element: IElement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ element }) => {
      this.element = element;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
