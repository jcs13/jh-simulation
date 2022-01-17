import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ElementService } from '../service/element.service';

import { ElementComponent } from './element.component';

describe('Element Management Component', () => {
  let comp: ElementComponent;
  let fixture: ComponentFixture<ElementComponent>;
  let service: ElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ElementComponent],
    })
      .overrideTemplate(ElementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ElementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ElementService);

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
    expect(comp.elements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
