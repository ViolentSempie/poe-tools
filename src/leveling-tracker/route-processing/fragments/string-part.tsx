type StringPartProps = {
    part: string;
}

export function StringPart({ part }: StringPartProps) {
    return (
        <div className="flex flex-row space-x-3">
            <div className="flex items-center w-6 justify-center"></div>

            <div className="flex flex-row min-w-0 flex-1 space-x-1 pt-0.5">
                <p className="text-gray-100">
                    {part}
                </p>
            </div>
        </div>
    );
}