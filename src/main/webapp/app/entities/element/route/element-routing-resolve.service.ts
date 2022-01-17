import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IElement, Element } from '../element.model';
import { ElementService } from '../service/element.service';

@Injectable({ providedIn: 'root' })
export class ElementRoutingResolveService implements Resolve<IElement> {
  constructor(protected service: ElementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IElement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((element: HttpResponse<Element>) => {
          if (element.body) {
            return of(element.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Element());
  }
}
