import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtapeDefinition } from '../etape-definition.model';
import { EtapeDefinitionService } from '../service/etape-definition.service';
import { EtapeDefinitionDeleteDialogComponent } from '../delete/etape-definition-delete-dialog.component';

@Component({
  selector: 'jhi-etape-definition',
  templateUrl: './etape-definition.component.html',
})
export class EtapeDefinitionComponent implements OnInit {
  etapeDefinitions?: IEtapeDefinition[];
  isLoading = false;

  constructor(protected etapeDefinitionService: EtapeDefinitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.etapeDefinitionService.query().subscribe({
      next: (res: HttpResponse<IEtapeDefinition[]>) => {
        this.isLoading = false;
        this.etapeDefinitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEtapeDefinition): number {
    return item.id!;
  }

  delete(etapeDefinition: IEtapeDefinition): void {
    const modalRef = this.modalService.open(EtapeDefinitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.etapeDefinition = etapeDefinition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
