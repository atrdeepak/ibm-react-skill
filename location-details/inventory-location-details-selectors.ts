import { sortUnitSize } from 'helpers/tables';
import { orderBy } from 'lodash';
import { inventoryLocationDetailsSchema } from 'modules/entities/schemas/physical-inventory/inventoryLocationDetails.schema';
import getSearchResults from 'modules/entities/selectors/page-search';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import IGlobalState from 'types/global-state';
import { ILocationEntry } from 'types/inventory-location-details';
import IProduct from 'types/product';

const getEntities = (state: IGlobalState) => {
  return state.entities;
};

const getSortId = (state: IGlobalState) =>
  state.physicalInventory.inventoryLocationDetails.sortId;

const getSortDesc = (state: IGlobalState) =>
  state.physicalInventory.inventoryLocationDetails.isSortDesc;

const getIsExceptionsView = (state: IGlobalState) =>
  state.physicalInventory.inventoryLocationDetails.isExceptionsView;

/** Schema for location details search */
const locationDetailsSchema = {
  name: 'string',
  codeText: 'string',
  ndc: 'string',
  supplierName: 'string',
  abcFormCodeDesc: 'string',
  abcSellingSize: 'string',
};

/** Get the search term from the global state */
const getSearchTerm = (state: IGlobalState) => {
  return state.pageFilters[PageKey.INVENTORY_LOCATION_DETAILS]
    ? state.pageFilters[PageKey.INVENTORY_LOCATION_DETAILS].searchTerm
    : '';
};

/** Location Detials Selector */
export const getInventoryLocationDetails = createSelector(getEntities, entities => {
  return denormalize(
    entities.inventoryLocationDetails,
    [inventoryLocationDetailsSchema],
    entities,
  );
});

/** TODO: Add comment */
export const getSelectedProductItemIds = (state: IGlobalState) =>
  state.physicalInventory.inventoryLocationDetails.selectedProductIds;

/** Get All Entries */
export const getAllEntries = (state: IGlobalState) => {
  return getInventoryLocationDetails(state).entries || [];
};

/** Delete Products Selector */
export const getSelectedProductDetails = createSelector(
  getAllEntries,
  getInventoryLocationDetails,
  getSelectedProductItemIds,
  (entries: ILocationEntry[], runLocationDetails, selectedProductIds) => {
    const details =
      entries &&
      entries
        .filter(entry => selectedProductIds.includes(entry.code))
        .map(entry => {
          return {
            name: entry.name || 'unknown',
            code: entry.code,
            scannedBarcode: entry.scannedBarcode || entry.codeText || '',
          };
        });
    return {
      ...runLocationDetails,
      entries: details,
    };
  },
);

/** Sort entry unit sizes  */
const isUnitSizeSort = (sortId: string) => sortId === 'abcSellingSize';

const getSortByUnitSize = (isSortDesc: boolean) => {
  return (a: any, b: any): number => {
    const aVal = a.abcSellingSize;
    const bVal = b.abcSellingSize;
    if (!aVal) {
      return isSortDesc ? 1 : -1;
    } else if (!bVal) {
      return isSortDesc ? -1 : 1;
    } else {
      const val = sortUnitSize(aVal, bVal) ? -1 : 1;
      return val * (isSortDesc ? -1 : 1);
    }
  };
};

const getSortedLocationEntries = createSelector(
  [getAllEntries, getSortId, getSortDesc],
  (locationDetails, sortId, isSortDesc) => {
    const sortDirection = isSortDesc ? 'desc' : 'asc';
    return isUnitSizeSort(sortId)
      ? [...locationDetails].sort(getSortByUnitSize(isSortDesc))
      : orderBy(locationDetails, sortId, sortDirection);
  },
);

/** Selector for getting all entries and the search term */
export const getSortedInitialProducts = createSelector(
  getSortedLocationEntries,
  getSearchTerm,
  (inventoryLocationDetails, searchTerm) => {
    return searchTerm
      ? getSearchResults(inventoryLocationDetails, searchTerm, locationDetailsSchema)
      : inventoryLocationDetails;
  },
);
/** Exception Entries Selector */
export const getExceptionEntries = createSelector(
  getSortedInitialProducts,
  locationEntries => {
    const exceptionEntries =
      locationEntries && Object.values(locationEntries)
        ? Object.values(locationEntries).filter((entry: ILocationEntry) => {
            return entry.reasonCode && entry.reasonCode.code;
          })
        : locationEntries;
    return exceptionEntries;
  },
);

/** Selector for getting all entries and the search term */
export const getAllLocationEntries = createSelector(
  getSortedInitialProducts,
  getExceptionEntries,
  getIsExceptionsView,
  (locationEntries, exceptionEntries, isExceptionsView) => {
    return isExceptionsView ? exceptionEntries : locationEntries;
  },
);

/** Get Total Count and Value of Products */
export const getTotalCountAndValueOfLocations = createSelector(
  getInventoryLocationDetails,
  locationData => {
    const entriesArray = locationData.entries || [];
    const totalValue = entriesArray.reduce((acc: any, obj: any) => {
      return acc + (obj.total ? obj.total : 0);
    }, 0);
    const footerData = {
      totalCount: entriesArray.length ? entriesArray.length : '0',
      totalValue: String(totalValue ? totalValue.toFixed(5) : '0'),
    };
    return footerData;
  },
);
/** Sorted ABC and Non ABC Products */
export const sortAbcAndNonAbcProducts = (products: any[]) => {
  return (
    typeof products !== 'undefined' &&
    products.sort((a: any, b: IProduct) => {
      let namea = a.name;
      let nameb = b.name;
      namea = namea ? namea : '';
      nameb = nameb ? nameb : '';
      const nameA = namea.toUpperCase();
      const nameB = nameb.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    })
  );
};
/** ABC and Non ABC Products */
export const getAbcAndNonAbcProductDetails = (state: IGlobalState) =>
  state.entities.abcAndNonAbcProductDetails;

/** ABC and Non ABC Products */
export const getSortedAbcAndNonAbcProductDetails = createSelector(
  getAbcAndNonAbcProductDetails,
  abcAndNonAbcProducts => {
    return abcAndNonAbcProducts && abcAndNonAbcProducts.length > 0
      ? sortAbcAndNonAbcProducts(abcAndNonAbcProducts)
      : abcAndNonAbcProducts;
  },
);

/** Get Total Count and Value of Products */
export const areAllProductsSelected = createSelector(
  getInventoryLocationDetails,
  getSelectedProductItemIds,
  (locationDetails, selectedProductIds) => {
    return (
      locationDetails.entries &&
      locationDetails.entries.length !== 0 &&
      locationDetails.entries.length === selectedProductIds.length
    );
  },
);
