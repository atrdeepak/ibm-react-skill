import { inventoryLocationDetailsSchema } from 'modules/entities/schemas/physical-inventory/inventoryLocationDetails.schema';
import {
  getInventoryLocationDetails,
  getSelectedProductItemIds,
} from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import * as Actions from 'modules/physical-inventory/location-details/location-details-types';
import { API_CALL, HS_BASE_PATH, USERNAME } from 'redux/middleware/api';
import { IProductsDeleteBody } from 'types/inventory-location-details';
import RSAA from 'types/rsaa';
import { ThunkAction } from 'types/thunk';
import {
  closeProductsSearchModal,
  openProductsSearchModal,
} from './act.inventory-location-details-modal';
const fetchSelectedLocationDetailsAction = (
  runCode: string,
  locationCode: string,
  b2bUnitId: string,
): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}/locations/${locationCode}/entries`,
      method: 'GET',
      schema: { inventoryLocationDetailsSchema },
      throwOnError: true,
      types: [
        'FETCH_LOCATION_DETAILS-REQUEST',
        'FETCH_LOCATION_DETAILS-SUCCESS',
        'FETCH_LOCATION_DETAILS-FAILURE',
      ],
    },
  };
};

/** RSAA to call service to find products matching query. */
const fetchSearchProducts = (query: string, b2bUnitId: string): RSAA => {
  return {
    [API_CALL]: {
      endpoint:
        `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/search-products?code=${encodeURIComponent(
          query,
        )}` + `&scanCode=false&includeNonAbcProduct=true`,
      method: 'GET',
      throwOnError: true,
      types: [
        'LOCATION_DETAILS_FETCH_SEARCH_PRODUCT-REQUEST',
        'LOCATION_DETAILS_FETCH_SEARCH_PRODUCT-SUCCESS',
        'LOCATION_DETAILS_FETCH_SEARCH_PRODUCT-FAILURE',
      ],
    },
  };
};

/** Toggles the selection checkbox for a single Product Entry / Exception */
export const toggleSingleProductItem = (entryToToggle: string): ThunkAction => (
  dispatch,
  getState,
) => {
  const selectedItemIds = getSelectedProductItemIds(getState());
  let itemWasSelected = false;
  const newSelectedItemIds = selectedItemIds.reduce(
    (result: any, existingEntry: any) => {
      if (existingEntry === entryToToggle) {
        itemWasSelected = true;
        return result;
      }
      return result.concat(existingEntry);
    },
    [],
  );
  if (!itemWasSelected) {
    newSelectedItemIds.push(entryToToggle);
  }
  dispatch(setSelectedItemIds(newSelectedItemIds));
};

/** Toggles the selection checkbox for a all Product Entry / Exception */
export const toggleSelectAllProduct = (): ThunkAction => (dispatch, getState) => {
  const inventoryLocationDetails = getInventoryLocationDetails(getState());
  const selectedProductsItemIds = getSelectedProductItemIds(getState());
  const newSelectedItemIds = inventoryLocationDetails.entries.reduce(
    (result: any, existingEntry: any) => {
      if (
        inventoryLocationDetails.entries.length !== selectedProductsItemIds.length
      ) {
        return result.concat(existingEntry.code);
      } else {
        return [];
      }
    },
    [],
  );
  dispatch(setAllSelectedItemIds(newSelectedItemIds));
};

/** RSAA to call service to add products matching query. */
const addProductToLocation = (
  productId: string,
  quantity: string | number,
  b2bUnitId: string,
  locationId: string,
  runCode: string,
): RSAA => {
  const body = {
    locationList: [
      {
        code: locationId,
        runCode,
        b2bUnitId,
        entries: [
          {
            code: productId,
            quantity,
            exactSearch: true,
          },
        ],
      },
    ],
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/add-location-entries`,
      method: 'POST',
      body,
      throwOnError: true,
      types: [
        'LOCATION_DETAILS_ADD_PRODUCT-REQUEST',
        'LOCATION_DETAILS_ADD_PRODUCT-SUCCESS',
        'LOCATION_DETAILS_ADD_PRODUCT-FAILURE',
      ],
    },
  };
};

/** Sets the selected Product Entries on the location details page */
export const setSelectedItemIds = (
  selectedProductIds: string[],
): Actions.ISetSelectedProductItems => ({
  payload: { selectedProductIds },
  type: 'LOCATION_DETAILS_SET_SELECTED_PRODUCT_ITEMS',
});

