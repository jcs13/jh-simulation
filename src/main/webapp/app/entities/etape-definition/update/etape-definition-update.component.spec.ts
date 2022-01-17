import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtapeDefinitionService } from '../service/etape-definition.service';
import { IEtapeDefinition, EtapeDefinition } from '../etape-definition.model';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';

import { EtapeDefinitionUpdateComponent } from './etape-definition-update.component';

describe('EtapeDefinition Management Update Component', () => {
  let comp: EtapeDefinitionUpdateComponent;
  let fixture: ComponentFixture<EtapeDefinitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etapeDefinitionService: EtapeDefinitionService;
  let parcoursDefinitionService: ParcoursDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtapeDefinitionUpdateComponent],
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
      .overrideTemplate(EtapeDefinitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtapeDefinitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etapeDefinitionService = TestBed.inject(EtapeDefinitionService);
    parcoursDefinitionService = TestBed.inject(ParcoursDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ParcoursDefinition query and add missing value', () => {
      const etapeDefinition: IEtapeDefinition = { id: 456 };
      const parcoursDefinition: IParcoursDefinition = { id: 62673 };
      etapeDefinition.parcoursDefinition = parcoursDefinition;

      const parcoursDefinitionCollection: IParcoursDefinition[] = [{ id: 3835 }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursDefinitionCollection })));
      const additionalParcoursDefinitions = [parcoursDefinition];
      const expectedCollection: IParcoursDefinition[] = [...additionalParcoursDefinitions, ...parcoursDefinitionCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etapeDefinition });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursDefinitionCollection,
        ...additionalParcoursDefinitions
      );
      expect(comp.parcoursDefinitionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etapeDefinition: IEtapeDefinition = { id: 456 };
      const parcoursDefinition: IParcoursDefinition = { id: 58954 };
      etapeDefinition.parcoursDefinition = parcoursDefinition;

      activatedRoute.data = of({ etapeDefinition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(etapeDefinition));
      expect(comp.parcoursDefinitionsSharedCollection).toContain(parcoursDefinition);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeDefinition>>();
      const etapeDefinition = { id: 123 };
      jest.spyOn(etapeDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etapeDefinition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(etapeDefinitionService.update).toHaveBeenCalledWith(etapeDefinition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeDefinition>>();
      const etapeDefinition = new EtapeDefinition();
      jest.spyOn(etapeDefinitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etapeDefinition }));
      saveSubject.complete();

      // THEN
      expect(etapeDefinitionService.create).toHaveBeenCalledWith(etapeDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeDefinition>>();
      const etapeDefinition = { id: 123 };
      jest.spyOn(etapeDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etapeDefinitionService.update).toHaveBeenCalledWith(etapeDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackParcoursDefinitionById', () => {
      it('Should return tracked ParcoursDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackParcoursDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
