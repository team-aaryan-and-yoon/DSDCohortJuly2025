import type { Role, State } from "./enums";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  state: State;
  streetAddress: string;
  city: string;
  zipCode: string;
}

export interface ApiUser {
  id: number;
  email: string;
  user_metadata: {
    first_name: string;
    last_name: string;
    role: Role;
    state: State;
    street_address: string;
    city: string;
    zip_code: string;
  };
}
