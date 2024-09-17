'use client'
import { mcqQuestionsModuleString } from '@/utils/types'

type AnswerSectionTypes = {
    newQuestionSingle: mcqQuestionsModuleString | undefined
}

export default function ExplanationSection({ newQuestionSingle }: AnswerSectionTypes) {
    if (newQuestionSingle) {
        return (
            <div id="answers-group-wrapper " className="my-2 w-full max-w-3xl">
                {newQuestionSingle.explanationList.map((explanation: string, index: number) => {
                    console.log(index, newQuestionSingle.correctAnswerId)

                    const newColour =
                        index === newQuestionSingle.correctAnswerId ? 'bg-green-300' : 'bg-red-300'

                    return (
                        <div
                            key={`explanation-${index}`}
                            className={`mb-2 flex flex-col gap-8 rounded-lg p-4 shadow-md ${newColour}`}
                        >
                            <p className="text-base">{explanation}</p>
                        </div>
                    )
                })}
            </div>
        )
    }
}
