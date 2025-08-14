export interface reviewType {
  reviewer: string;
  rating: number;
  comment: string;
  avatar_url?: string;
}

export interface serviceType {
  id?: string;  // job identifier from backend
  name: string;
  price: number | string;
  description: string;
  image_url?: string;
  details: string;
  reviews: reviewType[];
  type?: string;  // 'cleaning' or 'maintenance'
}

export interface Link {
  url: string;
  label: string;
}
