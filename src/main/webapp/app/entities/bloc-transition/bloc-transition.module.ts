import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BlocTransitionComponent } from './list/bloc-transition.component';
import { BlocTransitionDetailComponent } from './detail/bloc-transition-detail.component';
import { BlocTransitionUpdateComponent } from './update/bloc-transition-update.component';
import { BlocTransitionDeleteDialogComponent } from './delete/bloc-transition-delete-dialog.component';
import { BlocTransitionRoutingModule } from './route/bloc-transition-routing.module';

@NgModule({
  imports: [SharedModule, BlocTransitionRoutingModule],
  declarations: [
    BlocTransitionComponent,
    BlocTransitionDetailComponent,
    BlocTransitionUpdateComponent,
    BlocTransitionDeleteDialogComponent,
  ],
  entryComponents: [BlocTransitionDeleteDialogComponent],
})
export class BlocTransitionModule {}
