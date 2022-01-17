import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BlocComponent } from './list/bloc.component';
import { BlocDetailComponent } from './detail/bloc-detail.component';
import { BlocUpdateComponent } from './update/bloc-update.component';
import { BlocDeleteDialogComponent } from './delete/bloc-delete-dialog.component';
import { BlocRoutingModule } from './route/bloc-routing.module';

@NgModule({
  imports: [SharedModule, BlocRoutingModule],
  declarations: [BlocComponent, BlocDetailComponent, BlocUpdateComponent, BlocDeleteDialogComponent],
  entryComponents: [BlocDeleteDialogComponent],
})
export class BlocModule {}
