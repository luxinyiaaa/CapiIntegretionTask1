import { DashboardIcon } from "@/assets/icons/iconManage";
import { ProductsIcon } from "@/assets/icons/iconManage";
import { UsersIcon } from "@/assets/icons/iconManage";
import { AdminsIcon } from "@/assets/icons/iconManage";
import { TodoIcon } from "@/assets/icons/iconManage";

export type NavItem = {
  label: string;
  to: string;
  icon: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: DashboardIcon },
  { label: "Todo", to: "/todolist", icon: TodoIcon },
  { label: "Products", to: "/products", icon: ProductsIcon },
  { label: "Users", to: "/users", icon: UsersIcon },
  { label: "Admins", to: "/admins", icon: AdminsIcon },
];
