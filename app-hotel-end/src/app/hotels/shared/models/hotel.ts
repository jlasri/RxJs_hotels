export interface IHotel {
  id: number;
  hotelName: string;
  description: string;
  price: number;
  salePrice: number;
  imageUrl: string;
  rating: number;
  tags?: string[];
  catId?: number;
  cat?: string;
  menus?: number[]
}

export class Hotel implements IHotel {

  constructor(
    public id: number,
    public hotelName: string,
    public description: string,
    public price: number,
    public salePrice: number,
    public imageUrl: string,
    public rating: number,
    public tags: string[]
  ) { }

  getNewPrice(price: number): number {
    return price - 5;
  }
}
