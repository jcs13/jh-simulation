import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtapeTransitionService } from '../service/etape-transition.service';
import { IEtapeTransition, EtapeTransition } from '../etape-transition.model';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';

import { EtapeTransitionUpdateComponent } from './etape-transition-update.component';

describe('EtapeTransition Management Update Component', () => {
  let comp: EtapeTransitionUpdateComponent;
  let fixture: ComponentFixture<EtapeTransitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etapeTransitionService: EtapeTransitionService;
  let parcoursDefinitionService: ParcoursDefinitionService;
  let etapeDefinitionService: EtapeDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtapeTransitionUpdateComponent],
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
      .overrideTemplate(EtapeTransitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtapeTransitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etapeTransitionService = TestBed.inject(EtapeTransitionService);
    parcoursDefinitionService = TestBed.inject(ParcoursDefinitionService);
    etapeDefinitionService = TestBed.inject(EtapeDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call parcoursDefinition query and add missing value', () => {
      const etapeTransition: IEtapeTransition = { id: 456 };
      const parcoursDefinition: IParcoursDefinition = { id: 4010 };
      etapeTransition.parcoursDefinition = parcoursDefinition;

      const parcoursDefinitionCollection: IParcoursDefinition[] = [{ id: 60301 }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursDefinitionCollection })));
      const expectedCollection: IParcoursDefinition[] = [parcoursDefinition, ...parcoursDefinitionCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etapeTransition });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursDefinitionCollection,
        parcoursDefinition
      );
      expect(comp.parcoursDefinitionsCollection).toEqual(expectedCollection);
    });

    it('Should call current query and add missing value', () => {
      const etapeTransition: IEtapeTransition = { id: 456 };
      const current: IEtapeDefinition = { id: 16445 };
      etapeTransition.current = current;

      const currentCollection: IEtapeDefinition[] = [{ id: 71839 }];
      jest.spyOn(etapeDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: currentCollection })));
      const expectedCollection: IEtapeDefinition[] = [current, ...currentCollection];
      jest.spyOn(etapeDefinitionService, 'addEtapeDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etapeTransition });
      comp.ngOnInit();

      expect(etapeDefinitionService.query).toHaveBeenCalled();
      expect(etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing).toHaveBeenCalledWith(currentCollection, current);
      expect(comp.currentsCollection).toEqual(expectedCollection);
    });

    it('Should call next query and add missing value', () => {
      const etapeTransition: IEtapeTransition = { id: 456 };
      const next: IEtapeDefinition = { id: 97575 };
      etapeTransition.next = next;

      const nextCollection: IEtapeDefinition[] = [{ id: 90631 }];
      jest.spyOn(etapeDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: nextCollection })));
      const expectedCollection: IEtapeDefinition[] = [next, ...nextCollection];
      jest.spyOn(etapeDefinitionService, 'addEtapeDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etapeTransition });
      comp.ngOnInit();

      expect(etapeDefinitionService.query).toHaveBeenCalled();
      expect(etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing).toHaveBeenCalledWith(nextCollection, next);
      expect(comp.nextsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etapeTransition: IEtapeTransition = { id: 456 };
      const parcoursDefinition: IParcoursDefinition = { id: 91570 };
      etapeTransition.parcoursDefinition = parcoursDefinition;
      const current: IEtapeDefinition = { id: 68119 };
      etapeTransition.current = current;
      const next: IEtapeDefinition = { id: 6776 };
      etapeTransition.next = next;

      activatedRoute.data = of({ etapeTransition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(etapeTransition));
      expect(comp.parcoursDefinitionsCollection).toContain(parcoursDefinition);
      expect(comp.currentsCollection).toContain(current);
      expect(comp.nextsCollection).toContain(next);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeTransition>>();
      const etapeTransition = { id: 123 };
      jest.spyOn(etapeTransitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etapeTransition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(etapeTransitionService.update).toHaveBeenCalledWith(etapeTransition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeTransition>>();
      const etapeTransition = new EtapeTransition();
      jest.spyOn(etapeTransitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etapeTransition }));
      saveSubject.complete();

      // THEN
      expect(etapeTransitionService.create).toHaveBeenCalledWith(etapeTransition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtapeTransition>>();
      const etapeTransition = { id: 123 };
      jest.spyOn(etapeTransitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etapeTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etapeTransitionService.update).toHaveBeenCalledWith(etapeTransition);
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

    describe('trackEtapeDefinitionById', () => {
      it('Should return tracked EtapeDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEtapeDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
