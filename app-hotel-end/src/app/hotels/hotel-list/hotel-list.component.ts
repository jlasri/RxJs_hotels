import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Hotel, IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  public title = 'Liste hotels';

  public hotels: IHotel[] = [];
  public hotels$: Observable<IHotel[]> = of([]);

  public filteredHotels: IHotel[] = [];
  public filteredHotels$: Observable<IHotel[]> = of([]);

  public showBadge: boolean = true;
  private _hotelFilter = 'mot';
  public receivedRating: string;
  public errMsg: string;


  constructor(private hotelListService: HotelListService) {

  }

  ngOnInit() {
    this.hotels$ = this.hotelListService.getHotels()
                                                .pipe(
                                                  catchError((err) => {
                                                    this.errMsg = err;
                                                    // Renvoyer on observable qui contient l'erreur => Ignorer Next et executer error
                                                    return throwError(err);

                                                    // Renvoyer un observable qui ne contient aucune valeur => Ignorer next et error et executer complete
                                                    // return EMPTY;
                                                  })
                                                );
    this.filteredHotels$ = this.hotels$;
    this.hotelFilter = '';
  }


  public toggleIsNewBadge(): void {
    this.showBadge = !this.showBadge;
  }

  public get hotelFilter(): string {
    return this._hotelFilter;
  }

  public set hotelFilter(filter: string) {
    this._hotelFilter = filter;

    if(this.hotelFilter) {
      this.filteredHotels$ = this.hotels$
                                        .pipe(
                                          map((hotels: IHotel[]) => this.filterHotels(this.hotelFilter, hotels))
                                        )
    } else{
      this.filteredHotels$ = this.hotels$;
    }
  }

  public receiveRatingClicked(message: string): void {
    this.receivedRating = message;
  }


  private filterHotels(criteria: string, hotels: IHotel[]): IHotel[] {
    criteria = criteria.toLocaleLowerCase();

    return hotels.filter(
      (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(criteria) !== -1
    );
  }
}
