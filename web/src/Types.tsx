interface reviewType{
    reviewer: string;
    rating: number;
    comment: string;
    avatar_url: string | undefined;
}
interface serviceType {
  name: string;
  price: number | string;
  description: string;
  img_url: string;
  details: string;
  reviews: reviewType[];
}
interface Link {
  url: string;
  label: string;
}


export type { serviceType, Link, reviewType };