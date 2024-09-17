'use client'

import { modules } from '@/utils/types'

interface AssignedModuleDictionary<T> {
    [Key: string]: T
}
interface AssignModuleIdProps {
    assignedModuleId: AssignedModuleDictionary<number | null>
    handleAssignedModuleIdChange: (questionModule: string, newId: number) => void
    availableModules: modules[]
}

export default function AssignModuleId({
    assignedModuleId,
    handleAssignedModuleIdChange,
    availableModules,
}: AssignModuleIdProps) {
    return (
        <div className="my-2 flex flex-col gap-2">
            <h1 className="text-2xl font-bold underline"> Assigned ModuleIds</h1>
            <p className="text-sm text-gray-600">
                This is all the module names detected in your CSV upload. All module names that
                already exist have their matching moduleId/moduleName assigned. If there are missing
                assignments, there are two approaches for you to do
            </p>
            <ul className="ml-8 list-disc text-sm text-gray-600">
                <li>
                    Use the drop down to change the moduleName/ID. This is useful for misspellings
                    or spelling variants (e.g: &quot;Eye & Nose&quot;, and &quot;Eye and Nose&quot;
                    should have the same moduleId)
                </li>
                <li>
                    If you are adding a new module, navigate to &quot;Add Modules&quot; add a new
                    module to supabase
                </li>
            </ul>
            <div id="moduleId-selection-wrapper" className="my-4 flex flex-col gap-2">
                {Object.keys(assignedModuleId).map((dictKey) => {
                    return (
                        <div key={dictKey} className="flex gap-8">
                            <p className="font-bold">{dictKey}</p>
                            <p>{`ModuleId: ${assignedModuleId[dictKey] ?? 'No Module ID'}`}</p>
                            <p>{`Selected Module: `}</p>

                            <select
                                id="view-mode"
                                className="rounded-lg border border-gray-400"
                                value={assignedModuleId[dictKey] ?? -1}
                                onChange={(e) => {
                                    handleAssignedModuleIdChange(dictKey, parseInt(e.target.value))
                                }}
                            >
                                <option disabled selected value={-1}>
                                    {' '}
                                    -- select an option --{' '}
                                </option>
                                {availableModules.map((module: modules) => {
                                    return (
                                        <option
                                            key={module.categoryId + module.categoryName}
                                            value={module.categoryId}
                                        >
                                            {`${module.categoryName} (ID: ${module.categoryId})`}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
