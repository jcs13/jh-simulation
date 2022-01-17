import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlocDefinition } from '../bloc-definition.model';
import { BlocDefinitionService } from '../service/bloc-definition.service';
import { BlocDefinitionDeleteDialogComponent } from '../delete/bloc-definition-delete-dialog.component';

@Component({
  selector: 'jhi-bloc-definition',
  templateUrl: './bloc-definition.component.html',
})
export class BlocDefinitionComponent implements OnInit {
  blocDefinitions?: IBlocDefinition[];
  isLoading = false;

  constructor(protected blocDefinitionService: BlocDefinitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blocDefinitionService.query().subscribe({
      next: (res: HttpResponse<IBlocDefinition[]>) => {
        this.isLoading = false;
        this.blocDefinitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBlocDefinition): number {
    return item.id!;
  }

  delete(blocDefinition: IBlocDefinition): void {
    const modalRef = this.modalService.open(BlocDefinitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.blocDefinition = blocDefinition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
