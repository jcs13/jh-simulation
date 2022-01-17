import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlocDetailComponent } from './bloc-detail.component';

describe('Bloc Management Detail Component', () => {
  let comp: BlocDetailComponent;
  let fixture: ComponentFixture<BlocDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlocDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bloc: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BlocDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BlocDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bloc on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bloc).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
