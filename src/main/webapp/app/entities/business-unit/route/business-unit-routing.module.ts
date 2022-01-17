import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessUnitComponent } from '../list/business-unit.component';
import { BusinessUnitDetailComponent } from '../detail/business-unit-detail.component';
import { BusinessUnitUpdateComponent } from '../update/business-unit-update.component';
import { BusinessUnitRoutingResolveService } from './business-unit-routing-resolve.service';

const businessUnitRoute: Routes = [
  {
    path: '',
    component: BusinessUnitComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessUnitDetailComponent,
    resolve: {
      businessUnit: BusinessUnitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessUnitUpdateComponent,
    resolve: {
      businessUnit: BusinessUnitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessUnitUpdateComponent,
    resolve: {
      businessUnit: BusinessUnitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(businessUnitRoute)],
  exports: [RouterModule],
})
export class BusinessUnitRoutingModule {}
