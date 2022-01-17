import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffre, getOffreIdentifier } from '../offre.model';

export type EntityResponseType = HttpResponse<IOffre>;
export type EntityArrayResponseType = HttpResponse<IOffre[]>;

@Injectable({ providedIn: 'root' })
export class OffreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offre: IOffre): Observable<EntityResponseType> {
    return this.http.post<IOffre>(this.resourceUrl, offre, { observe: 'response' });
  }

  update(offre: IOffre): Observable<EntityResponseType> {
    return this.http.put<IOffre>(`${this.resourceUrl}/${getOffreIdentifier(offre) as number}`, offre, { observe: 'response' });
  }

  partialUpdate(offre: IOffre): Observable<EntityResponseType> {
    return this.http.patch<IOffre>(`${this.resourceUrl}/${getOffreIdentifier(offre) as number}`, offre, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffre>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOffreToCollectionIfMissing(offreCollection: IOffre[], ...offresToCheck: (IOffre | null | undefined)[]): IOffre[] {
    const offres: IOffre[] = offresToCheck.filter(isPresent);
    if (offres.length > 0) {
      const offreCollectionIdentifiers = offreCollection.map(offreItem => getOffreIdentifier(offreItem)!);
      const offresToAdd = offres.filter(offreItem => {
        const offreIdentifier = getOffreIdentifier(offreItem);
        if (offreIdentifier == null || offreCollectionIdentifiers.includes(offreIdentifier)) {
          return false;
        }
        offreCollectionIdentifiers.push(offreIdentifier);
        return true;
      });
      return [...offresToAdd, ...offreCollection];
    }
    return offreCollection;
  }
}
