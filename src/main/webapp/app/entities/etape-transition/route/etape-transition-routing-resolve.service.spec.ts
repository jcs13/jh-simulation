import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEtapeTransition, EtapeTransition } from '../etape-transition.model';
import { EtapeTransitionService } from '../service/etape-transition.service';

import { EtapeTransitionRoutingResolveService } from './etape-transition-routing-resolve.service';

describe('EtapeTransition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EtapeTransitionRoutingResolveService;
  let service: EtapeTransitionService;
  let resultEtapeTransition: IEtapeTransition | undefined;

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
    routingResolveService = TestBed.inject(EtapeTransitionRoutingResolveService);
    service = TestBed.inject(EtapeTransitionService);
    resultEtapeTransition = undefined;
  });

  describe('resolve', () => {
    it('should return IEtapeTransition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeTransition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtapeTransition).toEqual({ id: 123 });
    });

    it('should return new IEtapeTransition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeTransition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEtapeTransition).toEqual(new EtapeTransition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EtapeTransition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeTransition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtapeTransition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
