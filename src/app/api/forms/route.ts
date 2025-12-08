import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createDefaultFormConfig } from '@/lib/default-form-config';

// GET all forms for the current user
export async function GET() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all forms for the user's projects
  const { data: forms, error } = await supabase
    .from('forms')
    .select(`
      *,
      project:projects!inner(id, name, owner_id)
    `)
    .eq('project.owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(forms);
}

// POST - Create a new form
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, projectId } = body;

  if (!name) {
    return NextResponse.json({ error: 'Form name is required' }, { status: 400 });
  }

  // Get or create a default project for the user
  let finalProjectId = projectId;

  if (!finalProjectId) {
    // Check if user has any projects
    const { data: existingProjects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1);

    if (projectsError) {
      return NextResponse.json({ error: projectsError.message }, { status: 500 });
    }

    if (existingProjects && existingProjects.length > 0) {
      finalProjectId = existingProjects[0].id;
    } else {
      // Create a default project
      const { data: newProject, error: createProjectError } = await supabase
        .from('projects')
        .insert({
          owner_id: user.id, // Ensure this is explicitly set
          name: 'My First Project',
        })
        .select('id')
        .single();

      if (createProjectError || !newProject) {
        console.error('Failed to create project:', createProjectError);
        return NextResponse.json(
          { error: 'Failed to create project' },
          { status: 500 }
        );
      }

      finalProjectId = newProject.id;
    }
  }

  // Create default form configuration
  const defaultConfig = createDefaultFormConfig({ projectId: finalProjectId });

  // Create the form with default settings
  const { data: form, error: createError } = await supabase
    .from('forms')
    .insert({
      project_id: finalProjectId,
      name: name,
      settings: {
        ...defaultConfig,
        name: name,
      },
    })
    .select()
    .single();

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  return NextResponse.json(form);
}

