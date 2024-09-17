import supabase from '@/utils/supabase'

export async function GET() {
    //* used to create a new mcq module if not available in current list
    const { data, error } = await supabase.from('modulesNew').select()

    if (error) {
        return new Response(`error getting mcq-modules: ${error.message}`, {
            status: 400,
        })
    }
    return Response.json({ moduleData: data, status: 200 })
}
