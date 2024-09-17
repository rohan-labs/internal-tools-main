'use server'

import { revalidatePath } from 'next/cache'
import supabase from '@/utils/supabase'

export const uploadNewModule = async (newModule: string) => {
    console.log('uploading to supabse modules...', newModule)
    const { error } = await supabase.from('modulesNew').insert([{ categoryName: newModule }])

    if (error) {
        console.error(error)
    }

    revalidatePath('/add-module')
}
