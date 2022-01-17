import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParcours, getParcoursIdentifier } from '../parcours.model';

export type EntityResponseType = HttpResponse<IParcours>;
export type EntityArrayResponseType = HttpResponse<IParcours[]>;

@Injectable({ providedIn: 'root' })
export class ParcoursService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parcours');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parcours: IParcours): Observable<EntityResponseType> {
    return this.http.post<IParcours>(this.resourceUrl, parcours, { observe: 'response' });
  }

  update(parcours: IParcours): Observable<EntityResponseType> {
    return this.http.put<IParcours>(`${this.resourceUrl}/${getParcoursIdentifier(parcours) as number}`, parcours, { observe: 'response' });
  }

  partialUpdate(parcours: IParcours): Observable<EntityResponseType> {
    return this.http.patch<IParcours>(`${this.resourceUrl}/${getParcoursIdentifier(parcours) as number}`, parcours, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParcours>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParcours[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParcoursToCollectionIfMissing(parcoursCollection: IParcours[], ...parcoursToCheck: (IParcours | null | undefined)[]): IParcours[] {
    const parcours: IParcours[] = parcoursToCheck.filter(isPresent);
    if (parcours.length > 0) {
      const parcoursCollectionIdentifiers = parcoursCollection.map(parcoursItem => getParcoursIdentifier(parcoursItem)!);
      const parcoursToAdd = parcours.filter(parcoursItem => {
        const parcoursIdentifier = getParcoursIdentifier(parcoursItem);
        if (parcoursIdentifier == null || parcoursCollectionIdentifiers.includes(parcoursIdentifier)) {
          return false;
        }
        parcoursCollectionIdentifiers.push(parcoursIdentifier);
        return true;
      });
      return [...parcoursToAdd, ...parcoursCollection];
    }
    return parcoursCollection;
  }
}
