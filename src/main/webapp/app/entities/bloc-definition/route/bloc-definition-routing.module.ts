import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlocDefinitionComponent } from '../list/bloc-definition.component';
import { BlocDefinitionDetailComponent } from '../detail/bloc-definition-detail.component';
import { BlocDefinitionUpdateComponent } from '../update/bloc-definition-update.component';
import { BlocDefinitionRoutingResolveService } from './bloc-definition-routing-resolve.service';

const blocDefinitionRoute: Routes = [
  {
    path: '',
    component: BlocDefinitionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlocDefinitionDetailComponent,
    resolve: {
      blocDefinition: BlocDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlocDefinitionUpdateComponent,
    resolve: {
      blocDefinition: BlocDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlocDefinitionUpdateComponent,
    resolve: {
      blocDefinition: BlocDefinitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blocDefinitionRoute)],
  exports: [RouterModule],
})
export class BlocDefinitionRoutingModule {}
