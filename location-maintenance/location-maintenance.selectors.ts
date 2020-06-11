import { inventoryLocationSchema } from 'modules/entities/schemas/physical-inventory/inventory-locations-schema';
import getSearchResults from 'modules/entities/selectors/page-search';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { getPageFiltersForPageKey } from 'modules/page-filters/page-filters.selectors';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import IGlobalState from 'types/global-state';

const getEntities = (state: IGlobalState) => state.entities;

/** get all inventory locations  */
const getAllInventoryLocations = createSelector(getEntities, entities => {
  return denormalize(
    Object.keys(entities.inventoryLocations),
    [inventoryLocationSchema],
    entities,
  );
});

/** returns Inventory locations page filters */
const getInventoryLocationsPageFilters = (state: IGlobalState) => {
  const pageFilters = getPageFiltersForPageKey(state, PageKey.LOCATION_MAINTENANCE);
  return pageFilters;
};

/** Inventory Location search schema */
const locationsSearchSchema = {
  name: 'string',
  unitOfMeasure: 'string',
};

/** Filtered Inventory Locations */
export const getFilteredInventoryLocations = createSelector(
  [getAllInventoryLocations, getInventoryLocationsPageFilters],
  (allLocations, pageFilters) => {
    const searchTermFilteredlocations =
      pageFilters && pageFilters.searchTerm
        ? getSearchResults(
            allLocations,
            pageFilters.searchTerm,
            locationsSearchSchema,
          )
        : allLocations;

    return searchTermFilteredlocations;
  },
);
