import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISimulation, Simulation } from '../simulation.model';
import { SimulationService } from '../service/simulation.service';

@Injectable({ providedIn: 'root' })
export class SimulationRoutingResolveService implements Resolve<ISimulation> {
  constructor(protected service: SimulationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISimulation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((simulation: HttpResponse<Simulation>) => {
          if (simulation.body) {
            return of(simulation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Simulation());
  }
}
