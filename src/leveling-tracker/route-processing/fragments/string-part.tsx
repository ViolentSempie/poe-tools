import { reduce } from "@/utils/reduce";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type StringPartProps = {
    part: string;
}

export function StringPart({ part }: StringPartProps) {
    return reduce(part.trim(), {
        "➞": () => <p className="text-gray-100">
            <FontAwesomeIcon icon={faArrowRight} />
        </p>,
        _: () => <p className="text-gray-100">{part}</p>,
    });
}