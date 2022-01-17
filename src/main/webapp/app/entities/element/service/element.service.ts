import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IElement, getElementIdentifier } from '../element.model';

export type EntityResponseType = HttpResponse<IElement>;
export type EntityArrayResponseType = HttpResponse<IElement[]>;

@Injectable({ providedIn: 'root' })
export class ElementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/elements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(element: IElement): Observable<EntityResponseType> {
    return this.http.post<IElement>(this.resourceUrl, element, { observe: 'response' });
  }

  update(element: IElement): Observable<EntityResponseType> {
    return this.http.put<IElement>(`${this.resourceUrl}/${getElementIdentifier(element) as number}`, element, { observe: 'response' });
  }

  partialUpdate(element: IElement): Observable<EntityResponseType> {
    return this.http.patch<IElement>(`${this.resourceUrl}/${getElementIdentifier(element) as number}`, element, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addElementToCollectionIfMissing(elementCollection: IElement[], ...elementsToCheck: (IElement | null | undefined)[]): IElement[] {
    const elements: IElement[] = elementsToCheck.filter(isPresent);
    if (elements.length > 0) {
      const elementCollectionIdentifiers = elementCollection.map(elementItem => getElementIdentifier(elementItem)!);
      const elementsToAdd = elements.filter(elementItem => {
        const elementIdentifier = getElementIdentifier(elementItem);
        if (elementIdentifier == null || elementCollectionIdentifiers.includes(elementIdentifier)) {
          return false;
        }
        elementCollectionIdentifiers.push(elementIdentifier);
        return true;
      });
      return [...elementsToAdd, ...elementCollection];
    }
    return elementCollection;
  }
}
