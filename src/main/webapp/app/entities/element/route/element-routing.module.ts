import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ElementComponent } from '../list/element.component';
import { ElementDetailComponent } from '../detail/element-detail.component';
import { ElementUpdateComponent } from '../update/element-update.component';
import { ElementRoutingResolveService } from './element-routing-resolve.service';

const elementRoute: Routes = [
  {
    path: '',
    component: ElementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ElementDetailComponent,
    resolve: {
      element: ElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ElementUpdateComponent,
    resolve: {
      element: ElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ElementUpdateComponent,
    resolve: {
      element: ElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(elementRoute)],
  exports: [RouterModule],
})
export class ElementRoutingModule {}
