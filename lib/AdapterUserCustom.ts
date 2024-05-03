import { AdapterUser } from "next-auth/adapters";

export interface AdapterUserCustom extends AdapterUser {
  role: string;
}