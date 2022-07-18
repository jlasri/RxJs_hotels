import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { category } from "../models/category";

export class categoryService{
    private readonly HOTEL_API_URL = 'api/hotels';

    constructor(private http: HttpClient) {}

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