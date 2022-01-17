import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlocDefinition, BlocDefinition } from '../bloc-definition.model';
import { BlocDefinitionService } from '../service/bloc-definition.service';

@Injectable({ providedIn: 'root' })
export class BlocDefinitionRoutingResolveService implements Resolve<IBlocDefinition> {
  constructor(protected service: BlocDefinitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlocDefinition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((blocDefinition: HttpResponse<BlocDefinition>) => {
          if (blocDefinition.body) {
            return of(blocDefinition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BlocDefinition());
  }
}
