import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParcoursDefinition, ParcoursDefinition } from '../parcours-definition.model';
import { ParcoursDefinitionService } from '../service/parcours-definition.service';

@Injectable({ providedIn: 'root' })
export class ParcoursDefinitionRoutingResolveService implements Resolve<IParcoursDefinition> {
  constructor(protected service: ParcoursDefinitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParcoursDefinition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parcoursDefinition: HttpResponse<ParcoursDefinition>) => {
          if (parcoursDefinition.body) {
            return of(parcoursDefinition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParcoursDefinition());
  }
}
