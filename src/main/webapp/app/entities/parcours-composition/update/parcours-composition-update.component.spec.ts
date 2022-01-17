import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParcoursCompositionService } from '../service/parcours-composition.service';
import { IParcoursComposition, ParcoursComposition } from '../parcours-composition.model';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';
import { IParcoursDefinition } from 'app/entities/parcours-definition/parcours-definition.model';
import { ParcoursDefinitionService } from 'app/entities/parcours-definition/service/parcours-definition.service';

import { ParcoursCompositionUpdateComponent } from './parcours-composition-update.component';

describe('ParcoursComposition Management Update Component', () => {
  let comp: ParcoursCompositionUpdateComponent;
  let fixture: ComponentFixture<ParcoursCompositionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parcoursCompositionService: ParcoursCompositionService;
  let offreService: OffreService;
  let parcoursDefinitionService: ParcoursDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParcoursCompositionUpdateComponent],
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
      .overrideTemplate(ParcoursCompositionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParcoursCompositionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parcoursCompositionService = TestBed.inject(ParcoursCompositionService);
    offreService = TestBed.inject(OffreService);
    parcoursDefinitionService = TestBed.inject(ParcoursDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call offre query and add missing value', () => {
      const parcoursComposition: IParcoursComposition = { id: 456 };
      const offre: IOffre = { id: 25872 };
      parcoursComposition.offre = offre;

      const offreCollection: IOffre[] = [{ id: 26748 }];
      jest.spyOn(offreService, 'query').mockReturnValue(of(new HttpResponse({ body: offreCollection })));
      const expectedCollection: IOffre[] = [offre, ...offreCollection];
      jest.spyOn(offreService, 'addOffreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parcoursComposition });
      comp.ngOnInit();

      expect(offreService.query).toHaveBeenCalled();
      expect(offreService.addOffreToCollectionIfMissing).toHaveBeenCalledWith(offreCollection, offre);
      expect(comp.offresCollection).toEqual(expectedCollection);
    });

    it('Should call parcoursParent query and add missing value', () => {
      const parcoursComposition: IParcoursComposition = { id: 456 };
      const parcoursParent: IParcoursDefinition = { id: 88124 };
      parcoursComposition.parcoursParent = parcoursParent;

      const parcoursParentCollection: IParcoursDefinition[] = [{ id: 11514 }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursParentCollection })));
      const expectedCollection: IParcoursDefinition[] = [parcoursParent, ...parcoursParentCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parcoursComposition });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursParentCollection,
        parcoursParent
      );
      expect(comp.parcoursParentsCollection).toEqual(expectedCollection);
    });

    it('Should call parcoursChild query and add missing value', () => {
      const parcoursComposition: IParcoursComposition = { id: 456 };
      const parcoursChild: IParcoursDefinition = { id: 68136 };
      parcoursComposition.parcoursChild = parcoursChild;

      const parcoursChildCollection: IParcoursDefinition[] = [{ id: 31744 }];
      jest.spyOn(parcoursDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: parcoursChildCollection })));
      const expectedCollection: IParcoursDefinition[] = [parcoursChild, ...parcoursChildCollection];
      jest.spyOn(parcoursDefinitionService, 'addParcoursDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parcoursComposition });
      comp.ngOnInit();

      expect(parcoursDefinitionService.query).toHaveBeenCalled();
      expect(parcoursDefinitionService.addParcoursDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        parcoursChildCollection,
        parcoursChild
      );
      expect(comp.parcoursChildrenCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parcoursComposition: IParcoursComposition = { id: 456 };
      const offre: IOffre = { id: 76505 };
      parcoursComposition.offre = offre;
      const parcoursParent: IParcoursDefinition = { id: 50772 };
      parcoursComposition.parcoursParent = parcoursParent;
      const parcoursChild: IParcoursDefinition = { id: 84774 };
      parcoursComposition.parcoursChild = parcoursChild;

      activatedRoute.data = of({ parcoursComposition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(parcoursComposition));
      expect(comp.offresCollection).toContain(offre);
      expect(comp.parcoursParentsCollection).toContain(parcoursParent);
      expect(comp.parcoursChildrenCollection).toContain(parcoursChild);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParcoursComposition>>();
      const parcoursComposition = { id: 123 };
      jest.spyOn(parcoursCompositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcoursComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parcoursComposition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(parcoursCompositionService.update).toHaveBeenCalledWith(parcoursComposition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParcoursComposition>>();
      const parcoursComposition = new ParcoursComposition();
      jest.spyOn(parcoursCompositionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcoursComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parcoursComposition }));
      saveSubject.complete();

      // THEN
      expect(parcoursCompositionService.create).toHaveBeenCalledWith(parcoursComposition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParcoursComposition>>();
      const parcoursComposition = { id: 123 };
      jest.spyOn(parcoursCompositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcoursComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parcoursCompositionService.update).toHaveBeenCalledWith(parcoursComposition);
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
