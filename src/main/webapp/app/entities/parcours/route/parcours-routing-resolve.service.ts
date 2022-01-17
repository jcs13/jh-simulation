import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParcours, Parcours } from '../parcours.model';
import { ParcoursService } from '../service/parcours.service';

@Injectable({ providedIn: 'root' })
export class ParcoursRoutingResolveService implements Resolve<IParcours> {
  constructor(protected service: ParcoursService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParcours> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parcours: HttpResponse<Parcours>) => {
          if (parcours.body) {
            return of(parcours.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Parcours());
  }
}
