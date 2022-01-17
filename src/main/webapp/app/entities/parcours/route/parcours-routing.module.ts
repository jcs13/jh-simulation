import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParcoursComponent } from '../list/parcours.component';
import { ParcoursDetailComponent } from '../detail/parcours-detail.component';
import { ParcoursUpdateComponent } from '../update/parcours-update.component';
import { ParcoursRoutingResolveService } from './parcours-routing-resolve.service';

const parcoursRoute: Routes = [
  {
    path: '',
    component: ParcoursComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParcoursDetailComponent,
    resolve: {
      parcours: ParcoursRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParcoursUpdateComponent,
    resolve: {
      parcours: ParcoursRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParcoursUpdateComponent,
    resolve: {
      parcours: ParcoursRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parcoursRoute)],
  exports: [RouterModule],
})
export class ParcoursRoutingModule {}
