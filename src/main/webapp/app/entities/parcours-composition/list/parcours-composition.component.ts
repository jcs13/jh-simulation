import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IParcoursComposition } from '../parcours-composition.model';
import { ParcoursCompositionService } from '../service/parcours-composition.service';
import { ParcoursCompositionDeleteDialogComponent } from '../delete/parcours-composition-delete-dialog.component';

@Component({
  selector: 'jhi-parcours-composition',
  templateUrl: './parcours-composition.component.html',
})
export class ParcoursCompositionComponent implements OnInit {
  parcoursCompositions?: IParcoursComposition[];
  isLoading = false;

  constructor(protected parcoursCompositionService: ParcoursCompositionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.parcoursCompositionService.query().subscribe({
      next: (res: HttpResponse<IParcoursComposition[]>) => {
        this.isLoading = false;
        this.parcoursCompositions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IParcoursComposition): number {
    return item.id!;
  }

  delete(parcoursComposition: IParcoursComposition): void {
    const modalRef = this.modalService.open(ParcoursCompositionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.parcoursComposition = parcoursComposition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
