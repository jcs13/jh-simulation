import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IElement } from '../element.model';
import { ElementService } from '../service/element.service';
import { ElementDeleteDialogComponent } from '../delete/element-delete-dialog.component';

@Component({
  selector: 'jhi-element',
  templateUrl: './element.component.html',
})
export class ElementComponent implements OnInit {
  elements?: IElement[];
  isLoading = false;

  constructor(protected elementService: ElementService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.elementService.query().subscribe({
      next: (res: HttpResponse<IElement[]>) => {
        this.isLoading = false;
        this.elements = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IElement): number {
    return item.id!;
  }

  delete(element: IElement): void {
    const modalRef = this.modalService.open(ElementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.element = element;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
