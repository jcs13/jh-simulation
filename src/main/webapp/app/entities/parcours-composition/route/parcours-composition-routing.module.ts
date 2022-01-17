import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParcoursCompositionComponent } from '../list/parcours-composition.component';
import { ParcoursCompositionDetailComponent } from '../detail/parcours-composition-detail.component';
import { ParcoursCompositionUpdateComponent } from '../update/parcours-composition-update.component';
import { ParcoursCompositionRoutingResolveService } from './parcours-composition-routing-resolve.service';

const parcoursCompositionRoute: Routes = [
  {
    path: '',
    component: ParcoursCompositionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParcoursCompositionDetailComponent,
    resolve: {
      parcoursComposition: ParcoursCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParcoursCompositionUpdateComponent,
    resolve: {
      parcoursComposition: ParcoursCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParcoursCompositionUpdateComponent,
    resolve: {
      parcoursComposition: ParcoursCompositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parcoursCompositionRoute)],
  exports: [RouterModule],
})
export class ParcoursCompositionRoutingModule {}
