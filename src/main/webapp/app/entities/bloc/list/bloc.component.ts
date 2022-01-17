import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBloc } from '../bloc.model';
import { BlocService } from '../service/bloc.service';
import { BlocDeleteDialogComponent } from '../delete/bloc-delete-dialog.component';

@Component({
  selector: 'jhi-bloc',
  templateUrl: './bloc.component.html',
})
export class BlocComponent implements OnInit {
  blocs?: IBloc[];
  isLoading = false;

  constructor(protected blocService: BlocService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blocService.query().subscribe({
      next: (res: HttpResponse<IBloc[]>) => {
        this.isLoading = false;
        this.blocs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBloc): number {
    return item.id!;
  }

  delete(bloc: IBloc): void {
    const modalRef = this.modalService.open(BlocDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bloc = bloc;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
