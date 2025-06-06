
import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export interface Roles {
  admin?: boolean;
  clean?: boolean; // Added clean role
}

export interface AppUser extends FirebaseUser {
  roles?: Roles;
  // Add any other custom user properties here if needed in the future
}

export interface Product {
  id: string;
  title: string;
  description:string;
  imageUrl: string;
  price: number;
  currency: 'BGN'; // Ensure currency is part of the type
  createdAt?: Timestamp; // Important for sorting recent products
  updatedAt?: Timestamp;
  dataAiHint?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type Language = 'en' | 'bg';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

