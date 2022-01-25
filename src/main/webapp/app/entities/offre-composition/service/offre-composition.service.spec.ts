import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOffreComposition, OffreComposition } from '../offre-composition.model';

import { OffreCompositionService } from './offre-composition.service';

describe('OffreComposition Service', () => {
  let service: OffreCompositionService;
  let httpMock: HttpTestingController;
  let elemDefault: IOffreComposition;
  let expectedResult: IOffreComposition | IOffreComposition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OffreCompositionService);
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

    it('should create a OffreComposition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new OffreComposition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OffreComposition', () => {
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

    it('should partial update a OffreComposition', () => {
      const patchObject = Object.assign(
        {
          inheritanceOrder: 1,
        },
        new OffreComposition()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OffreComposition', () => {
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

    it('should delete a OffreComposition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOffreCompositionToCollectionIfMissing', () => {
      it('should add a OffreComposition to an empty array', () => {
        const offreComposition: IOffreComposition = { id: 123 };
        expectedResult = service.addOffreCompositionToCollectionIfMissing([], offreComposition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offreComposition);
      });

      it('should not add a OffreComposition to an array that contains it', () => {
        const offreComposition: IOffreComposition = { id: 123 };
        const offreCompositionCollection: IOffreComposition[] = [
          {
            ...offreComposition,
          },
          { id: 456 },
        ];
        expectedResult = service.addOffreCompositionToCollectionIfMissing(offreCompositionCollection, offreComposition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OffreComposition to an array that doesn't contain it", () => {
        const offreComposition: IOffreComposition = { id: 123 };
        const offreCompositionCollection: IOffreComposition[] = [{ id: 456 }];
        expectedResult = service.addOffreCompositionToCollectionIfMissing(offreCompositionCollection, offreComposition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offreComposition);
      });

      it('should add only unique OffreComposition to an array', () => {
        const offreCompositionArray: IOffreComposition[] = [{ id: 123 }, { id: 456 }, { id: 20423 }];
        const offreCompositionCollection: IOffreComposition[] = [{ id: 123 }];
        expectedResult = service.addOffreCompositionToCollectionIfMissing(offreCompositionCollection, ...offreCompositionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offreComposition: IOffreComposition = { id: 123 };
        const offreComposition2: IOffreComposition = { id: 456 };
        expectedResult = service.addOffreCompositionToCollectionIfMissing([], offreComposition, offreComposition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offreComposition);
        expect(expectedResult).toContain(offreComposition2);
      });

      it('should accept null and undefined values', () => {
        const offreComposition: IOffreComposition = { id: 123 };
        expectedResult = service.addOffreCompositionToCollectionIfMissing([], null, offreComposition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offreComposition);
      });

      it('should return initial array if no OffreComposition is added', () => {
        const offreCompositionCollection: IOffreComposition[] = [{ id: 123 }];
        expectedResult = service.addOffreCompositionToCollectionIfMissing(offreCompositionCollection, undefined, null);
        expect(expectedResult).toEqual(offreCompositionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
