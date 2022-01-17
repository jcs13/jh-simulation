import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoursDetailComponent } from './parcours-detail.component';

describe('Parcours Management Detail Component', () => {
  let comp: ParcoursDetailComponent;
  let fixture: ComponentFixture<ParcoursDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcoursDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parcours: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParcoursDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParcoursDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parcours on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parcours).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
