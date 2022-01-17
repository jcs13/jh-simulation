import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoursDefinitionDetailComponent } from './parcours-definition-detail.component';

describe('ParcoursDefinition Management Detail Component', () => {
  let comp: ParcoursDefinitionDetailComponent;
  let fixture: ComponentFixture<ParcoursDefinitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcoursDefinitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parcoursDefinition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParcoursDefinitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParcoursDefinitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parcoursDefinition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parcoursDefinition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
