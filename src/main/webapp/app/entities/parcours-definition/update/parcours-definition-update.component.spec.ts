import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParcoursDefinitionService } from '../service/parcours-definition.service';
import { IParcoursDefinition, ParcoursDefinition } from '../parcours-definition.model';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';

import { ParcoursDefinitionUpdateComponent } from './parcours-definition-update.component';

describe('ParcoursDefinition Management Update Component', () => {
  let comp: ParcoursDefinitionUpdateComponent;
  let fixture: ComponentFixture<ParcoursDefinitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parcoursDefinitionService: ParcoursDefinitionService;
  let offreService: OffreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParcoursDefinitionUpdateComponent],
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
      .overrideTemplate(ParcoursDefinitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParcoursDefinitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parcoursDefinitionService = TestBed.inject(ParcoursDefinitionService);
    offreService = TestBed.inject(OffreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Offre query and add missing value', () => {
      const parcoursDefinition: IParcoursDefinition = { id: 456 };
      const offre: IOffre = { id: 98099 };
      parcoursDefinition.offre = offre;

      const offreCollection: IOffre[] = [{ id: 16048 }];
      jest.spyOn(offreService, 'query').mockReturnValue(of(new HttpResponse({ body: offreCollection })));
      const additionalOffres = [offre];
      const expectedCollection: IOffre[] = [...additionalOffres, ...offreCollection];
      jest.spyOn(offreService, 'addOffreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parcoursDefinition });
      comp.ngOnInit();

      expect(offreService.query).toHaveBeenCalled();
      expect(offreService.addOffreToCollectionIfMissing).toHaveBeenCalledWith(offreCollection, ...additionalOffres);
      expect(comp.offresSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parcoursDefinition: IParcoursDefinition = { id: 456 };
      const offre: IOffre = { id: 45048 };
      parcoursDefinition.offre = offre;

      activatedRoute.data = of({ parcoursDefinition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(parcoursDefinition));
      expect(comp.offresSharedCollection).toContain(offre);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParcoursDefinition>>();
      const parcoursDefinition = { id: 123 };
      jest.spyOn(parcoursDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcoursDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parcoursDefinition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(parcoursDefinitionService.update).toHaveBeenCalledWith(parcoursDefinition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParcoursDefinition>>();
      const parcoursDefinition = new ParcoursDefinition();
      jest.spyOn(parcoursDefinitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcoursDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parcoursDefinition }));
      saveSubject.complete();

      // THEN
      expect(parcoursDefinitionService.create).toHaveBeenCalledWith(parcoursDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParcoursDefinition>>();
      const parcoursDefinition = { id: 123 };
      jest.spyOn(parcoursDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parcoursDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parcoursDefinitionService.update).toHaveBeenCalledWith(parcoursDefinition);
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
  });
});
