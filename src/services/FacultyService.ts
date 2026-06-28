import { supabase } from '../utils/supabaseClient';
import { FacultyMember } from '../utils/db';

export class FacultyService {
  static async getFaculty(bypassCache = false): Promise<FacultyMember[]> {
    const cacheKey = 'edu_faculty_cache';
    if (!bypassCache) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }

    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching faculty:', error);
      throw error;
    }

    const faculty: FacultyMember[] = (data || []).map(row => ({
      id: row.id,
      name: row.name,
      dept: row.department,
      subjects: row.subjects || [],
      email: row.email,
      phone: row.phone || '',
      status: 'active',
    }));

    localStorage.setItem(cacheKey, JSON.stringify(faculty));
    return faculty;
  }

  static async saveFaculty(member: Omit<FacultyMember, 'id'> & { id?: string }): Promise<FacultyMember> {
    const dbRow = {
      name: member.name,
      department: member.dept,
      email: member.email,
      phone: member.phone,
      subjects: member.subjects,
    };

    let result;
    if (member.id && member.id.length > 5) {
      const { data, error } = await supabase
        .from('faculty')
        .update(dbRow)
        .eq('id', member.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('faculty')
        .insert(dbRow)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    const saved: FacultyMember = {
      id: result.id,
      name: result.name,
      dept: result.department,
      subjects: result.subjects || [],
      email: result.email,
      phone: result.phone || '',
      status: 'active',
    };

    const cached = localStorage.getItem('edu_faculty_cache');
    if (cached) {
      try {
        const list: FacultyMember[] = JSON.parse(cached);
        const index = list.findIndex(f => f.id === saved.id);
        if (index > -1) {
          list[index] = saved;
        } else {
          list.push(saved);
        }
        localStorage.setItem('edu_faculty_cache', JSON.stringify(list));
      } catch (e) {}
    }
    return saved;
  }

  static async deleteFaculty(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('faculty')
      .delete()
      .eq('id', id);

    if (error) throw error;

    const cached = localStorage.getItem('edu_faculty_cache');
    if (cached) {
      try {
        const list: FacultyMember[] = JSON.parse(cached);
        const filtered = list.filter(f => f.id !== id);
        localStorage.setItem('edu_faculty_cache', JSON.stringify(filtered));
      } catch (e) {}
    }
    return true;
  }
}
