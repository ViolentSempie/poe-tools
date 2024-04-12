export interface IConditionalDictionary<T> {
    [key: string | number | symbol]: (key?: string | number | symbol) => T;
    _: (key?: string | number | symbol) => T;
}

/**
 * Reduce a dictionary of conditionals to a single value
 *
 * If the condition is not found, the "_" key will be used
 *
 * If the "_" key is not found, an error will be thrown
 * @type T - The type of the value to return in the conditional
 * @param condition The condition to check for
 * @param conditionals The dictionary of conditionals
 * @returns The value of the conditional
 */
export function reduce<T>(condition: string | number | symbol, conditionals: IConditionalDictionary<T>): T {
    if (condition in conditionals) {
        return conditionals[condition]();
    }

    if ("_" in conditionals) {
        return conditionals._(condition);
    }

    throw new Error(`key ${condition.toString()} not found`);
}

/**
 * Curry the reducer, returning a reducer that accepts a condition
 *
 * If the condition is not found, the "_" key will be used
 *
 * If the "_" key is not found, an error will be thrown
 * @type T - The type of the value to return in the conditional
 * @param conditionals The dictionary of conditionals
 * @returns A function that accepts a condition
 */
export function curry<T>(conditionals: IConditionalDictionary<T>): (condition: string) => T {
    return (condition: string) => reduce(condition, conditionals);
}
