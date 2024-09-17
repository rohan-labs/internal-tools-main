//you need to use supabase secret key as this has FULL access to the supabase database and bypasses RLS
// we only need @supabase/supabase-js library i think (since we're doing database only and not auth)

import supabase from '@/utils/supabase'
import { type mcqQuestionsModuleString, type mcqQuestions, modules } from '@/utils/types'

interface AssignedModuleDictionary<T> {
    [Key: string]: T
}

export async function GET() {
    const { data, error } = await supabase.from('mcqQuestions').select()

    if (error) {
        return new Response(`error: ${error.message}`, {
            status: 400,
        })
    }
    return Response.json({ data })
}

export async function POST(req: Request) {
    const res = await req.json() // res now contains body
    try {
        const assignedModuleId: AssignedModuleDictionary<number> = res.assignedModuleId
        const questionsToUpload: mcqQuestionsModuleString[] = res.questionsToUpload

        const questionsToUploadWithId: mcqQuestions[] = questionsToUpload.map((question) => {
            return {
                questionStem: question.questionStem,
                leadQuestion: question.leadQuestion,
                correctAnswerId: question.correctAnswerId,
                answersArray: question.answersArray,
                explanationList: question.explanationList,
                moduleId: assignedModuleId[question.moduleString],
            }
        })

        const { error } = await supabase.from('mcqQuestions').insert(questionsToUploadWithId) // make sure property names are the same as the DB columns
        if (error) {
            return new Response('There was an issue with Supabase', {
                status: 400,
            })
        }

        return new Response('Successfully uploaded questions to Supabase', {
            status: 200,
        })
    } catch (apiError) {
        return new Response(`There was an issue with API (/upload-to-supabase)  : ${apiError}`, {
            status: 500,
        })
    }
}
