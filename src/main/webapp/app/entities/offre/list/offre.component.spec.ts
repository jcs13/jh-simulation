import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OffreService } from '../service/offre.service';

import { OffreComponent } from './offre.component';

describe('Offre Management Component', () => {
  let comp: OffreComponent;
  let fixture: ComponentFixture<OffreComponent>;
  let service: OffreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OffreComponent],
    })
      .overrideTemplate(OffreComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffreComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OffreService);

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
    expect(comp.offres?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
