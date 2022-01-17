import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParcoursComponent } from './list/parcours.component';
import { ParcoursDetailComponent } from './detail/parcours-detail.component';
import { ParcoursUpdateComponent } from './update/parcours-update.component';
import { ParcoursDeleteDialogComponent } from './delete/parcours-delete-dialog.component';
import { ParcoursRoutingModule } from './route/parcours-routing.module';

@NgModule({
  imports: [SharedModule, ParcoursRoutingModule],
  declarations: [ParcoursComponent, ParcoursDetailComponent, ParcoursUpdateComponent, ParcoursDeleteDialogComponent],
  entryComponents: [ParcoursDeleteDialogComponent],
})
export class ParcoursModule {}
