'use client'

import { mcqQuestionsModuleString } from '@/utils/types'
import AnswersSection from './answersSection'
import ExplanationsSection from './explanationsSection'

type MockupQuestionAnswerTypes = {
    showView: string
    newQuestions: mcqQuestionsModuleString[] | undefined
    currentQuestion: number
    handleQuestionChange: Function
}

export default function MockupQuestionAnswer({
    showView,
    newQuestions,
    currentQuestion,
    handleQuestionChange,
}: MockupQuestionAnswerTypes) {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div id="questionRow" className="flex gap-8">
                <button
                    className="h-fit rounded bg-blue-400 px-6 py-1 transition-colors hover:bg-blue-500"
                    onClick={() => {
                        handleQuestionChange('back')
                    }}
                >
                    back
                </button>
                <div id="question-answer-wrapper" className="w-full max-w-3xl">
                    {newQuestions?.length !== 0 && (
                        <h2 className="text-xl font-bold">{`Found Module: ${newQuestions![currentQuestion].moduleString}`}</h2>
                    )}
                    {newQuestions?.length === 0 ? (
                        <div
                            id="question-card"
                            className="flex flex-col gap-8 rounded-lg p-4 shadow-md"
                        >
                            <p className="text-base">Load new questions using the upload CSV</p>
                        </div>
                    ) : (
                        <div
                            id="question-card"
                            className="flex flex-col gap-8 rounded-lg p-4 shadow-md"
                        >
                            {/* at this point it won't be undefined */}
                            <p className="text-base">
                                {newQuestions![currentQuestion].questionStem}
                            </p>
                            <p className="text-base">
                                {newQuestions![currentQuestion].leadQuestion}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    className="h-fit rounded bg-blue-400 px-6 py-1 transition-colors hover:bg-blue-500"
                    onClick={() => {
                        handleQuestionChange('forward')
                    }}
                >
                    next
                </button>
            </div>

            {
                {
                    answers: <AnswersSection newQuestionSingle={newQuestions![currentQuestion]} />,
                    explanations: (
                        <ExplanationsSection newQuestionSingle={newQuestions![currentQuestion]} />
                    ),
                }[showView]
            }
        </div>
    )
}
