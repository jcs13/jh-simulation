import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOffreComposition } from '../offre-composition.model';
import { OffreCompositionService } from '../service/offre-composition.service';
import { OffreCompositionDeleteDialogComponent } from '../delete/offre-composition-delete-dialog.component';

@Component({
  selector: 'jhi-offre-composition',
  templateUrl: './offre-composition.component.html',
})
export class OffreCompositionComponent implements OnInit {
  offreCompositions?: IOffreComposition[];
  isLoading = false;

  constructor(protected offreCompositionService: OffreCompositionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.offreCompositionService.query().subscribe({
      next: (res: HttpResponse<IOffreComposition[]>) => {
        this.isLoading = false;
        this.offreCompositions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOffreComposition): number {
    return item.id!;
  }

  delete(offreComposition: IOffreComposition): void {
    const modalRef = this.modalService.open(OffreCompositionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.offreComposition = offreComposition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
