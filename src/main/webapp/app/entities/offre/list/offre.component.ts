import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOffre } from '../offre.model';
import { OffreService } from '../service/offre.service';
import { OffreDeleteDialogComponent } from '../delete/offre-delete-dialog.component';

@Component({
  selector: 'jhi-offre',
  templateUrl: './offre.component.html',
})
export class OffreComponent implements OnInit {
  offres?: IOffre[];
  isLoading = false;

  constructor(protected offreService: OffreService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.offreService.query().subscribe({
      next: (res: HttpResponse<IOffre[]>) => {
        this.isLoading = false;
        this.offres = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOffre): number {
    return item.id!;
  }

  delete(offre: IOffre): void {
    const modalRef = this.modalService.open(OffreDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.offre = offre;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
