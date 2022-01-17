import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BusinessUnitService } from '../service/business-unit.service';

import { BusinessUnitComponent } from './business-unit.component';

describe('BusinessUnit Management Component', () => {
  let comp: BusinessUnitComponent;
  let fixture: ComponentFixture<BusinessUnitComponent>;
  let service: BusinessUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BusinessUnitComponent],
    })
      .overrideTemplate(BusinessUnitComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessUnitComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BusinessUnitService);

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
    expect(comp.businessUnits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
