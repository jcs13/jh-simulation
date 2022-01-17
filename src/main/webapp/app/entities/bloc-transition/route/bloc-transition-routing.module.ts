import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlocTransitionComponent } from '../list/bloc-transition.component';
import { BlocTransitionDetailComponent } from '../detail/bloc-transition-detail.component';
import { BlocTransitionUpdateComponent } from '../update/bloc-transition-update.component';
import { BlocTransitionRoutingResolveService } from './bloc-transition-routing-resolve.service';

const blocTransitionRoute: Routes = [
  {
    path: '',
    component: BlocTransitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlocTransitionDetailComponent,
    resolve: {
      blocTransition: BlocTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlocTransitionUpdateComponent,
    resolve: {
      blocTransition: BlocTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlocTransitionUpdateComponent,
    resolve: {
      blocTransition: BlocTransitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blocTransitionRoute)],
  exports: [RouterModule],
})
export class BlocTransitionRoutingModule {}
