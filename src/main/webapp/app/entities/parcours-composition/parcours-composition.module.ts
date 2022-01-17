import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParcoursCompositionComponent } from './list/parcours-composition.component';
import { ParcoursCompositionDetailComponent } from './detail/parcours-composition-detail.component';
import { ParcoursCompositionUpdateComponent } from './update/parcours-composition-update.component';
import { ParcoursCompositionDeleteDialogComponent } from './delete/parcours-composition-delete-dialog.component';
import { ParcoursCompositionRoutingModule } from './route/parcours-composition-routing.module';

@NgModule({
  imports: [SharedModule, ParcoursCompositionRoutingModule],
  declarations: [
    ParcoursCompositionComponent,
    ParcoursCompositionDetailComponent,
    ParcoursCompositionUpdateComponent,
    ParcoursCompositionDeleteDialogComponent,
  ],
  entryComponents: [ParcoursCompositionDeleteDialogComponent],
})
export class ParcoursCompositionModule {}
