import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ParcoursCompositionService } from '../service/parcours-composition.service';

import { ParcoursCompositionComponent } from './parcours-composition.component';

describe('ParcoursComposition Management Component', () => {
  let comp: ParcoursCompositionComponent;
  let fixture: ComponentFixture<ParcoursCompositionComponent>;
  let service: ParcoursCompositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ParcoursCompositionComponent],
    })
      .overrideTemplate(ParcoursCompositionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParcoursCompositionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParcoursCompositionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.parcoursCompositions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
