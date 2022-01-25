jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OffreCompositionService } from '../service/offre-composition.service';

import { OffreCompositionDeleteDialogComponent } from './offre-composition-delete-dialog.component';

describe('OffreComposition Management Delete Component', () => {
  let comp: OffreCompositionDeleteDialogComponent;
  let fixture: ComponentFixture<OffreCompositionDeleteDialogComponent>;
  let service: OffreCompositionService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OffreCompositionDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(OffreCompositionDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OffreCompositionDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OffreCompositionService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
