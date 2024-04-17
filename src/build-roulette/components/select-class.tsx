import { useRouletteStore } from "@/stores/roulette";
import { classNames } from "@/utils/classnames"
import { faCheck, faChevronDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { IconImage } from "./icon-image";

export default function SelectClass() {
    const tree = useRouletteStore((state) => state.passiveTree);
    const selectedClass = useRouletteStore((state) => state.selectedClass);
    const setSelectedClass = useRouletteStore((state) => state.setSelectedClass);

    if (!tree.isLoaded) {
        return <FontAwesomeIcon icon={faSpinner} spin />;
    }

    return (
        <Listbox value={selectedClass} onChange={setSelectedClass}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block text-sm font-medium leading-6 text-slate-100">Select class</Listbox.Label>
                    <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-slate-700 py-1.5 pl-3 pr-10 text-left text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">{tree.classes[selectedClass].name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <FontAwesomeIcon icon={faChevronDown} className="h-5 w-5 text-slate-300" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {Object.keys(tree.classes).map((classId) => (
                                    <Listbox.Option
                                        key={classId}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-violet-600 text-slate-100' : 'text-slate-100',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={+classId}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'flex flex-row gap-x-2')}>
                                                    <IconImage coord={tree.imageCoordinates[tree.classes[+classId].icon]} />
                                                    {tree.classes[+classId].name}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-violet-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}