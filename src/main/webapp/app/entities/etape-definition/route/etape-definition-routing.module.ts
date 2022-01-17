import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EtapeDefinitionComponent } from '../list/etape-definition.component';
import { EtapeDefinitionDetailComponent } from '../detail/etape-definition-detail.component';
import { EtapeDefinitionUpdateComponent } from '../update/etape-definition-update.component';
import { EtapeDefinitionRoutingResolveService } from './etape-definition-routing-resolve.service';

const etapeDefinitionRoute: Routes = [
  {
    path: '',
    component: EtapeDefinitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtapeDefinitionDetailComponent,
    resolve: {
      etapeDefinition: EtapeDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtapeDefinitionUpdateComponent,
    resolve: {
      etapeDefinition: EtapeDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtapeDefinitionUpdateComponent,
    resolve: {
      etapeDefinition: EtapeDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(etapeDefinitionRoute)],
  exports: [RouterModule],
})
export class EtapeDefinitionRoutingModule {}
