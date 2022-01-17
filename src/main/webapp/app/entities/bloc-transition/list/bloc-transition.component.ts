import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlocTransition } from '../bloc-transition.model';
import { BlocTransitionService } from '../service/bloc-transition.service';
import { BlocTransitionDeleteDialogComponent } from '../delete/bloc-transition-delete-dialog.component';

@Component({
  selector: 'jhi-bloc-transition',
  templateUrl: './bloc-transition.component.html',
})
export class BlocTransitionComponent implements OnInit {
  blocTransitions?: IBlocTransition[];
  isLoading = false;

  constructor(protected blocTransitionService: BlocTransitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blocTransitionService.query().subscribe({
      next: (res: HttpResponse<IBlocTransition[]>) => {
        this.isLoading = false;
        this.blocTransitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBlocTransition): number {
    return item.id!;
  }

  delete(blocTransition: IBlocTransition): void {
    const modalRef = this.modalService.open(BlocTransitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.blocTransition = blocTransition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
