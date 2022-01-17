import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessUnitComponent } from './list/business-unit.component';
import { BusinessUnitDetailComponent } from './detail/business-unit-detail.component';
import { BusinessUnitUpdateComponent } from './update/business-unit-update.component';
import { BusinessUnitDeleteDialogComponent } from './delete/business-unit-delete-dialog.component';
import { BusinessUnitRoutingModule } from './route/business-unit-routing.module';

@NgModule({
  imports: [SharedModule, BusinessUnitRoutingModule],
  declarations: [BusinessUnitComponent, BusinessUnitDetailComponent, BusinessUnitUpdateComponent, BusinessUnitDeleteDialogComponent],
  entryComponents: [BusinessUnitDeleteDialogComponent],
})
export class BusinessUnitModule {}
