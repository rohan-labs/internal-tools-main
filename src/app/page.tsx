import CSVPageMain from './CSVPage'
import supabase from '@/utils/supabase'
export const fetchCache = 'force-no-store' // This is to ensure that new modules are always shown if they are added

export default async function CSVPage() {
    let availableModules
    const { data, error } = await supabase.from('modulesNew').select().order('categoryName')
    if (error) {
        console.log('there has been an issue getting modules', error)
    } else {
        if (data) {
            availableModules = data
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8">
            <section className="flex min-h-screen flex-col gap-2">
                <h1 className="my-4 text-3xl font-bold">
                    Preclinify Internal Tools - New Questions
                </h1>
                <CSVPageMain
                    availableModules={
                        availableModules as Array<{ categoryName: string; categoryId: number }>
                    }
                />
            </section>
        </main>
    )
}
