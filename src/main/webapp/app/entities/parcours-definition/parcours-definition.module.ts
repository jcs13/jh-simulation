import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParcoursDefinitionComponent } from './list/parcours-definition.component';
import { ParcoursDefinitionDetailComponent } from './detail/parcours-definition-detail.component';
import { ParcoursDefinitionUpdateComponent } from './update/parcours-definition-update.component';
import { ParcoursDefinitionDeleteDialogComponent } from './delete/parcours-definition-delete-dialog.component';
import { ParcoursDefinitionRoutingModule } from './route/parcours-definition-routing.module';

@NgModule({
  imports: [SharedModule, ParcoursDefinitionRoutingModule],
  declarations: [
    ParcoursDefinitionComponent,
    ParcoursDefinitionDetailComponent,
    ParcoursDefinitionUpdateComponent,
    ParcoursDefinitionDeleteDialogComponent,
  ],
  entryComponents: [ParcoursDefinitionDeleteDialogComponent],
})
export class ParcoursDefinitionModule {}
