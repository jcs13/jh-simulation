import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OffreCompositionComponent } from '../list/offre-composition.component';
import { OffreCompositionDetailComponent } from '../detail/offre-composition-detail.component';
import { OffreCompositionUpdateComponent } from '../update/offre-composition-update.component';
import { OffreCompositionRoutingResolveService } from './offre-composition-routing-resolve.service';

const offreCompositionRoute: Routes = [
  {
    path: '',
    component: OffreCompositionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OffreCompositionDetailComponent,
    resolve: {
      offreComposition: OffreCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OffreCompositionUpdateComponent,
    resolve: {
      offreComposition: OffreCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OffreCompositionUpdateComponent,
    resolve: {
      offreComposition: OffreCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(offreCompositionRoute)],
  exports: [RouterModule],
})
export class OffreCompositionRoutingModule {}
