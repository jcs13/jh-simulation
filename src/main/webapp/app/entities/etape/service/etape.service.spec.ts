import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEtape, Etape } from '../etape.model';

import { EtapeService } from './etape.service';

describe('Etape Service', () => {
  let service: EtapeService;
  let httpMock: HttpTestingController;
  let elemDefault: IEtape;
  let expectedResult: IEtape | IEtape[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EtapeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      label: 'AAAAAAA',
      etapeDefinitionId: 'AAAAAAA',
      display: false,
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

    it('should create a Etape', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Etape()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Etape', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
          etapeDefinitionId: 'BBBBBB',
          display: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Etape', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          label: 'BBBBBB',
          etapeDefinitionId: 'BBBBBB',
        },
        new Etape()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Etape', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
          etapeDefinitionId: 'BBBBBB',
          display: true,
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

    it('should delete a Etape', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEtapeToCollectionIfMissing', () => {
      it('should add a Etape to an empty array', () => {
        const etape: IEtape = { id: 123 };
        expectedResult = service.addEtapeToCollectionIfMissing([], etape);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etape);
      });

      it('should not add a Etape to an array that contains it', () => {
        const etape: IEtape = { id: 123 };
        const etapeCollection: IEtape[] = [
          {
            ...etape,
          },
          { id: 456 },
        ];
        expectedResult = service.addEtapeToCollectionIfMissing(etapeCollection, etape);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Etape to an array that doesn't contain it", () => {
        const etape: IEtape = { id: 123 };
        const etapeCollection: IEtape[] = [{ id: 456 }];
        expectedResult = service.addEtapeToCollectionIfMissing(etapeCollection, etape);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etape);
      });

      it('should add only unique Etape to an array', () => {
        const etapeArray: IEtape[] = [{ id: 123 }, { id: 456 }, { id: 5836 }];
        const etapeCollection: IEtape[] = [{ id: 123 }];
        expectedResult = service.addEtapeToCollectionIfMissing(etapeCollection, ...etapeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etape: IEtape = { id: 123 };
        const etape2: IEtape = { id: 456 };
        expectedResult = service.addEtapeToCollectionIfMissing([], etape, etape2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etape);
        expect(expectedResult).toContain(etape2);
      });

      it('should accept null and undefined values', () => {
        const etape: IEtape = { id: 123 };
        expectedResult = service.addEtapeToCollectionIfMissing([], null, etape, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etape);
      });

      it('should return initial array if no Etape is added', () => {
        const etapeCollection: IEtape[] = [{ id: 123 }];
        expectedResult = service.addEtapeToCollectionIfMissing(etapeCollection, undefined, null);
        expect(expectedResult).toEqual(etapeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
