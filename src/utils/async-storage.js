import { AsyncStorage } from 'react-native';

const storageId = '@VoudStore:';

const stringfy = (data) => {
    if (typeof data === 'boolean')
        return data ? 'true' : '';
    
    if (typeof data === 'object')
        return JSON.stringify(data);

    if (typeof data === 'number') 
        return data.toString();

    return data;
};

export const saveItem = (key, data) => AsyncStorage.setItem(storageId + key, stringfy(data));

export const getItem = (key) => AsyncStorage.getItem(storageId + key);

export const removeItem = (key) => AsyncStorage.removeItem(storageId + key);

export const getJson = (key) => getItem(key)
    .then((data) => {
        if (data)
            return JSON.parse(data);

        return null;
    });

export const mergeJson = async (key, data) => {
    const initialData = await getJson(key);

    if (initialData)
        return saveItem(key, { ...initialData, ...data });
    else
        return saveItem(key, data);
};

/**
 * wrapper around AsyncStorage.multiGet.
 * returns an async function which resolves to an object of key/value pairs
 * instead of an array of [key, value] arrays for the ease of use.
 * this method also handles the storageId prefix.
 * 
 * @param {string[]} keys - keys for the multiGet
 */
export const multiGet = async (keys) => {
    const asyncStorageKeys = keys.map(key => storageId + key);
    const data = await AsyncStorage.multiGet(asyncStorageKeys);

    return keys.reduce((obj, key, i) => {
        obj[key] = data[i][1];
        return obj;
    }, {});
};

export const multiRemove = (keys) => {
    const asyncStorageKeys = keys.map(key => storageId + key);
    return AsyncStorage.multiRemove(asyncStorageKeys);
};
