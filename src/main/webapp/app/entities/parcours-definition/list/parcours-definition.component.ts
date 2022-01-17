import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IParcoursDefinition } from '../parcours-definition.model';
import { ParcoursDefinitionService } from '../service/parcours-definition.service';
import { ParcoursDefinitionDeleteDialogComponent } from '../delete/parcours-definition-delete-dialog.component';

@Component({
  selector: 'jhi-parcours-definition',
  templateUrl: './parcours-definition.component.html',
})
export class ParcoursDefinitionComponent implements OnInit {
  parcoursDefinitions?: IParcoursDefinition[];
  isLoading = false;

  constructor(protected parcoursDefinitionService: ParcoursDefinitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.parcoursDefinitionService.query().subscribe({
      next: (res: HttpResponse<IParcoursDefinition[]>) => {
        this.isLoading = false;
        this.parcoursDefinitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IParcoursDefinition): number {
    return item.id!;
  }

  delete(parcoursDefinition: IParcoursDefinition): void {
    const modalRef = this.modalService.open(ParcoursDefinitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.parcoursDefinition = parcoursDefinition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
