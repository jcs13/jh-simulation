import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffreComposition, OffreComposition } from '../offre-composition.model';
import { OffreCompositionService } from '../service/offre-composition.service';

@Injectable({ providedIn: 'root' })
export class OffreCompositionRoutingResolveService implements Resolve<IOffreComposition> {
  constructor(protected service: OffreCompositionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOffreComposition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((offreComposition: HttpResponse<OffreComposition>) => {
          if (offreComposition.body) {
            return of(offreComposition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OffreComposition());
  }
}
