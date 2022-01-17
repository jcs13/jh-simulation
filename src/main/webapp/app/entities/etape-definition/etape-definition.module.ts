import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EtapeDefinitionComponent } from './list/etape-definition.component';
import { EtapeDefinitionDetailComponent } from './detail/etape-definition-detail.component';
import { EtapeDefinitionUpdateComponent } from './update/etape-definition-update.component';
import { EtapeDefinitionDeleteDialogComponent } from './delete/etape-definition-delete-dialog.component';
import { EtapeDefinitionRoutingModule } from './route/etape-definition-routing.module';

@NgModule({
  imports: [SharedModule, EtapeDefinitionRoutingModule],
  declarations: [
    EtapeDefinitionComponent,
    EtapeDefinitionDetailComponent,
    EtapeDefinitionUpdateComponent,
    EtapeDefinitionDeleteDialogComponent,
  ],
  entryComponents: [EtapeDefinitionDeleteDialogComponent],
})
export class EtapeDefinitionModule {}
