import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, forkJoin, from, interval, merge, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, mergeMap, reduce, scan, shareReplay, take, tap, withLatestFrom } from 'rxjs/operators';
import { Hotel, IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelListComponent implements OnInit {
  public title = 'Liste hotels';

  public hotels: IHotel[] = [];

  public hotels$: Observable<IHotel[]> = of([]);
  public filteredHotels$: Observable<IHotel[]> = of([]);

  public showBadge: boolean = true;
  private _hotelFilter = 'mot';
  public receivedRating: string;
  //public errMsg: string;

  private errMsg$$ = new Subject<string>();

  public errMsg$ = this.errMsg$$.asObservable();

  public filter$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private testShareReplay1$: Observable<number>;
  private testShareReplay2$: Observable<number>;
  private testShareReplay3$: Observable<number>;

  constructor(private hotelListService: HotelListService) {

  }

  ngOnInit() {
    this.hotels$ = this.hotelListService.hotelsWithAdded$
                                                .pipe(
                                                  catchError((err) => {
                                                    this.errMsg$$.next(err);
                                                    // Renvoyer on observable qui contient l'erreur => Ignorer Next et executer error
                                                    return throwError(err);

                                                    // Renvoyer un observable qui ne contient aucune valeur => Ignorer next et error et executer complete
                                                    // return EMPTY;
                                                  })
                                                );
  
    this.filteredHotels$ = this.createFilterHotels(this.filter$$, this.hotels$);
    this.hotelFilter = '';

    //#region Scan & Reduce
    console.warn('Scan ==============');    
    of(10, 20, 30, 40, 50).pipe(
      scan((acc, seedValue) => [seedValue, ...acc], [0])
    ).subscribe(console.log);
    
    console.warn('Reduce ==============');    
    of(10, 20, 30, 40, 50).pipe(
      reduce((acc, seedValue) => [seedValue, ...acc], [0])
    ).subscribe(console.log);
    //#endregion

    //#region Merge
    const t1$ = interval(500).pipe(
      tap(val => console.log('T1 : ', val)),
      take(5)
    );
    
    const t2$ = interval(500).pipe(
      tap(val => console.log('T2 : ', val)),
      take(5)
    );

    merge(t1$, t2$).subscribe();
    //#endregion

    //#region Mise en cache: ShareReplay
    this.testShareReplay1$ = interval(500).pipe(
      take(5));

    this.testShareReplay2$ = interval(500).pipe(
      take(5),
      shareReplay()
    );

    this.testShareReplay3$ = interval(500).pipe(
      take(5),
      shareReplay(3)
    );
    //#endregion

    //#region console example
    // Diffèrence entre combineLatest et forkJoin
    const a$ = of(1, 2, 3);
    const b$ = of(11, 12, 13);
    const c$ = of(21, 22, 23);

    // output: 3,13,21, 3,13,22, 3,13,23
    combineLatest([a$, b$, c$])
                            .subscribe((val) => console.log(`CombineLatest => ${val}`));
             
    // output: 3,13,23
    forkJoin([a$, b$, c$])
                            .subscribe((val) => console.log(`ForkJoin => ${val}`));

    // output: 1,13,23, 2,13,23, 3,13,23
    a$.pipe(
      withLatestFrom(b$, c$)
    ).subscribe((val) => console.log(`WithLatestFrom => ${val}`));

    // Subject
    console.warn('Subject');    
    const myNumber$$ = new Subject<number>();

    myNumber$$.subscribe({
      next: (val) => console.log('A : ', val)
    });

    myNumber$$.subscribe({
      next: (val) => console.log('B : ', val)
    });

    // => dispatcher la valeur
    myNumber$$.next(1);
    myNumber$$.next(2);
    myNumber$$.next(3);
    // const observable$ = from([1, 2, 3]);
    // observable$.subscribe(myNumber$$);

    myNumber$$.subscribe({
      next: (val) => console.log('C : ', val)
    });
    
    myNumber$$.next(4);

    // BehaviorSubject
    console.warn('BehaviorSubject');
    const behavior$$ = new BehaviorSubject<number>(0);

    behavior$$.subscribe({
      next: (val) => console.log('A : ', val)
    });

    behavior$$.subscribe({
      next: (val) => console.log('B : ', val)
    });

    behavior$$.next(1);
    behavior$$.next(2);
    behavior$$.next(3);

    behavior$$.subscribe({
      next: (val) => console.log('C : ', val)
    });
    
    behavior$$.next(4);
    //#endregion
  }

  noShareReplay(){
    this.testShareReplay1$.subscribe(console.log);
  }

  shareReplay(){
    this.testShareReplay2$.subscribe(console.warn);
  }

  shareReplayLastValues(){
    this.testShareReplay3$.subscribe(console.warn);
  }

  public toggleIsNewBadge(): void {
    this.showBadge = !this.showBadge;
  }

  public get hotelFilter(): string {
    return this._hotelFilter;
  }

  public set hotelFilter(filter: string) {
    this._hotelFilter = filter;
  }

  public filterChange(value: string){
    console.log(value);
    this.filter$$.next(value);  
  }

  public createFilterHotels(filter$: Observable<string>, hotels$: Observable<IHotel[]>): Observable<IHotel[]>{
    return combineLatest(hotels$, filter$, (hotels: IHotel[], filter: string) => {
      if(filter === '') return hotels;
      return hotels.filter((hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(filter) !== -1);
    });
  }

  public receiveRatingClicked(message: string): void {
    this.receivedRating = message;
  }
}
