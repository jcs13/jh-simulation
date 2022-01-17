import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlocTransition, BlocTransition } from '../bloc-transition.model';
import { BlocTransitionService } from '../service/bloc-transition.service';

@Injectable({ providedIn: 'root' })
export class BlocTransitionRoutingResolveService implements Resolve<IBlocTransition> {
  constructor(protected service: BlocTransitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlocTransition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((blocTransition: HttpResponse<BlocTransition>) => {
          if (blocTransition.body) {
            return of(blocTransition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BlocTransition());
  }
}
