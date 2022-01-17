import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EtapeTransitionComponent } from './list/etape-transition.component';
import { EtapeTransitionDetailComponent } from './detail/etape-transition-detail.component';
import { EtapeTransitionUpdateComponent } from './update/etape-transition-update.component';
import { EtapeTransitionDeleteDialogComponent } from './delete/etape-transition-delete-dialog.component';
import { EtapeTransitionRoutingModule } from './route/etape-transition-routing.module';

@NgModule({
  imports: [SharedModule, EtapeTransitionRoutingModule],
  declarations: [
    EtapeTransitionComponent,
    EtapeTransitionDetailComponent,
    EtapeTransitionUpdateComponent,
    EtapeTransitionDeleteDialogComponent,
  ],
  entryComponents: [EtapeTransitionDeleteDialogComponent],
})
export class EtapeTransitionModule {}
