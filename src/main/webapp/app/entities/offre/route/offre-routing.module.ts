import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OffreComponent } from '../list/offre.component';
import { OffreDetailComponent } from '../detail/offre-detail.component';
import { OffreUpdateComponent } from '../update/offre-update.component';
import { OffreRoutingResolveService } from './offre-routing-resolve.service';

const offreRoute: Routes = [
  {
    path: '',
    component: OffreComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OffreDetailComponent,
    resolve: {
      offre: OffreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OffreUpdateComponent,
    resolve: {
      offre: OffreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OffreUpdateComponent,
    resolve: {
      offre: OffreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(offreRoute)],
  exports: [RouterModule],
})
export class OffreRoutingModule {}
