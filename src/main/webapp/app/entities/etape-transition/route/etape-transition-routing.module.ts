import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EtapeTransitionComponent } from '../list/etape-transition.component';
import { EtapeTransitionDetailComponent } from '../detail/etape-transition-detail.component';
import { EtapeTransitionUpdateComponent } from '../update/etape-transition-update.component';
import { EtapeTransitionRoutingResolveService } from './etape-transition-routing-resolve.service';

const etapeTransitionRoute: Routes = [
  {
    path: '',
    component: EtapeTransitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtapeTransitionDetailComponent,
    resolve: {
      etapeTransition: EtapeTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtapeTransitionUpdateComponent,
    resolve: {
      etapeTransition: EtapeTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtapeTransitionUpdateComponent,
    resolve: {
      etapeTransition: EtapeTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(etapeTransitionRoute)],
  exports: [RouterModule],
})
export class EtapeTransitionRoutingModule {}
