import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParcoursDefinitionComponent } from '../list/parcours-definition.component';
import { ParcoursDefinitionDetailComponent } from '../detail/parcours-definition-detail.component';
import { ParcoursDefinitionUpdateComponent } from '../update/parcours-definition-update.component';
import { ParcoursDefinitionRoutingResolveService } from './parcours-definition-routing-resolve.service';

const parcoursDefinitionRoute: Routes = [
  {
    path: '',
    component: ParcoursDefinitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParcoursDefinitionDetailComponent,
    resolve: {
      parcoursDefinition: ParcoursDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParcoursDefinitionUpdateComponent,
    resolve: {
      parcoursDefinition: ParcoursDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParcoursDefinitionUpdateComponent,
    resolve: {
      parcoursDefinition: ParcoursDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parcoursDefinitionRoute)],
  exports: [RouterModule],
})
export class ParcoursDefinitionRoutingModule {}
