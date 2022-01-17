import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParcoursComposition, ParcoursComposition } from '../parcours-composition.model';
import { ParcoursCompositionService } from '../service/parcours-composition.service';

@Injectable({ providedIn: 'root' })
export class ParcoursCompositionRoutingResolveService implements Resolve<IParcoursComposition> {
  constructor(protected service: ParcoursCompositionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParcoursComposition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parcoursComposition: HttpResponse<ParcoursComposition>) => {
          if (parcoursComposition.body) {
            return of(parcoursComposition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParcoursComposition());
  }
}
