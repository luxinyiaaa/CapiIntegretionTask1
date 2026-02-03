import P1 from "@/assets/user/phillip.svg";
import P2 from "@/assets/user/P2.svg";
import P3 from "@/assets/user/P3.svg";
import P4 from "@/assets/user/P4.svg";
import P5 from "@/assets/user/P5.svg";

export interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;

  // users
  projectName?: string;
  revenue?: number;
  dealStatus?: "negotiation" | "won" | "lost";

  // admins
  totalEarnings?: number;
  totalProjects?: number;
  status?: "active" | "disabled";
  type?: "remote" | "in-person";
}

export const people: Person[] = [
  {
    id: "1",
    name: "Phillip Gouse",
    email: "janainagalindo@sportsillustrated.com",
    avatar: P1,
    projectName: "Project Name",
    revenue: 200,
    dealStatus: "negotiation",
    totalEarnings: 200,
    totalProjects: 2,
    status: "active",
    type: "remote",
  },
  {
    id: "2",
    name: "Craig Bergson",
    email: "janainagalindo@sportsillustrated.com",
    avatar: P2,
    projectName: "Project Name",
    revenue: 200,
    dealStatus: "won",
    totalEarnings: 200,
    totalProjects: 2,
    status: "active",
    type: "in-person",
  },
  {
    id: "3",
    name: "Adison Franci",
    email: "janainagalindo@sportsillustrated.com",
    avatar: P3,
    projectName: "Project Name",
    revenue: 200,
    dealStatus: "lost",
    totalEarnings: 200,
    totalProjects: 2,
    status: "disabled",
    type: "in-person",
  },
  {
    id: "4",
    name: "Adison Franci",
    email: "janainagalindo@sportsillustrated.com",
    avatar: P4,
    projectName: "Project Name",
    revenue: 200,
    dealStatus: "lost",
    totalEarnings: 200,
    totalProjects: 2,
    status: "disabled",
    type: "in-person",
  },
  {
    id: "5",
    name: "Adison Franci",
    email: "janainagalindo@sportsillustrated.com",
    avatar: P5,
    projectName: "Project Name",
    revenue: 200,
    dealStatus: "lost",
    totalEarnings: 200,
    totalProjects: 2,
    status: "disabled",
    type: "in-person",
  },
];
