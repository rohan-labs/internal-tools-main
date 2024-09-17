'use client'

import { useState } from 'react'
import MockupQuestionAnswer from '@/components/mockupQuestionAnswer/mockupQuestionAnswer'
import { type mcqQuestionsModuleString, type modules } from '../utils/types'
import toast from 'react-hot-toast'
import AssignModuleId from './AssignModuleId'
import NewQuestionForm from './NewQuestionForm'

interface CSVPageTypes {
    availableModules: modules[]
}

// ? create a new interface type for a dictionary with an input T to specify the key-value type
interface AssignedModuleDictionary<T> {
    [Key: string]: T
}

export default function CSVPageMain({ availableModules }: CSVPageTypes) {
    const [showView, setShowView] = useState<string>('answers')
    const [csvFile, setCsvFile] = useState<File | null>(null)

    const [assignedModuleId, setAssignedModuleId] = useState<
        AssignedModuleDictionary<number | null>
    >({})

    // ! replace this with the above!!!!
    const [questionsToUpload, setQuestionsToUpload] = useState<mcqQuestionsModuleString[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [newQuestionOpen, setNewQuestionOpen] = useState(false)

    // TODO: Ability to edit current question
    // ? "I really am lazy and i would like to move on. good luck to the rest of the team <3" - JL

    const processNewCSV = async () => {
        // load csv here and alert of any errors
        if (!csvFile) {
            toast.error('No CSV file chosen. Try again')
            return
        }
        try {
            toast('Loading CSV...', {
                icon: '👏',
            })
            const fileData = new FormData()
            fileData.append('file', csvFile)
            const response = await fetch('/api/process-csv', {
                method: 'POST',
                body: fileData,
            })
            // need to use await to get the json object
            const data: mcqQuestionsModuleString[] = await response.json()
            let assignedModuleIdDict: AssignedModuleDictionary<number | null> = {}

            //Before assigning questions, update assignedModuleId with found values if applicable
            data.slice(1).forEach((question: mcqQuestionsModuleString) => {
                // return the object if the corresponding string exists
                const moduleExists: modules | null =
                    availableModules.find(
                        (questionObj) => questionObj.categoryName === question.moduleString
                    ) || null
                // now return dictionary key (assuming no duplicates) and value based on findings
                if (!Object.keys(assignedModuleIdDict).includes(question.moduleString)) {
                    assignedModuleIdDict[question.moduleString] = moduleExists?.categoryId ?? null
                }
            })
            console.log(assignedModuleIdDict)
            setAssignedModuleId(assignedModuleIdDict)
            setCurrentQuestion(0)
            setQuestionsToUpload(data.slice(1)) // slice as we need to remove the headers

            toast.success('CSV loaded successfully')
        } catch (error) {
            console.error(error)
            toast.error('There has been an issue with processing CSV')
            setQuestionsToUpload([])
            setAssignedModuleId({})
        }
    }

    const handleQuestionChange = (direction: 'back' | 'forward') => {
        let newPosition = currentQuestion
        if (direction === 'back') {
            newPosition -= 1
            if (newPosition <= 0) {
                newPosition = 0
            }
        } else if (direction === 'forward') {
            newPosition += 1
            if (newPosition >= questionsToUpload.length) {
                newPosition = questionsToUpload.length - 1
            }
        }
        setCurrentQuestion(newPosition)
    }

    const handleAssignedModuleIdChange = (dictKey: string, newId: number) => {
        setAssignedModuleId((prevDict) => ({ ...prevDict, [dictKey]: newId }))
    }

    const clearCurrentQuestion = () => {
        if (questionsToUpload.length === 0) {
            toast.error('Question list is empty')
            return
        }

        console.log('clearing current question...')

        // this is a dumb way but i dont really care anymore
        // create a new array, looping through current and ignoring the index
        const newArray = questionsToUpload.map((question, index) => {
            if (index !== currentQuestion) return question
        })

        // if the array ever has a length of zero (i.e array with one undefined element), we set an empty array
        const checkArrayForUndefined = newArray.filter((question) => question !== undefined)

        let newPosition = currentQuestion - 1

        // ensure that new position is possible
        if (newPosition >= newArray.length) {
            newPosition = newArray.length - 1
        } else if (newPosition < 0) {
            newPosition = 0
        }

        setQuestionsToUpload(checkArrayForUndefined.length === 0 ? [] : checkArrayForUndefined)
        setCurrentQuestion(newPosition)
    }

    const handleUploadQuestionsToSupabase = async () => {
        const toastId = toast.loading('Uploading questions to Supabase')
        const payloadBody = {
            assignedModuleId: assignedModuleId,
            questionsToUpload: questionsToUpload,
        }

        const response = await fetch('/api/upload-to-supabase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadBody),
        })

        switch (response.status) {
            case 200:
                toast.success('Questions successfully uploaded to Preclinify!', { id: toastId })
                setQuestionsToUpload([])
                setAssignedModuleId({})
                break

            case 500:
                toast.error('There was an error with api', { id: toastId })

                break
            case 400:
                toast.error('There was an error with supabase', { id: toastId })
                break
            default:
                toast.error('Error not handled', { id: toastId })
                console.error(response)
                break
        }
    }

    return (
        <>
            <div id="csv-loading-wrapper" className="my-4 flex flex-wrap gap-8">
                <div className="flex flex-col">
                    <NewQuestionForm
                        newQuestionOpen={newQuestionOpen}
                        setNewQuestionOpen={setNewQuestionOpen}
                        availableModules={availableModules}
                        setQuestionToUpload={setQuestionsToUpload}
                        questionsToUpload={questionsToUpload}
                        setAssignedModuleId={setAssignedModuleId}
                    />

                    <label htmlFor="view-mode" className="text-sm">
                        Show answers or explanations
                    </label>
                    <select
                        id="view-mode"
                        className="rounded-lg border border-gray-400"
                        value={showView}
                        onChange={(event) => setShowView(event?.target.value)}
                    >
                        <option value="answers">Show Answers</option>
                        <option value="explanations">Show Explanations</option>
                    </select>
                </div>
                <label
                    htmlFor="csvFile"
                    className="h-fit rounded bg-preclinify-primary px-6 py-1 transition-colors hover:cursor-pointer hover:bg-teal-500"
                >
                    Upload CSV here
                </label>
                <input
                    type="file"
                    id="csvFile"
                    hidden
                    accept=".csv"
                    onChange={(event) => setCsvFile(event.target.files![0])}
                />
                <button
                    className="h-fit rounded bg-orange-500 px-6 py-1 transition-colors hover:bg-orange-400"
                    onClick={processNewCSV}
                >
                    Process CSV here
                </button>
                <button
                    className="h-fit rounded bg-purple-500 px-6 py-1 transition-colors hover:bg-purple-400"
                    onClick={() => setNewQuestionOpen(true)}
                >
                    Create new question
                </button>
                <button
                    className="h-fit rounded bg-red-500 px-6 py-1 transition-colors hover:bg-red-400 disabled:bg-slate-200 disabled:text-gray-500"
                    onClick={() => {
                        clearCurrentQuestion()
                    }}
                >
                    Clear current question
                </button>

                <button
                    className="h-fit rounded bg-red-500 px-6 py-1 transition-colors hover:bg-red-400 disabled:bg-slate-200 disabled:text-gray-500"
                    onClick={() => {
                        setQuestionsToUpload([])
                        setAssignedModuleId({})
                    }}
                >
                    Clear all questions and category assignments
                </button>
            </div>
            <div>
                <p className="text-sm">{'Current File Name'}</p>
                <p>{csvFile?.name ?? 'No file selected'}</p>
            </div>
            <MockupQuestionAnswer
                showView={showView}
                newQuestions={questionsToUpload}
                currentQuestion={currentQuestion}
                handleQuestionChange={handleQuestionChange}
            />

            {Object.keys(assignedModuleId).length !== 0 && (
                <AssignModuleId
                    assignedModuleId={assignedModuleId}
                    handleAssignedModuleIdChange={handleAssignedModuleIdChange}
                    availableModules={availableModules}
                />
            )}
            {questionsToUpload.length !== 0 && (
                <>
                    <button
                        onClick={handleUploadQuestionsToSupabase}
                        className="h-fit rounded-lg bg-red-500 px-6 py-1 font-bold text-white transition-colors hover:bg-red-400 disabled:bg-slate-200 disabled:text-gray-500"
                        disabled={Object.keys(assignedModuleId).some(
                            (el) => assignedModuleId[el] === null
                        )}
                    >
                        UPLOAD NEW QUESTIONS TO DATABASE
                    </button>
                    <p className="text-sm font-bold text-red-700">
                        <span className="font-extrabold">WARNING: </span> Please check that all
                        questions are valid with correct modules before uploading!
                    </p>
                </>
            )}
        </>
    )
}
