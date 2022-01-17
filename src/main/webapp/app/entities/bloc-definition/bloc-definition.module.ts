import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BlocDefinitionComponent } from './list/bloc-definition.component';
import { BlocDefinitionDetailComponent } from './detail/bloc-definition-detail.component';
import { BlocDefinitionUpdateComponent } from './update/bloc-definition-update.component';
import { BlocDefinitionDeleteDialogComponent } from './delete/bloc-definition-delete-dialog.component';
import { BlocDefinitionRoutingModule } from './route/bloc-definition-routing.module';

@NgModule({
  imports: [SharedModule, BlocDefinitionRoutingModule],
  declarations: [
    BlocDefinitionComponent,
    BlocDefinitionDetailComponent,
    BlocDefinitionUpdateComponent,
    BlocDefinitionDeleteDialogComponent,
  ],
  entryComponents: [BlocDefinitionDeleteDialogComponent],
})
export class BlocDefinitionModule {}
