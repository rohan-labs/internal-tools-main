'use client'
import { Dialog, DialogPanel, DialogTitle, Description, DialogBackdrop } from '@headlessui/react'
import { useState } from 'react'
import { type modules, type mcqQuestionsModuleString } from '@/utils/types'
import toast from 'react-hot-toast'

interface AssignedModuleDictionary<T> {
    [Key: string]: T
}

type NewQuestionFormProps = {
    newQuestionOpen: boolean
    setNewQuestionOpen: (value: boolean) => void
    setQuestionToUpload: (value: mcqQuestionsModuleString[]) => void
    setAssignedModuleId: (value: AssignedModuleDictionary<number | null>) => void
    availableModules: modules[]
    questionsToUpload: mcqQuestionsModuleString[]
}

enum ViewStates {
    Answers,
    Explanations,
}

export default function NewQuestionForm({
    newQuestionOpen,
    setNewQuestionOpen,
    setQuestionToUpload,
    availableModules,
    questionsToUpload,
    setAssignedModuleId,
}: NewQuestionFormProps) {
    // use this to toggle between answer and explanation view
    const [currentView, setCurrentView] = useState<ViewStates>(ViewStates.Answers)
    const [newQuestionData, setNewQuestionData] = useState<mcqQuestionsModuleString>({
        questionStem: '',
        leadQuestion: '',
        correctAnswerId: 0,
        answersArray: ['', '', '', '', ''],
        explanationList: ['', '', '', '', ''],
        moduleString: availableModules[0].categoryName,
    })

    const verifyQuestionPayload: () => { pass: boolean; msg: string } = () => {
        if (newQuestionData.questionStem.length <= 50) {
            return { pass: false, msg: 'Question Stem is too short! Try again' }
        } else if (
            newQuestionData.answersArray.filter((answer) => answer.length === 0).length !== 0
        ) {
            // check to see if any answer string has a length of zero
            return { pass: false, msg: 'Incomplete answers! Try again' }
        } else if (
            newQuestionData.explanationList.filter((explain) => explain.length === 0).length !== 0
        ) {
            // check to see if any answer string has a length of zero
            return { pass: false, msg: 'Incomplete explanations! Try again' }
        }

        return { pass: true, msg: 'Question is okay' }
    }
    const addQuestionToArray = (closeOnComplete: boolean = true) => {
        try {
            const verify: { pass: boolean; msg: string } = verifyQuestionPayload()

            if (verify.pass) {
                const newQuestions = [...questionsToUpload, newQuestionData]
                let assignedModuleIdDict: AssignedModuleDictionary<number | null> = {}
                setQuestionToUpload(newQuestions)
                newQuestions.forEach((question: mcqQuestionsModuleString) => {
                    // return the object if the corresponding string exists
                    const moduleExists: modules | null =
                        availableModules.find(
                            (questionObj) => questionObj.categoryName === question.moduleString
                        ) || null
                    // now return dictionary key (assuming no duplicates) and value based on findings
                    if (!Object.keys(assignedModuleIdDict).includes(question.moduleString)) {
                        assignedModuleIdDict[question.moduleString] =
                            moduleExists?.categoryId ?? null
                    }
                })
                console.log(assignedModuleIdDict)
                setAssignedModuleId(assignedModuleIdDict)

                console.log(newQuestionData)
                setNewQuestionData({
                    questionStem: '',
                    leadQuestion: '',
                    correctAnswerId: 0,
                    answersArray: ['', '', '', '', ''],
                    explanationList: ['', '', '', '', ''],
                    moduleString: availableModules[0].categoryName,
                })
                toast.success('Question successfully added!')
                if (closeOnComplete) setNewQuestionOpen(false)
            } else {
                throw new Error(verify.msg)
            }
        } catch (error) {
            toast.error(`There was an error with your question: ${error}`)
        }
    }

    return (
        <>
            <Dialog
                open={newQuestionOpen}
                onClose={() => setNewQuestionOpen(false)}
                className="relative z-50"
            >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="h-full w-screen space-y-4 border bg-white p-8">
                        <DialogTitle className="font-bold">Add Question</DialogTitle>
                        <Description>
                            <button
                                className="h-fit rounded bg-purple-500 px-6 py-1 transition-colors hover:bg-purple-400"
                                onClick={() => {
                                    if (currentView === ViewStates.Answers) {
                                        setCurrentView(ViewStates.Explanations)
                                    } else {
                                        setCurrentView(ViewStates.Answers)
                                    }
                                }}
                            >
                                {`Current View: ${currentView === ViewStates.Answers ? 'Answers' : 'Explanations'}`}
                            </button>
                        </Description>
                        <div className="flex h-[90%] w-full flex-col justify-between">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-700">Question Stem</label>
                                <textarea
                                    value={newQuestionData.questionStem}
                                    className="min-h-28 w-full rounded text-sm outline outline-1 outline-teal-700 focus:outline-2"
                                    onChange={(e) => {
                                        setNewQuestionData((newQuestionData) => ({
                                            ...newQuestionData,
                                            questionStem: e.target.value,
                                        }))
                                    }}
                                />

                                <label className="text-sm text-gray-700">Lead Question</label>
                                <input
                                    type="text"
                                    value={newQuestionData.leadQuestion as string}
                                    className="w-full rounded text-sm outline outline-1 outline-teal-700 focus:outline-2"
                                    onChange={(e) => {
                                        setNewQuestionData((newQuestionData) => ({
                                            ...newQuestionData,
                                            leadQuestion: e.target.value,
                                        }))
                                    }}
                                />

                                <div className="flex gap-8">
                                    <p>{`Correct Answer Index: `}</p>

                                    <select
                                        id="view-mode"
                                        className="rounded-lg border border-gray-400"
                                        value={newQuestionData.correctAnswerId}
                                        onChange={(e) => {
                                            setNewQuestionData((newQuestionData) => ({
                                                ...newQuestionData,
                                                correctAnswerId: parseInt(e.target.value),
                                            }))
                                        }}
                                    >
                                        <option value={0}>{0}</option>
                                        <option value={1}>{1}</option>
                                        <option value={2}>{2}</option>
                                        <option value={3}>{3}</option>
                                        <option value={4}>{4}</option>
                                    </select>
                                </div>

                                <div className="flex gap-8">
                                    <p>{`Selected Module: `}</p>

                                    <select
                                        id="view-mode"
                                        className="rounded-lg border border-gray-400"
                                        value={newQuestionData.moduleString}
                                        onChange={(e) => {
                                            setNewQuestionData((newQuestionData) => ({
                                                ...newQuestionData,
                                                moduleString: e.target.value,
                                            }))
                                        }}
                                    >
                                        {availableModules.map((module: modules) => {
                                            return (
                                                <option
                                                    key={module.categoryId + module.categoryName}
                                                    value={module.categoryName}
                                                >
                                                    {`${module.categoryName}`}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {currentView === ViewStates.Answers &&
                                        newQuestionData.answersArray.map(
                                            (answer: string, index: number) => {
                                                return (
                                                    <>
                                                        <label className="text-sm text-gray-700">{`Answer ${index}`}</label>
                                                        <textarea
                                                            value={answer}
                                                            className="h-20 w-full rounded text-sm outline outline-1 outline-teal-700 focus:outline-2"
                                                            onChange={(e) => {
                                                                let newAnswerArray =
                                                                    newQuestionData.answersArray
                                                                newAnswerArray[index] =
                                                                    e.target.value
                                                                setNewQuestionData(
                                                                    (newQuestionData) => ({
                                                                        ...newQuestionData,
                                                                        answersArray:
                                                                            newAnswerArray,
                                                                    })
                                                                )
                                                            }}
                                                        />
                                                    </>
                                                )
                                            }
                                        )}

                                    {currentView === ViewStates.Explanations &&
                                        newQuestionData.explanationList.map(
                                            (explanation: string, index: number) => {
                                                return (
                                                    <>
                                                        <label className="text-sm text-gray-700">{`Explanation ${index}`}</label>
                                                        <textarea
                                                            value={explanation}
                                                            className="h-20 w-full rounded bg-sky-100 text-sm outline outline-1 outline-teal-700 focus:outline-2"
                                                            onChange={(e) => {
                                                                let newExplanationList =
                                                                    newQuestionData.explanationList
                                                                newExplanationList[index] =
                                                                    e.target.value
                                                                setNewQuestionData(
                                                                    (newQuestionData) => ({
                                                                        ...newQuestionData,
                                                                        explanationList:
                                                                            newExplanationList,
                                                                    })
                                                                )
                                                            }}
                                                        />
                                                    </>
                                                )
                                            }
                                        )}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    className="h-fit rounded bg-red-500 px-6 py-1 transition-colors hover:bg-red-400"
                                    onClick={() => setNewQuestionOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="h-fit rounded bg-blue-500 px-6 py-1 transition-colors hover:bg-blue-400"
                                    onClick={() => addQuestionToArray()}
                                >
                                    Submit new question
                                </button>
                                <button
                                    className="h-fit rounded bg-teal-500 px-6 py-1 transition-colors hover:bg-teal-400"
                                    onClick={() => addQuestionToArray(false)}
                                >
                                    Submit new question without closing
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
