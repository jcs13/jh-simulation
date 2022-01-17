import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtapeService } from '../service/etape.service';
import { IEtape, Etape } from '../etape.model';
import { IParcours } from 'app/entities/parcours/parcours.model';
import { ParcoursService } from 'app/entities/parcours/service/parcours.service';

import { EtapeUpdateComponent } from './etape-update.component';

describe('Etape Management Update Component', () => {
  let comp: EtapeUpdateComponent;
  let fixture: ComponentFixture<EtapeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etapeService: EtapeService;
  let parcoursService: ParcoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtapeUpdateComponent],
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
      .overrideTemplate(EtapeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtapeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etapeService = TestBed.inject(EtapeService);
    parcoursService = TestBed.inject(ParcoursService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Parcours query and add missing value', () => {
      const etape: IEtape = { id: 456 };
      const parcours: IParcours = { id: 28521 };
      etape.parcours = parcours;

      const parcoursCollection: IParcours[] = [{ id: 80301 }];
      jest.spyOn(parcoursService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursCollection })));
      const additionalParcours = [parcours];
      const expectedCollection: IParcours[] = [...additionalParcours, ...parcoursCollection];
      jest.spyOn(parcoursService, 'addParcoursToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etape });
      comp.ngOnInit();

      expect(parcoursService.query).toHaveBeenCalled();
      expect(parcoursService.addParcoursToCollectionIfMissing).toHaveBeenCalledWith(parcoursCollection, ...additionalParcours);
      expect(comp.parcoursSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etape: IEtape = { id: 456 };
      const parcours: IParcours = { id: 68457 };
      etape.parcours = parcours;

      activatedRoute.data = of({ etape });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(etape));
      expect(comp.parcoursSharedCollection).toContain(parcours);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etape>>();
      const etape = { id: 123 };
      jest.spyOn(etapeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etape });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etape }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(etapeService.update).toHaveBeenCalledWith(etape);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etape>>();
      const etape = new Etape();
      jest.spyOn(etapeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etape });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etape }));
      saveSubject.complete();

      // THEN
      expect(etapeService.create).toHaveBeenCalledWith(etape);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etape>>();
      const etape = { id: 123 };
      jest.spyOn(etapeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etape });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etapeService.update).toHaveBeenCalledWith(etape);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackParcoursById', () => {
      it('Should return tracked Parcours primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackParcoursById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
