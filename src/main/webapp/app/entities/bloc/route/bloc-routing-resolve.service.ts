import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBloc, Bloc } from '../bloc.model';
import { BlocService } from '../service/bloc.service';

@Injectable({ providedIn: 'root' })
export class BlocRoutingResolveService implements Resolve<IBloc> {
  constructor(protected service: BlocService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBloc> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bloc: HttpResponse<Bloc>) => {
          if (bloc.body) {
            return of(bloc.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Bloc());
  }
}
