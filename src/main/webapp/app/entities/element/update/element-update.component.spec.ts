import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ElementService } from '../service/element.service';
import { IElement, Element } from '../element.model';

import { ElementUpdateComponent } from './element-update.component';

describe('Element Management Update Component', () => {
  let comp: ElementUpdateComponent;
  let fixture: ComponentFixture<ElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let elementService: ElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ElementUpdateComponent],
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
      .overrideTemplate(ElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    elementService = TestBed.inject(ElementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const element: IElement = { id: 456 };

      activatedRoute.data = of({ element });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(element));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Element>>();
      const element = { id: 123 };
      jest.spyOn(elementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ element });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: element }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(elementService.update).toHaveBeenCalledWith(element);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Element>>();
      const element = new Element();
      jest.spyOn(elementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ element });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: element }));
      saveSubject.complete();

      // THEN
      expect(elementService.create).toHaveBeenCalledWith(element);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Element>>();
      const element = { id: 123 };
      jest.spyOn(elementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ element });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(elementService.update).toHaveBeenCalledWith(element);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
