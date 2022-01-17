import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtapeTransition } from '../etape-transition.model';
import { EtapeTransitionService } from '../service/etape-transition.service';
import { EtapeTransitionDeleteDialogComponent } from '../delete/etape-transition-delete-dialog.component';

@Component({
  selector: 'jhi-etape-transition',
  templateUrl: './etape-transition.component.html',
})
export class EtapeTransitionComponent implements OnInit {
  etapeTransitions?: IEtapeTransition[];
  isLoading = false;

  constructor(protected etapeTransitionService: EtapeTransitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.etapeTransitionService.query().subscribe({
      next: (res: HttpResponse<IEtapeTransition[]>) => {
        this.isLoading = false;
        this.etapeTransitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEtapeTransition): number {
    return item.id!;
  }

  delete(etapeTransition: IEtapeTransition): void {
    const modalRef = this.modalService.open(EtapeTransitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.etapeTransition = etapeTransition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
