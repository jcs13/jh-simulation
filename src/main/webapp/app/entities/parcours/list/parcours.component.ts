import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IParcours } from '../parcours.model';
import { ParcoursService } from '../service/parcours.service';
import { ParcoursDeleteDialogComponent } from '../delete/parcours-delete-dialog.component';

@Component({
  selector: 'jhi-parcours',
  templateUrl: './parcours.component.html',
})
export class ParcoursComponent implements OnInit {
  parcours?: IParcours[];
  isLoading = false;

  constructor(protected parcoursService: ParcoursService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.parcoursService.query().subscribe({
      next: (res: HttpResponse<IParcours[]>) => {
        this.isLoading = false;
        this.parcours = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IParcours): number {
    return item.id!;
  }

  delete(parcours: IParcours): void {
    const modalRef = this.modalService.open(ParcoursDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.parcours = parcours;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
