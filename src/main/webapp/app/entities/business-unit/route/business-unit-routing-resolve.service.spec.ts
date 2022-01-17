import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBusinessUnit, BusinessUnit } from '../business-unit.model';
import { BusinessUnitService } from '../service/business-unit.service';

import { BusinessUnitRoutingResolveService } from './business-unit-routing-resolve.service';

describe('BusinessUnit routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BusinessUnitRoutingResolveService;
  let service: BusinessUnitService;
  let resultBusinessUnit: IBusinessUnit | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(BusinessUnitRoutingResolveService);
    service = TestBed.inject(BusinessUnitService);
    resultBusinessUnit = undefined;
  });

  describe('resolve', () => {
    it('should return IBusinessUnit returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBusinessUnit = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBusinessUnit).toEqual({ id: 123 });
    });

    it('should return new IBusinessUnit if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBusinessUnit = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBusinessUnit).toEqual(new BusinessUnit());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BusinessUnit })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBusinessUnit = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBusinessUnit).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
