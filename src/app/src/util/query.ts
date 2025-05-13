/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Converts an object into a query string.
 * @param params - The object to be converted into query string.
 * @returns A query string representation of the object.
 */
export const toQueryString = (params: Record<string, any>): string => {
    const queryString = new URLSearchParams();

    // Iterate over the object keys and append them to the URLSearchParams object
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryString.append(key, String(value)); // Convert value to string to ensure proper formatting
        }
    });

    return queryString.toString();
};
