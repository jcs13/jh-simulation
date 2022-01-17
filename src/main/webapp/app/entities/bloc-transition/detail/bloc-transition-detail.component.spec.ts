import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlocTransitionDetailComponent } from './bloc-transition-detail.component';

describe('BlocTransition Management Detail Component', () => {
  let comp: BlocTransitionDetailComponent;
  let fixture: ComponentFixture<BlocTransitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlocTransitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ blocTransition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BlocTransitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BlocTransitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load blocTransition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.blocTransition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
