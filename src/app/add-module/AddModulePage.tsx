'use client'

import { type modules } from '@/utils/types'
import { useState } from 'react'
import { uploadNewModule } from '@/actions/supabaseModuleUpdates'
import toast from 'react-hot-toast'

export default function AddModulePageMain({ availableModules }: { availableModules: modules[] }) {
    const [searchModule, setSearchModule] = useState('')
    const [newModule, setNewModule] = useState('')

    const handleUpdateModule = async () => {
        if (newModule.length <= 2) {
            toast.error('Please enter a valid module name ')
            return
        }
        await uploadNewModule(newModule)
        setNewModule('')
    }

    return (
        <div id="module-showcase-wrapper" className="flex w-full gap-8">
            <div id="show-modules " className="flex w-full flex-col gap-4 p-2 shadow-md">
                <h2 className="text-lg font-bold underline">Current Modules</h2>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">Search for module...</label>
                    <input
                        type="text"
                        value={searchModule}
                        className="rounded outline outline-1 outline-teal-700 focus:outline-2"
                        onChange={(e) => setSearchModule(e.target.value)}
                    />
                </div>
                <div id="availableModules-wrapper" className="mt-4 flex flex-col gap-4">
                    {availableModules.map((module: modules) => {
                        {
                            if (
                                searchModule === '' ||
                                (searchModule !== '' &&
                                    module.categoryName
                                        .toLowerCase()
                                        .includes(searchModule.toLowerCase()))
                            )
                                return (
                                    <p
                                        key={module.categoryId + '-key'}
                                    >{`${module.categoryId}) ${module.categoryName}`}</p>
                                )
                        }
                    })}
                </div>
            </div>

            <div id="add-module" className="flex w-full flex-col gap-4 p-2 shadow-md">
                <h2 className="text-lg font-bold underline">Add Module</h2>
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">Enter new module...</label>
                    <input
                        type="text"
                        value={newModule}
                        className="rounded outline outline-1 outline-teal-700 focus:outline-2"
                        onChange={(e) => {
                            setNewModule(e.target.value)
                        }}
                    />
                </div>

                <button
                    className="h-fit rounded bg-red-500 px-6 py-1 transition-colors hover:bg-red-400 disabled:bg-slate-200 disabled:text-gray-500"
                    onClick={handleUpdateModule}
                    disabled={newModule.length <= 2}
                >
                    Upload new module
                </button>

                <p className="text-sm font-bold text-red-700">
                    <span className="font-extrabold">WARNING: </span> Ensure that you have checked
                    the current modules list on the left and confirm that the module you are about
                    to upload does not already exist
                </p>
            </div>
        </div>
    )
}
