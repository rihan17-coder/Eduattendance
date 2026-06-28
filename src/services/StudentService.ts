import { supabase } from '../utils/supabaseClient';
import { Student } from '../utils/db';

export class StudentService {
  static async getStudents(bypassCache = false): Promise<Student[]> {
    const cacheKey = 'edu_students_cache';
    if (!bypassCache) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          // ignore and fetch
        }
      }
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }

    const students: Student[] = (data || []).map(row => ({
      id: row.id,
      name: row.name,
      roll: row.register_number,
      dept: row.department,
      year: row.year,
      section: row.section,
      status: row.status as 'good' | 'warning' | 'low',
    }));

    localStorage.setItem(cacheKey, JSON.stringify(students));
    return students;
  }

  static async saveStudent(student: Omit<Student, 'id'> & { id?: string }): Promise<Student> {
    const dbRow = {
      register_number: student.roll,
      name: student.name,
      department: student.dept,
      year: student.year,
      section: student.section,
      status: student.status || 'good',
    };

    let result;
    if (student.id && student.id.length > 5) {
      const { data, error } = await supabase
        .from('students')
        .update(dbRow)
        .eq('id', student.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('students')
        .insert(dbRow)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    const saved: Student = {
      id: result.id,
      name: result.name,
      roll: result.register_number,
      dept: result.department,
      year: result.year,
      section: result.section,
      status: result.status as 'good' | 'warning' | 'low',
    };

    // Update cache
    const cached = localStorage.getItem('edu_students_cache');
    if (cached) {
      try {
        const list: Student[] = JSON.parse(cached);
        const index = list.findIndex(s => s.id === saved.id);
        if (index > -1) {
          list[index] = saved;
        } else {
          list.push(saved);
        }
        localStorage.setItem('edu_students_cache', JSON.stringify(list));
      } catch (e) {}
    }

    return saved;
  }

  static async deleteStudent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }

    const cached = localStorage.getItem('edu_students_cache');
    if (cached) {
      try {
        const list: Student[] = JSON.parse(cached);
        const filtered = list.filter(s => s.id !== id);
        localStorage.setItem('edu_students_cache', JSON.stringify(filtered));
      } catch (e) {}
    }
    return true;
  }
}
