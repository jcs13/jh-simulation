import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'simulation',
        data: { pageTitle: 'Simulations' },
        loadChildren: () => import('./simulation/simulation.module').then(m => m.SimulationModule),
      },
      {
        path: 'parcours',
        data: { pageTitle: 'Parcours' },
        loadChildren: () => import('./parcours/parcours.module').then(m => m.ParcoursModule),
      },
      {
        path: 'etape',
        data: { pageTitle: 'Etapes' },
        loadChildren: () => import('./etape/etape.module').then(m => m.EtapeModule),
      },
      {
        path: 'bloc',
        data: { pageTitle: 'Blocs' },
        loadChildren: () => import('./bloc/bloc.module').then(m => m.BlocModule),
      },
      {
        path: 'business-unit',
        data: { pageTitle: 'BusinessUnits' },
        loadChildren: () => import('./business-unit/business-unit.module').then(m => m.BusinessUnitModule),
      },
      {
        path: 'offre',
        data: { pageTitle: 'Offres' },
        loadChildren: () => import('./offre/offre.module').then(m => m.OffreModule),
      },
      {
        path: 'parcours-composition',
        data: { pageTitle: 'ParcoursCompositions' },
        loadChildren: () => import('./parcours-composition/parcours-composition.module').then(m => m.ParcoursCompositionModule),
      },
      {
        path: 'parcours-definition',
        data: { pageTitle: 'ParcoursDefinitions' },
        loadChildren: () => import('./parcours-definition/parcours-definition.module').then(m => m.ParcoursDefinitionModule),
      },
      {
        path: 'etape-definition',
        data: { pageTitle: 'EtapeDefinitions' },
        loadChildren: () => import('./etape-definition/etape-definition.module').then(m => m.EtapeDefinitionModule),
      },
      {
        path: 'etape-transition',
        data: { pageTitle: 'EtapeTransitions' },
        loadChildren: () => import('./etape-transition/etape-transition.module').then(m => m.EtapeTransitionModule),
      },
      {
        path: 'bloc-definition',
        data: { pageTitle: 'BlocDefinitions' },
        loadChildren: () => import('./bloc-definition/bloc-definition.module').then(m => m.BlocDefinitionModule),
      },
      {
        path: 'element',
        data: { pageTitle: 'Elements' },
        loadChildren: () => import('./element/element.module').then(m => m.ElementModule),
      },
      {
        path: 'bloc-transition',
        data: { pageTitle: 'BlocTransitions' },
        loadChildren: () => import('./bloc-transition/bloc-transition.module').then(m => m.BlocTransitionModule),
      },
      {
        path: 'offre-composition',
        data: { pageTitle: 'OffreCompositions' },
        loadChildren: () => import('./offre-composition/offre-composition.module').then(m => m.OffreCompositionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
