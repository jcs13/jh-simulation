import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IParcoursComposition, ParcoursComposition } from '../parcours-composition.model';
import { ParcoursCompositionService } from '../service/parcours-composition.service';

import { ParcoursCompositionRoutingResolveService } from './parcours-composition-routing-resolve.service';

describe('ParcoursComposition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ParcoursCompositionRoutingResolveService;
  let service: ParcoursCompositionService;
  let resultParcoursComposition: IParcoursComposition | undefined;

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
    routingResolveService = TestBed.inject(ParcoursCompositionRoutingResolveService);
    service = TestBed.inject(ParcoursCompositionService);
    resultParcoursComposition = undefined;
  });

  describe('resolve', () => {
    it('should return IParcoursComposition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParcoursComposition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParcoursComposition).toEqual({ id: 123 });
    });

    it('should return new IParcoursComposition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParcoursComposition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultParcoursComposition).toEqual(new ParcoursComposition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ParcoursComposition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParcoursComposition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParcoursComposition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
