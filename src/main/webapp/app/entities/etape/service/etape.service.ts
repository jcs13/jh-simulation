import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtape, getEtapeIdentifier } from '../etape.model';

export type EntityResponseType = HttpResponse<IEtape>;
export type EntityArrayResponseType = HttpResponse<IEtape[]>;

@Injectable({ providedIn: 'root' })
export class EtapeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etapes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(etape: IEtape): Observable<EntityResponseType> {
    return this.http.post<IEtape>(this.resourceUrl, etape, { observe: 'response' });
  }

  update(etape: IEtape): Observable<EntityResponseType> {
    return this.http.put<IEtape>(`${this.resourceUrl}/${getEtapeIdentifier(etape) as number}`, etape, { observe: 'response' });
  }

  partialUpdate(etape: IEtape): Observable<EntityResponseType> {
    return this.http.patch<IEtape>(`${this.resourceUrl}/${getEtapeIdentifier(etape) as number}`, etape, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtape>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtape[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEtapeToCollectionIfMissing(etapeCollection: IEtape[], ...etapesToCheck: (IEtape | null | undefined)[]): IEtape[] {
    const etapes: IEtape[] = etapesToCheck.filter(isPresent);
    if (etapes.length > 0) {
      const etapeCollectionIdentifiers = etapeCollection.map(etapeItem => getEtapeIdentifier(etapeItem)!);
      const etapesToAdd = etapes.filter(etapeItem => {
        const etapeIdentifier = getEtapeIdentifier(etapeItem);
        if (etapeIdentifier == null || etapeCollectionIdentifiers.includes(etapeIdentifier)) {
          return false;
        }
        etapeCollectionIdentifiers.push(etapeIdentifier);
        return true;
      });
      return [...etapesToAdd, ...etapeCollection];
    }
    return etapeCollection;
  }
}
