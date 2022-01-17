import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ElementComponent } from './list/element.component';
import { ElementDetailComponent } from './detail/element-detail.component';
import { ElementUpdateComponent } from './update/element-update.component';
import { ElementDeleteDialogComponent } from './delete/element-delete-dialog.component';
import { ElementRoutingModule } from './route/element-routing.module';

@NgModule({
  imports: [SharedModule, ElementRoutingModule],
  declarations: [ElementComponent, ElementDetailComponent, ElementUpdateComponent, ElementDeleteDialogComponent],
  entryComponents: [ElementDeleteDialogComponent],
})
export class ElementModule {}
