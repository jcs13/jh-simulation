import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BusinessUnitService } from '../service/business-unit.service';
import { IBusinessUnit, BusinessUnit } from '../business-unit.model';

import { BusinessUnitUpdateComponent } from './business-unit-update.component';

describe('BusinessUnit Management Update Component', () => {
  let comp: BusinessUnitUpdateComponent;
  let fixture: ComponentFixture<BusinessUnitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let businessUnitService: BusinessUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BusinessUnitUpdateComponent],
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
      .overrideTemplate(BusinessUnitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessUnitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    businessUnitService = TestBed.inject(BusinessUnitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const businessUnit: IBusinessUnit = { id: 456 };

      activatedRoute.data = of({ businessUnit });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(businessUnit));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BusinessUnit>>();
      const businessUnit = { id: 123 };
      jest.spyOn(businessUnitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessUnit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessUnit }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(businessUnitService.update).toHaveBeenCalledWith(businessUnit);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BusinessUnit>>();
      const businessUnit = new BusinessUnit();
      jest.spyOn(businessUnitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessUnit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessUnit }));
      saveSubject.complete();

      // THEN
      expect(businessUnitService.create).toHaveBeenCalledWith(businessUnit);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BusinessUnit>>();
      const businessUnit = { id: 123 };
      jest.spyOn(businessUnitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessUnit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(businessUnitService.update).toHaveBeenCalledWith(businessUnit);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
