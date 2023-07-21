export const excludeQueryParams = (query, excludeList) =>
    Object.keys(query).reduce((object, key) => {
        if (!excludeList.includes(key)) {
            object[key] = query[key]
        }
        return object
    }, {})

export const getActiveFilterLabels = (query, paramToLabel, excludeList = []) =>
    Object.keys(query)
        .map(
            (key) =>
                !excludeList.includes(key) &&
                paramToLabel[key] && {
                    key,
                    ...(typeof paramToLabel[key] === 'object' ? paramToLabel[key] : { label: paramToLabel[key]() }),
                }
        )
        .filter((x) => x)
