import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OffreCompositionService } from '../service/offre-composition.service';

import { OffreCompositionComponent } from './offre-composition.component';

describe('OffreComposition Management Component', () => {
  let comp: OffreCompositionComponent;
  let fixture: ComponentFixture<OffreCompositionComponent>;
  let service: OffreCompositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OffreCompositionComponent],
    })
      .overrideTemplate(OffreCompositionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffreCompositionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OffreCompositionService);

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
    expect(comp.offreCompositions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
