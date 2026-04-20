import { UserRoleEnum } from "@/domain/UserRole.enum";
import { AdapterUserCustom } from "@/lib/users/AdapterUserCustom";
import { Session } from "next-auth";

const isConnected = (session: Session | null): boolean => {
  return !isNotConnected(session);
}

const isNotConnected = (session: Session | null): boolean => {
  return !session?.user?.id;
}

const isSuperAdmin = (session: Session | null): boolean => {
  return (session?.user as AdapterUserCustom)?.role === UserRoleEnum.Enum.super_admin;
}

export { isConnected, isNotConnected, isSuperAdmin };
