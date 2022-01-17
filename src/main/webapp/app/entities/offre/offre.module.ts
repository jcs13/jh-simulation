import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OffreComponent } from './list/offre.component';
import { OffreDetailComponent } from './detail/offre-detail.component';
import { OffreUpdateComponent } from './update/offre-update.component';
import { OffreDeleteDialogComponent } from './delete/offre-delete-dialog.component';
import { OffreRoutingModule } from './route/offre-routing.module';

@NgModule({
  imports: [SharedModule, OffreRoutingModule],
  declarations: [OffreComponent, OffreDetailComponent, OffreUpdateComponent, OffreDeleteDialogComponent],
  entryComponents: [OffreDeleteDialogComponent],
})
export class OffreModule {}
