import { supabase } from '@/lib/supabase/client';

interface DepartmentHierarchyNode {
  id: string;
  name: string;
  manager?: {
    employee?: {
      first_name: string;
      last_name: string;
    };
  };
  children?: DepartmentHierarchyNode[];
}

export const departmentApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        manager:department_managers!department_id(
          employee:employees!employee_id(
            id,
            first_name,
            last_name
          )
        ),
        employees:employees!employees_department_id_fkey(count)
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getHierarchy() {
    const { data: hierarchyData, error: hierarchyError } = await supabase
      .from('department_hierarchy')
      .select('*')
      .order('level');

    if (hierarchyError) throw hierarchyError;

    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select(`
        *,
        manager:department_managers!department_id(
          employee:employees!employee_id(
            first_name,
            last_name
          )
        )
      `);

    if (deptError) throw deptError;

    // Build hierarchy tree
    const deptMap = new Map(departments.map(d => [d.id, { ...d, children: [] }]));
    const roots: DepartmentHierarchyNode[] = [];

    // Group by parent
    hierarchyData.forEach(h => {
      if (h.parent_id === h.child_id) {
        if (h.level === 0) {
          const dept = deptMap.get(h.child_id);
          if (dept) roots.push(dept);
        }
      } else {
        const parent = deptMap.get(h.parent_id);
        const child = deptMap.get(h.child_id);
        if (parent && child) {
          parent.children = parent.children || [];
          parent.children.push(child);
        }
      }
    });

    return roots;
  },

  async create(data: {
    name: string;
    managerId: string;
    parentDepartmentId?: string;
    description?: string;
    costCenter?: string;
    location?: string;
  }) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: result, error } = await supabase.rpc('manage_department', {
      p_name: data.name,
      p_manager_id: data.managerId,
      p_created_by: userData.user.id,
      p_parent_id: data.parentDepartmentId || null,
      p_description: data.description || null,
      p_cost_center: data.costCenter || null,
      p_location: data.location || null
    });

    if (error) throw error;
    return result;
  },

  async update(id: string, data: {
    name: string;
    manager_id: string;
    parent_id?: string;
    description?: string;
    cost_center?: string;
    location?: string;
    status: 'active' | 'inactive';
  }) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: result, error } = await supabase.rpc('update_department', {
      p_department_id: id,
      p_name: data.name,
      p_manager_id: data.manager_id,
      p_parent_id: data.parent_id || null,
      p_description: data.description || null,
      p_cost_center: data.cost_center || null,
      p_location: data.location || null,
      p_status: data.status
    });

    if (error) throw error;
    return result;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('departments')
      .update({ status: 'inactive' })
      .eq('id', id);

    if (error) throw error;
  }
};