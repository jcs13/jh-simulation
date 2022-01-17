import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EtapeComponent } from './list/etape.component';
import { EtapeDetailComponent } from './detail/etape-detail.component';
import { EtapeUpdateComponent } from './update/etape-update.component';
import { EtapeDeleteDialogComponent } from './delete/etape-delete-dialog.component';
import { EtapeRoutingModule } from './route/etape-routing.module';

@NgModule({
  imports: [SharedModule, EtapeRoutingModule],
  declarations: [EtapeComponent, EtapeDetailComponent, EtapeUpdateComponent, EtapeDeleteDialogComponent],
  entryComponents: [EtapeDeleteDialogComponent],
})
export class EtapeModule {}
