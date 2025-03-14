export interface Vehicle {
  id?: string;
  user_id?: string;
  make: string;
  model: string;
  year: number;
  license_plate?: string;
  created_at?: Date;
  updated_at?: Date;
  company_id?: string | null;
}
