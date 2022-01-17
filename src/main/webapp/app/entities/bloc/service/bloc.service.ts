import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBloc, getBlocIdentifier } from '../bloc.model';

export type EntityResponseType = HttpResponse<IBloc>;
export type EntityArrayResponseType = HttpResponse<IBloc[]>;

@Injectable({ providedIn: 'root' })
export class BlocService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/blocs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bloc: IBloc): Observable<EntityResponseType> {
    return this.http.post<IBloc>(this.resourceUrl, bloc, { observe: 'response' });
  }

  update(bloc: IBloc): Observable<EntityResponseType> {
    return this.http.put<IBloc>(`${this.resourceUrl}/${getBlocIdentifier(bloc) as number}`, bloc, { observe: 'response' });
  }

  partialUpdate(bloc: IBloc): Observable<EntityResponseType> {
    return this.http.patch<IBloc>(`${this.resourceUrl}/${getBlocIdentifier(bloc) as number}`, bloc, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBloc>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBloc[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlocToCollectionIfMissing(blocCollection: IBloc[], ...blocsToCheck: (IBloc | null | undefined)[]): IBloc[] {
    const blocs: IBloc[] = blocsToCheck.filter(isPresent);
    if (blocs.length > 0) {
      const blocCollectionIdentifiers = blocCollection.map(blocItem => getBlocIdentifier(blocItem)!);
      const blocsToAdd = blocs.filter(blocItem => {
        const blocIdentifier = getBlocIdentifier(blocItem);
        if (blocIdentifier == null || blocCollectionIdentifiers.includes(blocIdentifier)) {
          return false;
        }
        blocCollectionIdentifiers.push(blocIdentifier);
        return true;
      });
      return [...blocsToAdd, ...blocCollection];
    }
    return blocCollection;
  }
}