/** Sets all select Product Entries on the location details page */
export const setAllSelectedItemIds = (
  selectedProductIds: string[],
): Actions.ISetAllSelectedProductItems => ({
  payload: { selectedProductIds },
  type: 'LOCATION_DETAILS_SET_ALL_SELECTED_PRODUCT_ITEMS',
});

const setlocationNameAction = (
  locationName: string,
  locationCode: string,
  b2bUnitId: string,
  runCode: string,
): RSAA => {
  const body = {
    locationList: [
      {
        code: locationCode,
        name: locationName,
        runCode,
      },
    ],
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/update-run-locations`,
      method: 'PUT',
      body,
      throwOnError: true,
      types: [
        'SAVE_LOCATION_NAME_CHANGE-REQUEST',
        'SAVE_LOCATION_NAME_CHANGE-SUCCESS',
        'SAVE_LOCATION_NAME_CHANGE-FAILURE',
      ],
    },
  };
};
/** Creating Action For Refresh Acquisition Cost for products */
const refreshProductsAcquisitionCost = (
  products: string[],
  b2bUnitId: string,
  locationCode: string,
  runCode: string,
): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}/location/refresh/${locationCode}`,
      method: 'POST',
      throwOnError: true,
      body: products,
      types: [
        'REFRESH_PRODUCTS_ACQUISITION_COST-REQUEST',
        'REFRESH_PRODUCTS_ACQUISITION_COST-SUCCESS',
        'REFRESH_PRODUCTS_ACQUISITION_COST-FAILURE',
      ],
    },
  };
};

/** Creating Action For deleting products */
const deleteProductsAction = (
  b2bUnitId: string,
  body: IProductsDeleteBody,
): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/delete-location-entries`,
      method: 'DELETE',
      body,
      throwOnError: true,
      types: [
        'DELETE_PRODUCTS-REQUEST',
        'DELETE_PRODUCTS-SUCCESS',
        'DELETE_PRODUCTS-FAILURE',
      ],
    },
  };
};

/** Toggle Search bar  */
export const toggleSearchBar = (): Actions.IToggleSearchbar => {
  return {
    type: 'TOGGLE_LOCATION_SEARCH_BAR',
  };
};
/** Toggle Minimized Header */
export const toggleMinimizedHeader = (): Actions.IToggleMinimizedHeader => {
  return {
    type: 'TOGGLE_MINIMIZED_HEADER',
  };
};
/** update ten key search text  */
export const update10KeySearchText = (
  searchText: string,
): Actions.IUpdate10KeySearchText => {
  return {
    type: 'UPDATE_10KEY_SEARCH_TEXT',
    payload: { searchText },
  };
};

/** update ten key search text  */
export const updateProductQuantity = (
  id: string,
  quantity: string,
): Actions.IUpdateProductQuantity => {
  return {
    type: 'UPDATE_PRODUCT_QUANTITY',
    payload: { id, quantity },
  };
};
/** Toggle Error Message action */
export const toggleAddEntryErrorMessage = (): Actions.IToogleAddEntryErrorMsg => {
  return {
    type: 'TOGGLE_ADD_ENTRY_ERROR_MSG',
  };
};
const saveSequenceNumber = (locationEntry: any, b2bUnitId: string): RSAA => {
  const body = { locationList: [locationEntry] };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/update-location-entries`,
      method: 'POST',
      throwOnError: true,
      body,
      types: [
        'SAVE_SEQUENCE_NUMBER-REQUEST',
        'SAVE_SEQUENCE_NUMBER-SUCCESS',
        {
          type: 'SAVE_SEQUENCE_NUMBER-FAILURE',
          meta: { locationEntry },
        },
      ],
    },
  };
};
const addProductByTenKeyAction = (
  runCode: string,
  locationCode: string,
  b2bUnitId: string,
  searchText: string,
  quantity: string | number,
  isSearchAll: boolean = false,
): RSAA => {
  const body = {
    locationList: [
      {
        runCode,
        code: locationCode,
        b2bUnitId,
        entries: [
          {
            code: searchText,
            quantity,
            exactSearch: isSearchAll,
          },
        ],
      },
    ],
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/add-location-entries`,
      method: 'POST',
      throwOnError: true,
      body,
      types: [
        'ADD-PRODUCT-BY-TENKEY-REQUEST',
        'ADD-PRODUCT-BY-TENKEY-SUCCESS',
        'ADD-PRODUCT-BY-TENKEY-FAILURE',
      ],
    },
  };
};

const updateProductDetailsAction = (
  updatedProductObj: any,
  b2bUnitId: string,
): RSAA => {
  const body = updatedProductObj;
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/update-location-entries`,
      method: 'POST',
      throwOnError: true,
      body,
      types: [
        'UPDATE_LOCATION_PRODUCT_DETAILS-REQUEST',
        'UPDATE_LOCATION_PRODUCT_DETAILS-SUCCESS',
        'UPDATE_LOCATION_PRODUCT_DETAILS-FAILURE',
      ],
    },
  };
};
/** Toggle Exception Enbtries View Action */
export const toggleExcetionView = (): Actions.IToggleExceptionView => ({
  type: 'TOGGLE_EXCEPTION_VIEW',
});

