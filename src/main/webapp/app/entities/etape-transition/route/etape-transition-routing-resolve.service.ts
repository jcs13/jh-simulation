import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtapeTransition, EtapeTransition } from '../etape-transition.model';
import { EtapeTransitionService } from '../service/etape-transition.service';

@Injectable({ providedIn: 'root' })
export class EtapeTransitionRoutingResolveService implements Resolve<IEtapeTransition> {
  constructor(protected service: EtapeTransitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEtapeTransition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((etapeTransition: HttpResponse<EtapeTransition>) => {
          if (etapeTransition.body) {
            return of(etapeTransition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EtapeTransition());
  }
}
