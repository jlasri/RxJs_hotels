import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { category } from "../models/category";

@Injectable({
    providedIn: 'root'
  })
export class CategoryService{

    constructor() {}

    public getCategories(): Observable<category[]>{
        return of([
                {
                id: 0,
                name: 'Motel'
                },
                {
                id: 1,
                name: 'Auberge'
                },
                {
                id: 2,
                name: 'Five Stars'
                }
            ])
    }
}