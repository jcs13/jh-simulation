import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OffreCompositionService } from '../service/offre-composition.service';
import { IOffreComposition, OffreComposition } from '../offre-composition.model';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';

import { OffreCompositionUpdateComponent } from './offre-composition-update.component';

describe('OffreComposition Management Update Component', () => {
  let comp: OffreCompositionUpdateComponent;
  let fixture: ComponentFixture<OffreCompositionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offreCompositionService: OffreCompositionService;
  let offreService: OffreService;
  let parcoursDefinitionService: ParcoursDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OffreCompositionUpdateComponent],
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
      .overrideTemplate(OffreCompositionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffreCompositionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offreCompositionService = TestBed.inject(OffreCompositionService);
    offreService = TestBed.inject(OffreService);
    parcoursDefinitionService = TestBed.inject(ParcoursDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call offre query and add missing value', () => {
      const offreComposition: IOffreComposition = { id: 456 };
      const offre: IOffre = { id: 67213 };
      offreComposition.offre = offre;

      const offreCollection: IOffre[] = [{ id: 79596 }];
      jest.spyOn(offreService, 'query').mockReturnValue(of(new HttpResponse({ body: offreCollection })));
      const expectedCollection: IOffre[] = [offre, ...offreCollection];
      jest.spyOn(offreService, 'addOffreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offreComposition });
      comp.ngOnInit();

      expect(offreService.query).toHaveBeenCalled();
      expect(offreService.addOffreToCollectionIfMissing).toHaveBeenCalledWith(offreCollection, offre);
      expect(comp.offresCollection).toEqual(expectedCollection);
    });

    it('Should call parcoursParent query and add missing value', () => {
      const offreComposition: IOffreComposition = { id: 456 };
      const parcoursParent: IParcoursDefinition = { id: 27558 };
      offreComposition.parcoursParent = parcoursParent;

      const parcoursParentCollection: IParcoursDefinition[] = [{ id: 88857 }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursParentCollection })));
      const expectedCollection: IParcoursDefinition[] = [parcoursParent, ...parcoursParentCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offreComposition });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursParentCollection,
        parcoursParent
      );
      expect(comp.parcoursParentsCollection).toEqual(expectedCollection);
    });

    it('Should call parcoursChild query and add missing value', () => {
      const offreComposition: IOffreComposition = { id: 456 };
      const parcoursChild: IParcoursDefinition = { id: 79857 };
      offreComposition.parcoursChild = parcoursChild;

      const parcoursChildCollection: IParcoursDefinition[] = [{ id: 67821 }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursChildCollection })));
      const expectedCollection: IParcoursDefinition[] = [parcoursChild, ...parcoursChildCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offreComposition });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursChildCollection,
        parcoursChild
      );
      expect(comp.parcoursChildrenCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offreComposition: IOffreComposition = { id: 456 };
      const offre: IOffre = { id: 66896 };
      offreComposition.offre = offre;
      const parcoursParent: IParcoursDefinition = { id: 85930 };
      offreComposition.parcoursParent = parcoursParent;
      const parcoursChild: IParcoursDefinition = { id: 51799 };
      offreComposition.parcoursChild = parcoursChild;

      activatedRoute.data = of({ offreComposition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(offreComposition));
      expect(comp.offresCollection).toContain(offre);
      expect(comp.parcoursParentsCollection).toContain(parcoursParent);
      expect(comp.parcoursChildrenCollection).toContain(parcoursChild);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OffreComposition>>();
      const offreComposition = { id: 123 };
      jest.spyOn(offreCompositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offreComposition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(offreCompositionService.update).toHaveBeenCalledWith(offreComposition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OffreComposition>>();
      const offreComposition = new OffreComposition();
      jest.spyOn(offreCompositionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offreComposition }));
      saveSubject.complete();

      // THEN
      expect(offreCompositionService.create).toHaveBeenCalledWith(offreComposition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OffreComposition>>();
      const offreComposition = { id: 123 };
      jest.spyOn(offreCompositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offreCompositionService.update).toHaveBeenCalledWith(offreComposition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOffreById', () => {
      it('Should return tracked Offre primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOffreById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackParcoursDefinitionById', () => {
      it('Should return tracked ParcoursDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackParcoursDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
