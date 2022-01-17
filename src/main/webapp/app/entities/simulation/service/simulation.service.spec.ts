import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISimulation, Simulation } from '../simulation.model';

import { SimulationService } from './simulation.service';

describe('Simulation Service', () => {
  let service: SimulationService;
  let httpMock: HttpTestingController;
  let elemDefault: ISimulation;
  let expectedResult: ISimulation | ISimulation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SimulationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      affaire: 'AAAAAAA',
      client: 'AAAAAAA',
      parc: 'AAAAAAA',
      adresseInstallation: 'AAAAAAA',
      status: 'AAAAAAA',
      created: currentDate,
      modifier: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          created: currentDate.format(DATE_FORMAT),
          modifier: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Simulation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          created: currentDate.format(DATE_FORMAT),
          modifier: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          created: currentDate,
          modifier: currentDate,
        },
        returnedFromService
      );

      service.create(new Simulation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Simulation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          affaire: 'BBBBBB',
          client: 'BBBBBB',
          parc: 'BBBBBB',
          adresseInstallation: 'BBBBBB',
          status: 'BBBBBB',
          created: currentDate.format(DATE_FORMAT),
          modifier: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          created: currentDate,
          modifier: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Simulation', () => {
      const patchObject = Object.assign(
        {
          affaire: 'BBBBBB',
          created: currentDate.format(DATE_FORMAT),
          modifier: currentDate.format(DATE_FORMAT),
        },
        new Simulation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          created: currentDate,
          modifier: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Simulation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          affaire: 'BBBBBB',
          client: 'BBBBBB',
          parc: 'BBBBBB',
          adresseInstallation: 'BBBBBB',
          status: 'BBBBBB',
          created: currentDate.format(DATE_FORMAT),
          modifier: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          created: currentDate,
          modifier: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Simulation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSimulationToCollectionIfMissing', () => {
      it('should add a Simulation to an empty array', () => {
        const simulation: ISimulation = { id: 123 };
        expectedResult = service.addSimulationToCollectionIfMissing([], simulation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(simulation);
      });

      it('should not add a Simulation to an array that contains it', () => {
        const simulation: ISimulation = { id: 123 };
        const simulationCollection: ISimulation[] = [
          {
            ...simulation,
          },
          { id: 456 },
        ];
        expectedResult = service.addSimulationToCollectionIfMissing(simulationCollection, simulation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Simulation to an array that doesn't contain it", () => {
        const simulation: ISimulation = { id: 123 };
        const simulationCollection: ISimulation[] = [{ id: 456 }];
        expectedResult = service.addSimulationToCollectionIfMissing(simulationCollection, simulation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(simulation);
      });

      it('should add only unique Simulation to an array', () => {
        const simulationArray: ISimulation[] = [{ id: 123 }, { id: 456 }, { id: 5071 }];
        const simulationCollection: ISimulation[] = [{ id: 123 }];
        expectedResult = service.addSimulationToCollectionIfMissing(simulationCollection, ...simulationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const simulation: ISimulation = { id: 123 };
        const simulation2: ISimulation = { id: 456 };
        expectedResult = service.addSimulationToCollectionIfMissing([], simulation, simulation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(simulation);
        expect(expectedResult).toContain(simulation2);
      });

      it('should accept null and undefined values', () => {
        const simulation: ISimulation = { id: 123 };
        expectedResult = service.addSimulationToCollectionIfMissing([], null, simulation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(simulation);
      });

      it('should return initial array if no Simulation is added', () => {
        const simulationCollection: ISimulation[] = [{ id: 123 }];
        expectedResult = service.addSimulationToCollectionIfMissing(simulationCollection, undefined, null);
        expect(expectedResult).toEqual(simulationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
