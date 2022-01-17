import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtape, Etape } from '../etape.model';
import { EtapeService } from '../service/etape.service';

@Injectable({ providedIn: 'root' })
export class EtapeRoutingResolveService implements Resolve<IEtape> {
  constructor(protected service: EtapeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEtape> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((etape: HttpResponse<Etape>) => {
          if (etape.body) {
            return of(etape.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Etape());
  }
}
