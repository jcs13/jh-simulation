import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EtapeComponent } from '../list/etape.component';
import { EtapeDetailComponent } from '../detail/etape-detail.component';
import { EtapeUpdateComponent } from '../update/etape-update.component';
import { EtapeRoutingResolveService } from './etape-routing-resolve.service';

const etapeRoute: Routes = [
  {
    path: '',
    component: EtapeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtapeDetailComponent,
    resolve: {
      etape: EtapeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtapeUpdateComponent,
    resolve: {
      etape: EtapeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtapeUpdateComponent,
    resolve: {
      etape: EtapeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(etapeRoute)],
  exports: [RouterModule],
})
export class EtapeRoutingModule {}
