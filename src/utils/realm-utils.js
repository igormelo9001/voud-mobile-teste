import moment from 'moment';
import {
  contentListSchema,
  itemsSchema,
  predictionSchema,
  matchedSubstringsSchema,
  structuredFormattingSchema,
  termsSchema,
  textSearchSchema,
  plusCodeSchema,
  geometrySchema,
  viewportSchema,
  locationSchema
} from "../shared/realm-models";

const Realm = require("realm");

const schemas = [
  contentListSchema,
  itemsSchema,
  predictionSchema,
  matchedSubstringsSchema,
  structuredFormattingSchema,
  termsSchema,
  textSearchSchema,
  plusCodeSchema,
  geometrySchema,
  viewportSchema,
  locationSchema
];

// eslint-disable-next-line no-underscore-dangle
const _openRealm = () => {
  const realm = new Realm({
    schema: schemas,
    schemaVersion: 1,
    migration: (oldRealm, newRealm) => {
      const dateToExpire = moment(new Date())
        .add(30, "days")
        .parseZone(new Date())
        .local()
        .format("YYYY-MM-DDTHH:mm:ss");

      // only apply this change if upgrading to schemaVersion 1
      if (oldRealm.schemaVersion < 1) {
        const oldObjects = oldRealm.objects("ContentList");
        const newObjects = newRealm.objects("ContentList");
        // loop through all objects and set the name property in the new schema
        for (let i = 0; i < oldObjects.length; i++) {
          oldObjects[i].timestamp = dateToExpire;
        }
      }
    }
  });

  if (__DEV__) console.tron.log(`REALM PATH - ${realm.path}`);

  return realm;
};

export const isNewSearchTerm = async (filters, objectName) => {
  let isNew = false;
  const objResult = await queryObject(objectName, filters);

  if (typeof objResult === "object" && Object.keys(objResult).length == 0) {
    isNew = true;
  }
  return isNew;
};

export const hasObject = async nameObj => {
  return await queryObject(nameObj);
};

export const saveObject = async (
  name,
  objectToCreate,
  searchTerm,
  timestamp
) => {
  await _createObject(name, objectToCreate, searchTerm, timestamp);
};

export const whichOp = op => {
  switch (op) {
    case "eq":
      return "=";
    case "neq":
      return "!=";
    case "gt":
      return ">";
    case "lt":
      return "<";
    default:
      return "";
  }
};

export const queryObject = async (nameObject, objFilter = null) => {
  const realmInstance = _openRealm();

  if (!objFilter) return realmInstance.objects(nameObject);

  const { filters = [], operator } = objFilter;

  const flatFilters = filters
    .map((item, i) => {
      const isEven = i % 2 == 0;
      const op = isEven ? operator : "";
      return `${item.key} ${whichOp(item.operator)} $${i} ${op} `;
    })
    .reduce((acc, cur) => acc.concat(cur));

  const filterValues = [];

  for (let index = 0; index < filters.length; index++) {
    const item = filters[index];
    filterValues.push(item.value);
  }

  const [searchTerm, timestamp] = filterValues;

  const objFiltered = realmInstance
    .objects(nameObject)
    .filtered(flatFilters, searchTerm, timestamp);

  return objFiltered;
};

const _createObject = async (name, objectToCreate, searchTerm, timestamp) => {
  try {
    const realmInstance = _openRealm();
    realmInstance.write(() => {
      objectToCreate.map(item => {
        if (__DEV__) console.tron.log(`NOW date - ${timestamp}`);

        if (timestamp) item.timestamp = timestamp;
        if (searchTerm) item.searchTerm = searchTerm;
        realmInstance.create(name, item, "modified");
      });
    });
  } catch (error) {
    if (__DEV__) console.tron.log(`Error on creation - ${error}`);
  }
};

export const removeObject = async objectToDelete => {
  try {
    const realmInstance = _openRealm();
    realmInstance.write(() => {
      realmInstance.delete(objectToDelete);
    });
  } catch (error) {
    if (__DEV__) console.tron.log("Error on remotion");
  }
};
