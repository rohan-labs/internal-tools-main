/* This page is for adding a new module to supabase*/
import supabase from '@/utils/supabase'
import { type modules } from '@/utils/types'
import AddModulePageMain from './AddModulePage'
export const fetchCache = 'force-no-store'

export default async function AddModulePage() {
    let availableModules: modules[] = []
    const { data, error } = await supabase.from('modulesNew').select().order('categoryId')
    if (error) {
        console.log('there has been an issue getting modules', error)
        availableModules = []
    } else {
        if (data) {
            availableModules = data as modules[]
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8">
            <section className="flex min-h-screen w-full max-w-6xl flex-col items-center gap-2">
                <h1 className="my-4 text-3xl font-bold">Preclinify Internal Tools - New Module</h1>
                <AddModulePageMain availableModules={availableModules} />
            </section>
        </main>
    )
}
