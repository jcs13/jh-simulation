import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusinessUnit, BusinessUnit } from '../business-unit.model';
import { BusinessUnitService } from '../service/business-unit.service';

@Injectable({ providedIn: 'root' })
export class BusinessUnitRoutingResolveService implements Resolve<IBusinessUnit> {
  constructor(protected service: BusinessUnitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBusinessUnit> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((businessUnit: HttpResponse<BusinessUnit>) => {
          if (businessUnit.body) {
            return of(businessUnit.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BusinessUnit());
  }
}
