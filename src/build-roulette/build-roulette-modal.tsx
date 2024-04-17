import { Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouletteStore } from '@/stores/roulette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import SelectClass from './components/select-class';
import { BuildRoulette } from './components/build-roulette';
import { SkillGem } from './components/skill-gem';
type SettingsModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export type Tab = {
    name: string;
    isActive: boolean;
    current: boolean;
    featureId?: string;
};

export default function BuildRouletteModal({ open, setOpen }: SettingsModalProps) {
    const cancelButtonRef = useRef(null);
    const selectedSkillGem = useRouletteStore((state) => state.selectedSkillGem);
    const tree = useRouletteStore((state) => state.passiveTree);
    const initialize = useRouletteStore((state) => state.initialize);

    useEffect(() => {
        if (!tree.isLoaded) {
            initialize();
        }
    }, []);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform rounded-lg text-gray-100 bg-slate-800 text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
                                <div>
                                    <div className="text-left">
                                        <Dialog.Title as="div" className="text-base font-semibold text-gray-100 p-2 border-b border-slate-900">
                                            Build Roulette
                                        </Dialog.Title>
                                    </div>
                                </div>

                                <div className="p-2 gap-y-2 flex flex-col">
                                    {!tree.isLoaded && <FontAwesomeIcon icon={faSpinner} spin />}
                                    {tree.isLoaded && <SkillGem />}
                                    {tree.isLoaded && selectedSkillGem !== null && <SelectClass />}
                                    {tree.isLoaded && selectedSkillGem !== null && <BuildRoulette />}
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-b-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2"
                                        onClick={() => setOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
