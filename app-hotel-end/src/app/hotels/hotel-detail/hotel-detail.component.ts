import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {

  public hotel: IHotel = <IHotel>{};
  
  public hotel$: Observable<IHotel> = of(<IHotel>{});

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('id');

    this.hotel$= this.hotelService.getHotels()
                                          .pipe(
                                            map((hotels: IHotel[]) => hotels.find((hotel: IHotel) => hotel.id === id)),
                                            catchError((err) => {
                                              // Renvoyer on observable qui contient l'erreur => Ignorer Next et executer error
                                              return throwError(err);

                                              // Renvoyer un observable qui ne contient aucune valeur => Ignorer next et error et executer complete
                                              // return EMPTY;
                                            }),
                                            tap(console.log)
                                          );

  }

  public backToList(): void {
    this.router.navigate(['/hotels']);
  }

}
