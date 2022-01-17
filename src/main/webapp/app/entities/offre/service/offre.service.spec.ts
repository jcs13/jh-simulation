import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOffre, Offre } from '../offre.model';

import { OffreService } from './offre.service';

describe('Offre Service', () => {
  let service: OffreService;
  let httpMock: HttpTestingController;
  let elemDefault: IOffre;
  let expectedResult: IOffre | IOffre[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OffreService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      label: 'AAAAAAA',
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

    it('should create a Offre', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Offre()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Offre', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Offre', () => {
      const patchObject = Object.assign({}, new Offre());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Offre', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
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

    it('should delete a Offre', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOffreToCollectionIfMissing', () => {
      it('should add a Offre to an empty array', () => {
        const offre: IOffre = { id: 123 };
        expectedResult = service.addOffreToCollectionIfMissing([], offre);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offre);
      });

      it('should not add a Offre to an array that contains it', () => {
        const offre: IOffre = { id: 123 };
        const offreCollection: IOffre[] = [
          {
            ...offre,
          },
          { id: 456 },
        ];
        expectedResult = service.addOffreToCollectionIfMissing(offreCollection, offre);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Offre to an array that doesn't contain it", () => {
        const offre: IOffre = { id: 123 };
        const offreCollection: IOffre[] = [{ id: 456 }];
        expectedResult = service.addOffreToCollectionIfMissing(offreCollection, offre);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offre);
      });

      it('should add only unique Offre to an array', () => {
        const offreArray: IOffre[] = [{ id: 123 }, { id: 456 }, { id: 17714 }];
        const offreCollection: IOffre[] = [{ id: 123 }];
        expectedResult = service.addOffreToCollectionIfMissing(offreCollection, ...offreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offre: IOffre = { id: 123 };
        const offre2: IOffre = { id: 456 };
        expectedResult = service.addOffreToCollectionIfMissing([], offre, offre2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offre);
        expect(expectedResult).toContain(offre2);
      });

      it('should accept null and undefined values', () => {
        const offre: IOffre = { id: 123 };
        expectedResult = service.addOffreToCollectionIfMissing([], null, offre, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offre);
      });

      it('should return initial array if no Offre is added', () => {
        const offreCollection: IOffre[] = [{ id: 123 }];
        expectedResult = service.addOffreToCollectionIfMissing(offreCollection, undefined, null);
        expect(expectedResult).toEqual(offreCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
