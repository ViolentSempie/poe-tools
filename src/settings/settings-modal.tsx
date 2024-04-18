import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { classNames } from '@/utils/classnames';
import { useFeatureStore } from '@/stores/features';
import { FeaturesTab } from './features/features-tab';
import { ExileLevelingTab } from './exile-leveling/exile-leveling-tab';

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

export default function SettingsModal({ open, setOpen }: SettingsModalProps) {
    const cancelButtonRef = useRef(null);
    const features = useFeatureStore((state) => state.features);
    const getTabs = useFeatureStore((state) => state.getTabs);

    const [tabs, setTabs] = useState([
        { name: 'Features', isActive: true, current: true },
        ...getTabs(),
    ]);

    useEffect(() => {
        const newTabs = [...tabs];
        // loop through features and set isActive to true in tabs if enabled
        Object.keys(features).forEach((feature) => {
            const index = newTabs.findIndex((tab) => tab.name === features[feature as keyof typeof features].name);
            if (index !== -1) {
                newTabs[index].isActive = features[feature as keyof typeof features].enabled;
            }
        });
        setTabs(newTabs);
    }, [features]);

    const renderTabs = tabs.filter((tab) => tab.isActive);

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

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-gray-100 bg-slate-800 text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
                                <div>
                                    <div className="text-left">
                                        <Dialog.Title as="div" className="text-base font-semibold text-gray-100 p-2 border-b border-slate-900">
                                            Settings
                                        </Dialog.Title>

                                        <div className="block border-b border-slate-900">
                                            <nav className="flex space-x-4 px-2" aria-label="Tabs">
                                                {renderTabs.map((tab) => (
                                                    <a
                                                        key={tab.name}
                                                        href="#"
                                                        className={classNames(
                                                            tab.current
                                                              ? 'border-violet-500 text-violet-600'
                                                              : 'border-transparent text-slate-100 hover:text-violet-700',
                                                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                                                          )}
                                                        aria-current={tab.current ? 'page' : undefined}
                                                        onClick={() => setTabs(tabs.map((t) => ({ ...t, current: t.name === tab.name })))}
                                                    >
                                                        {tab.name}
                                                    </a>
                                                ))}
                                            </nav>
                                        </div>

                                        <div className="flex p-2">
                                            {tabs.find((tab) => tab.name === "Features" && tab.current) && ( 
                                                <FeaturesTab />
                                            )}
                                            {tabs.find((tab) => tab.name === "exile leveling" && tab.current) && (
                                                <ExileLevelingTab />
                                            )}
                                        </div>
                                    </div>
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
