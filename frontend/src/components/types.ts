export interface Product {
  name: string;
  main_category?: string;
  sub_category?: string;
  image: string;
  link: string;
  ratings: number;
  no_of_ratings: number;
  discount_price: number;
  actual_price: number;
}