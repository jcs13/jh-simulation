import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OffreService } from '../service/offre.service';
import { IOffre, Offre } from '../offre.model';
import { IBusinessUnit } from 'app/entities/business-unit/business-unit.model';
import { BusinessUnitService } from 'app/entities/business-unit/service/business-unit.service';

import { OffreUpdateComponent } from './offre-update.component';

describe('Offre Management Update Component', () => {
  let comp: OffreUpdateComponent;
  let fixture: ComponentFixture<OffreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offreService: OffreService;
  let businessUnitService: BusinessUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OffreUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OffreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offreService = TestBed.inject(OffreService);
    businessUnitService = TestBed.inject(BusinessUnitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BusinessUnit query and add missing value', () => {
      const offre: IOffre = { id: 456 };
      const businessUnit: IBusinessUnit = { id: 40002 };
      offre.businessUnit = businessUnit;

      const businessUnitCollection: IBusinessUnit[] = [{ id: 36592 }];
      jest.spyOn(businessUnitService, 'query').mockReturnValue(of(new HttpResponse({ body: businessUnitCollection })));
      const additionalBusinessUnits = [businessUnit];
      const expectedCollection: IBusinessUnit[] = [...additionalBusinessUnits, ...businessUnitCollection];
      jest.spyOn(businessUnitService, 'addBusinessUnitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      expect(businessUnitService.query).toHaveBeenCalled();
      expect(businessUnitService.addBusinessUnitToCollectionIfMissing).toHaveBeenCalledWith(
        businessUnitCollection,
        ...additionalBusinessUnits
      );
      expect(comp.businessUnitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offre: IOffre = { id: 456 };
      const businessUnit: IBusinessUnit = { id: 26527 };
      offre.businessUnit = businessUnit;

      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(offre));
      expect(comp.businessUnitsSharedCollection).toContain(businessUnit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Offre>>();
      const offre = { id: 123 };
      jest.spyOn(offreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offre }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(offreService.update).toHaveBeenCalledWith(offre);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Offre>>();
      const offre = new Offre();
      jest.spyOn(offreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offre }));
      saveSubject.complete();

      // THEN
      expect(offreService.create).toHaveBeenCalledWith(offre);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Offre>>();
      const offre = { id: 123 };
      jest.spyOn(offreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offreService.update).toHaveBeenCalledWith(offre);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBusinessUnitById', () => {
      it('Should return tracked BusinessUnit primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBusinessUnitById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
