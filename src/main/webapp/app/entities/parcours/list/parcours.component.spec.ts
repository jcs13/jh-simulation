import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ParcoursService } from '../service/parcours.service';

import { ParcoursComponent } from './parcours.component';

describe('Parcours Management Component', () => {
  let comp: ParcoursComponent;
  let fixture: ComponentFixture<ParcoursComponent>;
  let service: ParcoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ParcoursComponent],
    })
      .overrideTemplate(ParcoursComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParcoursComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParcoursService);

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
    expect(comp.parcours?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
