import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlocComponent } from '../list/bloc.component';
import { BlocDetailComponent } from '../detail/bloc-detail.component';
import { BlocUpdateComponent } from '../update/bloc-update.component';
import { BlocRoutingResolveService } from './bloc-routing-resolve.service';

const blocRoute: Routes = [
  {
    path: '',
    component: BlocComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlocDetailComponent,
    resolve: {
      bloc: BlocRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlocUpdateComponent,
    resolve: {
      bloc: BlocRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlocUpdateComponent,
    resolve: {
      bloc: BlocRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blocRoute)],
  exports: [RouterModule],
})
export class BlocRoutingModule {}
