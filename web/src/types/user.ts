import type { Role, State } from "./enums";

export interface User {
  email: string;
  userNum: string;
  firstName: string;
  lastName: string;
  role: Role;
  state: State;
  streetAddress: string;
  city: string;
  zipCode: string;
}

export interface ApiUser {
  email: string;
  user_num: string;
  first_name: string;
  last_name: string;
  role: Role;
  state: State;
  street_address: string;
  city: string;
  zip_code: string;
}
