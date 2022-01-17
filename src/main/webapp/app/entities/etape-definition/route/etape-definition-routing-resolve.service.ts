import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtapeDefinition, EtapeDefinition } from '../etape-definition.model';
import { EtapeDefinitionService } from '../service/etape-definition.service';

@Injectable({ providedIn: 'root' })
export class EtapeDefinitionRoutingResolveService implements Resolve<IEtapeDefinition> {
  constructor(protected service: EtapeDefinitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEtapeDefinition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((etapeDefinition: HttpResponse<EtapeDefinition>) => {
          if (etapeDefinition.body) {
            return of(etapeDefinition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EtapeDefinition());
  }
}
