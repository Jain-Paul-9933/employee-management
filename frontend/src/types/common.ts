export interface Stats {
  totalForms: number;
  totalEmployees: number;
  recentActivities: RecentActivity[];
  loading: boolean;
}

export interface RecentActivity {
  id: number;
  action: string;
  time: string;
  type: "form" | "employee";
}
