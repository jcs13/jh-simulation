import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParcoursComposition, ParcoursComposition } from '../parcours-composition.model';

import { ParcoursCompositionService } from './parcours-composition.service';

describe('ParcoursComposition Service', () => {
  let service: ParcoursCompositionService;
  let httpMock: HttpTestingController;
  let elemDefault: IParcoursComposition;
  let expectedResult: IParcoursComposition | IParcoursComposition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParcoursCompositionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      inheritanceOrder: 0,
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

    it('should create a ParcoursComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ParcoursComposition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParcoursComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          inheritanceOrder: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ParcoursComposition', () => {
      const patchObject = Object.assign(
        {
          inheritanceOrder: 1,
        },
        new ParcoursComposition()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ParcoursComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          inheritanceOrder: 1,
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

    it('should delete a ParcoursComposition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParcoursCompositionToCollectionIfMissing', () => {
      it('should add a ParcoursComposition to an empty array', () => {
        const parcoursComposition: IParcoursComposition = { id: 123 };
        expectedResult = service.addParcoursCompositionToCollectionIfMissing([], parcoursComposition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parcoursComposition);
      });

      it('should not add a ParcoursComposition to an array that contains it', () => {
        const parcoursComposition: IParcoursComposition = { id: 123 };
        const parcoursCompositionCollection: IParcoursComposition[] = [
          {
            ...parcoursComposition,
          },
          { id: 456 },
        ];
        expectedResult = service.addParcoursCompositionToCollectionIfMissing(parcoursCompositionCollection, parcoursComposition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParcoursComposition to an array that doesn't contain it", () => {
        const parcoursComposition: IParcoursComposition = { id: 123 };
        const parcoursCompositionCollection: IParcoursComposition[] = [{ id: 456 }];
        expectedResult = service.addParcoursCompositionToCollectionIfMissing(parcoursCompositionCollection, parcoursComposition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parcoursComposition);
      });

      it('should add only unique ParcoursComposition to an array', () => {
        const parcoursCompositionArray: IParcoursComposition[] = [{ id: 123 }, { id: 456 }, { id: 24766 }];
        const parcoursCompositionCollection: IParcoursComposition[] = [{ id: 123 }];
        expectedResult = service.addParcoursCompositionToCollectionIfMissing(parcoursCompositionCollection, ...parcoursCompositionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parcoursComposition: IParcoursComposition = { id: 123 };
        const parcoursComposition2: IParcoursComposition = { id: 456 };
        expectedResult = service.addParcoursCompositionToCollectionIfMissing([], parcoursComposition, parcoursComposition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parcoursComposition);
        expect(expectedResult).toContain(parcoursComposition2);
      });

      it('should accept null and undefined values', () => {
        const parcoursComposition: IParcoursComposition = { id: 123 };
        expectedResult = service.addParcoursCompositionToCollectionIfMissing([], null, parcoursComposition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parcoursComposition);
      });

      it('should return initial array if no ParcoursComposition is added', () => {
        const parcoursCompositionCollection: IParcoursComposition[] = [{ id: 123 }];
        expectedResult = service.addParcoursCompositionToCollectionIfMissing(parcoursCompositionCollection, undefined, null);
        expect(expectedResult).toEqual(parcoursCompositionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