/** Update UnresolvedCode(Product) Action */
export const updateUnresolvedCodeOfProduct = (
  unresolvedCode: string,
): Actions.IUpdateUnresolvedCodeRequest => {
  return {
    type: 'UPDATE_UNRESOLVED_CODE',
    payload: { unresolvedCode },
  };
};
/** Close Multiple Products Action */
const closeMultiProductModal = (): Actions.ICloseMultiProductModal => {
  return {
    type: 'CLOSE_MULTIPLE_PRODUCTS_MODAL',
  };
};
/** Toggle Multiple Products Action */
const toggleMultipleProducts = (
  searchQuery: string,
  unresolvedCode: string,
  exceptionQty: string | number,
): Actions.IToogleMultipleProductModal => {
  return {
    type: 'TOGGLE_MULTIPLE_PRODUCTS_MODAL',
    payload: { searchQuery, unresolvedCode, exceptionQty },
  };
};
const searchMultiProduct = (
  runCode: string,
  b2bUnitId: string,
  searchQuery: string,
  isExactSearch: boolean,
): RSAA => {
  const endPoint = `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}/locations/search?searchQuery=${searchQuery}&isExactProductSearch=${isExactSearch}`;
  return {
    [API_CALL]: {
      endpoint: endPoint,
      method: 'GET',
      throwOnError: true,
      types: [
        'SEARCH_MULTI_PRODUCTS-REQUEST',
        'SEARCH_MULTI_PRODUCTS-SUCCESS',
        'SEARCH_MULTI_PRODUCTS-FAILURE',
      ],
    },
  };
};
const addABCProductEntryAction = (
  runCode: string,
  productCode: string,
  b2bUnitId: string,
  unresolvedCode: string,
  qty: number,
  locationCode: string,
  isNonAbcProduct: boolean,
): RSAA => {
  const appendUrl = isNonAbcProduct
    ? `non-abc-products/${locationCode}?nonabcproduct=${productCode}&quantity=${qty}&unresolved=${unresolvedCode}`
    : `abc-products/${locationCode}?abcproduct=${productCode}&quantity=${qty}&unresolved=${unresolvedCode}`;
  const endPoint = `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}/entries/${appendUrl}`;
  const body = {
    abcproduct: productCode,
    quantity: qty,
    unresolved: unresolvedCode,
  };
  return {
    [API_CALL]: {
      endpoint: endPoint,
      method: 'POST',
      body,
      throwOnError: true,
      types: [
        'ADD_ABC_PRODUCTS-REQUEST',
        'ADD_ABC_PRODUCTS-SUCCESS',
        'ADD_ABC_PRODUCTS-FAILURE',
      ],
    },
  };
};

/**  updates sort ID and sort direction */
export const setLocationDetailsSortOptions = (
  sortId: string,
  isSortDesc: boolean,
): Actions.ISetLocationDetailsDetailsSortOptions => ({
  payload: {
    sortId,
    isSortDesc,
  },
  type: 'SET_LOCATION_DETAILS_SORT_OPTIONS',
});

/** Export All Actions classes */
export {
  fetchSelectedLocationDetailsAction,
  refreshProductsAcquisitionCost,
  setlocationNameAction,
  closeProductsSearchModal,
  openProductsSearchModal,
  saveSequenceNumber,
  updateProductDetailsAction,
  addProductByTenKeyAction,
  fetchSearchProducts,
  addProductToLocation,
  searchMultiProduct,
  toggleMultipleProducts,
  addABCProductEntryAction,
  deleteProductsAction,
  closeMultiProductModal,
};
