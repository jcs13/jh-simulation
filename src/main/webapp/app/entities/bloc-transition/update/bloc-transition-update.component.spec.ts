import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlocTransitionService } from '../service/bloc-transition.service';
import { IBlocTransition, BlocTransition } from '../bloc-transition.model';
import { IEtapeDefinition } from 'app/entities/etape-definition/etape-definition.model';
import { EtapeDefinitionService } from 'app/entities/etape-definition/service/etape-definition.service';
import { IBlocDefinition } from 'app/entities/bloc-definition/bloc-definition.model';
import { BlocDefinitionService } from 'app/entities/bloc-definition/service/bloc-definition.service';

import { BlocTransitionUpdateComponent } from './bloc-transition-update.component';

describe('BlocTransition Management Update Component', () => {
  let comp: BlocTransitionUpdateComponent;
  let fixture: ComponentFixture<BlocTransitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blocTransitionService: BlocTransitionService;
  let etapeDefinitionService: EtapeDefinitionService;
  let blocDefinitionService: BlocDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlocTransitionUpdateComponent],
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
      .overrideTemplate(BlocTransitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlocTransitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blocTransitionService = TestBed.inject(BlocTransitionService);
    etapeDefinitionService = TestBed.inject(EtapeDefinitionService);
    blocDefinitionService = TestBed.inject(BlocDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call etapeDefinition query and add missing value', () => {
      const blocTransition: IBlocTransition = { id: 456 };
      const etapeDefinition: IEtapeDefinition = { id: 70779 };
      blocTransition.etapeDefinition = etapeDefinition;

      const etapeDefinitionCollection: IEtapeDefinition[] = [{ id: 35789 }];
      jest.spyOn(etapeDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: etapeDefinitionCollection })));
      const expectedCollection: IEtapeDefinition[] = [etapeDefinition, ...etapeDefinitionCollection];
      jest.spyOn(etapeDefinitionService, 'addEtapeDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blocTransition });
      comp.ngOnInit();

      expect(etapeDefinitionService.query).toHaveBeenCalled();
      expect(etapeDefinitionService.addEtapeDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        etapeDefinitionCollection,
        etapeDefinition
      );
      expect(comp.etapeDefinitionsCollection).toEqual(expectedCollection);
    });

    it('Should call current query and add missing value', () => {
      const blocTransition: IBlocTransition = { id: 456 };
      const current: IBlocDefinition = { id: 23217 };
      blocTransition.current = current;

      const currentCollection: IBlocDefinition[] = [{ id: 54949 }];
      jest.spyOn(blocDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: currentCollection })));
      const expectedCollection: IBlocDefinition[] = [current, ...currentCollection];
      jest.spyOn(blocDefinitionService, 'addBlocDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blocTransition });
      comp.ngOnInit();

      expect(blocDefinitionService.query).toHaveBeenCalled();
      expect(blocDefinitionService.addBlocDefinitionToCollectionIfMissing).toHaveBeenCalledWith(currentCollection, current);
      expect(comp.currentsCollection).toEqual(expectedCollection);
    });

    it('Should call next query and add missing value', () => {
      const blocTransition: IBlocTransition = { id: 456 };
      const next: IBlocDefinition = { id: 90743 };
      blocTransition.next = next;

      const nextCollection: IBlocDefinition[] = [{ id: 999 }];
      jest.spyOn(blocDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: nextCollection })));
      const expectedCollection: IBlocDefinition[] = [next, ...nextCollection];
      jest.spyOn(blocDefinitionService, 'addBlocDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blocTransition });
      comp.ngOnInit();

      expect(blocDefinitionService.query).toHaveBeenCalled();
      expect(blocDefinitionService.addBlocDefinitionToCollectionIfMissing).toHaveBeenCalledWith(nextCollection, next);
      expect(comp.nextsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const blocTransition: IBlocTransition = { id: 456 };
      const etapeDefinition: IEtapeDefinition = { id: 72800 };
      blocTransition.etapeDefinition = etapeDefinition;
      const current: IBlocDefinition = { id: 74008 };
      blocTransition.current = current;
      const next: IBlocDefinition = { id: 38866 };
      blocTransition.next = next;

      activatedRoute.data = of({ blocTransition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(blocTransition));
      expect(comp.etapeDefinitionsCollection).toContain(etapeDefinition);
      expect(comp.currentsCollection).toContain(current);
      expect(comp.nextsCollection).toContain(next);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlocTransition>>();
      const blocTransition = { id: 123 };
      jest.spyOn(blocTransitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blocTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blocTransition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(blocTransitionService.update).toHaveBeenCalledWith(blocTransition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlocTransition>>();
      const blocTransition = new BlocTransition();
      jest.spyOn(blocTransitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blocTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blocTransition }));
      saveSubject.complete();

      // THEN
      expect(blocTransitionService.create).toHaveBeenCalledWith(blocTransition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlocTransition>>();
      const blocTransition = { id: 123 };
      jest.spyOn(blocTransitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blocTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blocTransitionService.update).toHaveBeenCalledWith(blocTransition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEtapeDefinitionById', () => {
      it('Should return tracked EtapeDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEtapeDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBlocDefinitionById', () => {
      it('Should return tracked BlocDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBlocDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
