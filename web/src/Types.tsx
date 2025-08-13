export interface reviewType {
  reviewer: string;
  rating: number;
  comment: string;
  avatar_url?: string;
}

export interface serviceType {
  name: string;
  price: number | string;
  description: string;
  image_url?: string;
  details: string;
  reviews: reviewType[];
}

export interface Link {
  url: string;
  label: string;
}
