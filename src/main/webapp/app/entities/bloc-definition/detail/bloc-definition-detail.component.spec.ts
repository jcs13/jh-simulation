import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlocDefinitionDetailComponent } from './bloc-definition-detail.component';

describe('BlocDefinition Management Detail Component', () => {
  let comp: BlocDefinitionDetailComponent;
  let fixture: ComponentFixture<BlocDefinitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlocDefinitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ blocDefinition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BlocDefinitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BlocDefinitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load blocDefinition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.blocDefinition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
