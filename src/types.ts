export interface Student {
  id: string;
  name: string;
  email: string;
  year: number;
  department: string;
  status: 'ACTIVE' | 'ON LEAVE' | 'GRADUATED';
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  department: string;
  subjects: string[];
}
