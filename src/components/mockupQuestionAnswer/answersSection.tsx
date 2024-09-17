'use client'
import { mcqQuestionsModuleString } from '@/utils/types'

type AnswerSectionTypes = {
    newQuestionSingle: mcqQuestionsModuleString | undefined
}

export default function AnswersSection({ newQuestionSingle }: AnswerSectionTypes) {
    if (newQuestionSingle) {
        return (
            <div id="answers-group-wrapper " className="my-2 w-full max-w-3xl">
                {newQuestionSingle.answersArray.map((answer: string, index: number) => {
                    return (
                        <div
                            key={`answer-${index}`}
                            className="mb-2 flex flex-col gap-8 rounded-lg p-4 shadow-md"
                        >
                            <p className="text-base">{answer}</p>
                        </div>
                    )
                })}
            </div>
        )
    }
}
