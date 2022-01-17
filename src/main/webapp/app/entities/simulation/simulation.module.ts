import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SimulationComponent } from './list/simulation.component';
import { SimulationDetailComponent } from './detail/simulation-detail.component';
import { SimulationUpdateComponent } from './update/simulation-update.component';
import { SimulationDeleteDialogComponent } from './delete/simulation-delete-dialog.component';
import { SimulationRoutingModule } from './route/simulation-routing.module';

@NgModule({
  imports: [SharedModule, SimulationRoutingModule],
  declarations: [SimulationComponent, SimulationDetailComponent, SimulationUpdateComponent, SimulationDeleteDialogComponent],
  entryComponents: [SimulationDeleteDialogComponent],
})
export class SimulationModule {}
