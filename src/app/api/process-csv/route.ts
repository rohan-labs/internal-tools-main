import { type csvRawType, type mcqQuestionsModuleString } from '@/utils/types'
import { parse } from 'csv'
import { finished } from 'stream/promises'
// ! delimiter is shown with *

const processBuffer = async (buffer: Buffer) => {
    const csvProcessed: csvRawType[] = []

    const headers = [
        'questionId',
        'questionStem',
        'leadInQuestion',
        'answersArray',
        'correctAnswerId', // this is a string for some reason
        'explanation',
        'module',
        'presentingComplaint',
    ]
    const parser = parse(buffer, {
        delimiter: '*',
        columns: headers,
        relax_quotes: true,
    })
    parser
        .on('data', (row: csvRawType) => {
            csvProcessed.push(row)
        })
        .on('error', (error) => {
            return new Response(`error - csv parse: ${error}`, {
                status: 400,
            })
        })
    await finished(parser)
    return csvProcessed
}

export async function POST(req: Request) {
    try {
        const fileData = await req.formData()

        const csvFile: File | null = fileData.get('file') as unknown as File // ? here we are explicity saying that this should be a File object

        // create buffer for csv processing
        const bytes = await csvFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const csvResults = await processBuffer(buffer)

        // now for each csv Entry - we create a new row
        const finalList: mcqQuestionsModuleString[] = csvResults.map((row: csvRawType) => {
            return {
                questionStem: row.questionStem,
                leadQuestion: row.leadInQuestion,
                correctAnswerId: parseInt(row.correctAnswerId),
                answersArray: row.answersArray.replace("['", '').replace("']", '').split("','"),
                explanationList: row.explanation.replace("['", '').replace("']", '').split("','"),
                moduleString: row.module,
            }
        })
        return Response.json(finalList)
    } catch (e) {
        console.error(e)
        return new Response(`error - api response: ${e}`, {
            status: 400,
        })
    }
}
