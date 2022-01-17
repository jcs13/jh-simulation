import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlocTransition, BlocTransition } from '../bloc-transition.model';

import { BlocTransitionService } from './bloc-transition.service';

describe('BlocTransition Service', () => {
  let service: BlocTransitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IBlocTransition;
  let expectedResult: IBlocTransition | IBlocTransition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlocTransitionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      transition: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a BlocTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BlocTransition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BlocTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transition: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BlocTransition', () => {
      const patchObject = Object.assign({}, new BlocTransition());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BlocTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transition: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a BlocTransition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlocTransitionToCollectionIfMissing', () => {
      it('should add a BlocTransition to an empty array', () => {
        const blocTransition: IBlocTransition = { id: 123 };
        expectedResult = service.addBlocTransitionToCollectionIfMissing([], blocTransition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blocTransition);
      });

      it('should not add a BlocTransition to an array that contains it', () => {
        const blocTransition: IBlocTransition = { id: 123 };
        const blocTransitionCollection: IBlocTransition[] = [
          {
            ...blocTransition,
          },
          { id: 456 },
        ];
        expectedResult = service.addBlocTransitionToCollectionIfMissing(blocTransitionCollection, blocTransition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BlocTransition to an array that doesn't contain it", () => {
        const blocTransition: IBlocTransition = { id: 123 };
        const blocTransitionCollection: IBlocTransition[] = [{ id: 456 }];
        expectedResult = service.addBlocTransitionToCollectionIfMissing(blocTransitionCollection, blocTransition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blocTransition);
      });

      it('should add only unique BlocTransition to an array', () => {
        const blocTransitionArray: IBlocTransition[] = [{ id: 123 }, { id: 456 }, { id: 97132 }];
        const blocTransitionCollection: IBlocTransition[] = [{ id: 123 }];
        expectedResult = service.addBlocTransitionToCollectionIfMissing(blocTransitionCollection, ...blocTransitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blocTransition: IBlocTransition = { id: 123 };
        const blocTransition2: IBlocTransition = { id: 456 };
        expectedResult = service.addBlocTransitionToCollectionIfMissing([], blocTransition, blocTransition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blocTransition);
        expect(expectedResult).toContain(blocTransition2);
      });

      it('should accept null and undefined values', () => {
        const blocTransition: IBlocTransition = { id: 123 };
        expectedResult = service.addBlocTransitionToCollectionIfMissing([], null, blocTransition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blocTransition);
      });

      it('should return initial array if no BlocTransition is added', () => {
        const blocTransitionCollection: IBlocTransition[] = [{ id: 123 }];
        expectedResult = service.addBlocTransitionToCollectionIfMissing(blocTransitionCollection, undefined, null);
        expect(expectedResult).toEqual(blocTransitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
