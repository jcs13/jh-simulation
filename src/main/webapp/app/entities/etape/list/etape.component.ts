import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtape } from '../etape.model';
import { EtapeService } from '../service/etape.service';
import { EtapeDeleteDialogComponent } from '../delete/etape-delete-dialog.component';

@Component({
  selector: 'jhi-etape',
  templateUrl: './etape.component.html',
})
export class EtapeComponent implements OnInit {
  etapes?: IEtape[];
  isLoading = false;

  constructor(protected etapeService: EtapeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.etapeService.query().subscribe({
      next: (res: HttpResponse<IEtape[]>) => {
        this.isLoading = false;
        this.etapes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEtape): number {
    return item.id!;
  }

  delete(etape: IEtape): void {
    const modalRef = this.modalService.open(EtapeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.etape = etape;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
