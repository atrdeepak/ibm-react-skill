import { inventoryLocationSchema } from 'modules/entities/schemas/physical-inventory/inventory-locations-schema';
import { inventoryRunDetailsSchema } from 'modules/entities/schemas/physical-inventory/inventoryRunDetails.schema';
import getSearchResults from 'modules/entities/selectors/page-search';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { getPageFiltersForPageKey } from 'modules/page-filters/page-filters.selectors';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import IGlobalState from 'types/global-state';

const getEntities = (state: IGlobalState) => state.entities;

/** get selected inventory run details */
export const getInventoryRunDetails = createSelector(getEntities, entities => {
  return denormalize(
    entities.inventoryRunDetails,
    [inventoryRunDetailsSchema],
    entities,
  );
});

/** get the Run code for all the associated locations of run in Run details page */
export const getRunCode = createSelector(
  getInventoryRunDetails,
  inventoryRunDetailsData => {
    const runCode = inventoryRunDetailsData.code || '';
    return runCode;
  },
);

/** Get Locations data from entities */
export const getLocationsData = createSelector(
  getInventoryRunDetails,
  inventoryRunDetailsData => {
    const locationData = inventoryRunDetailsData.locations || [];
    return locationData;
  },
);

/** Get Total Count and Value of Locations */
export const getTotalCountAndValueOfLocations = createSelector(
  getLocationsData,
  locationData => {
    const totalValue = locationData.reduce((acc: any, obj: any) => {
      return acc + (obj.total ? obj.total : 0);
    }, 0);
    const footerData = {
      totalCount: locationData.length ? locationData.length : '0',
      totalValue: String(totalValue ? totalValue.toFixed(5) : '0'),
    };
    return footerData;
  },
);

/** get all inventory locations  */
const getAllInventoryLocations = createSelector(getEntities, entities => {
  return denormalize(
    Object.keys(entities.inventoryLocations || []),
    [inventoryLocationSchema],
    entities,
  );
});

/** Filtered Inventory Locations */
export const getFilteredInventoryLocations = createSelector(
  [getAllInventoryLocations, getInventoryRunDetails],
  (allLocations, runDetailsLocations) => {
    const filteredLocations =
      runDetailsLocations.locations &&
      allLocations &&
      allLocations.filter(
        (elem: any) =>
          !runDetailsLocations.locations.find(({ name }: any) => elem.name === name),
      );
    return filteredLocations;
  },
);

/** returns Inventory locations page filters */
const getInventoryLocationsPageFilters = (state: IGlobalState) => {
  const pageFilters = getPageFiltersForPageKey(state, PageKey.INVENTORY_RUN_DETAILS);
  return pageFilters;
};

const copyLocationsSearchSchema = {
  name: 'string',
  b2bUnit: {
    name: 'string',
    uid: 'string',
  },
};

/** Get copy Locations data from entities */
export const getCopyLocationsData = createSelector(
  [getLocationsData, getInventoryLocationsPageFilters],
  (inventoryRunDetailsData, pageFilters) => {
    const locationData =
      pageFilters && pageFilters.searchTerm
        ? getSearchResults(
            inventoryRunDetailsData,
            pageFilters.searchTerm,
            copyLocationsSearchSchema,
          )
        : inventoryRunDetailsData;
    return locationData;
  },
);

/** Inventory Location search schema */
const locationsSearchSchema = {
  name: 'string',
  unitOfMeasure: 'string',
};

/** searched Inventory Locations */
export const getSearchedInventoryLocations = createSelector(
  [getFilteredInventoryLocations, getInventoryLocationsPageFilters],
  (allFilteredLocations, pageFilters) => {
    const searchTermFilteredlocations =
      (allFilteredLocations || []) && pageFilters && pageFilters.searchTerm
        ? getSearchResults(
            allFilteredLocations,
            pageFilters.searchTerm,
            locationsSearchSchema,
          )
        : allFilteredLocations;
    return searchTermFilteredlocations;
  },
);
