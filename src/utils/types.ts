export type mcqQuestions = {
    questionStem: string
    leadQuestion: string | null
    correctAnswerId: number
    answersArray: string[]
    explanationList: string[]
    moduleId: number // gathered from modulesNew
}

export type mcqQuestionsModuleString = {
    questionStem: string
    leadQuestion: string | null
    correctAnswerId: number
    answersArray: string[]
    explanationList: string[]
    moduleString: string // gathered from modulesNew
}

export type csvRawType = {
    questionId: number
    questionStem: string
    leadInQuestion: string
    answersArray: string
    correctAnswerId: string
    explanation: string
    module: string
    presentingComplaint: string
}
export type modules = {
    categoryName: string
    categoryId: number
}
