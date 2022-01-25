import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OffreCompositionComponent } from './list/offre-composition.component';
import { OffreCompositionDetailComponent } from './detail/offre-composition-detail.component';
import { OffreCompositionUpdateComponent } from './update/offre-composition-update.component';
import { OffreCompositionDeleteDialogComponent } from './delete/offre-composition-delete-dialog.component';
import { OffreCompositionRoutingModule } from './route/offre-composition-routing.module';

@NgModule({
  imports: [SharedModule, OffreCompositionRoutingModule],
  declarations: [
    OffreCompositionComponent,
    OffreCompositionDetailComponent,
    OffreCompositionUpdateComponent,
    OffreCompositionDeleteDialogComponent,
  ],
  entryComponents: [OffreCompositionDeleteDialogComponent],
})
export class OffreCompositionModule {}
