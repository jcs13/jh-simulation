import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ElementDetailComponent } from './element-detail.component';

describe('Element Management Detail Component', () => {
  let comp: ElementDetailComponent;
  let fixture: ComponentFixture<ElementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ element: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ElementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ElementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load element on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.element).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
