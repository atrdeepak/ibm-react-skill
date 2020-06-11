import { Actions } from 'modules/physical-inventory/location-details/location-details-types';
/** Declaration of values in location state */
export interface IState {
  /** Is the page currently loading data */
  isLoading: boolean;
  sortId: string;
  isSortDesc: boolean;
  /** Selected Location Data */
  selectedInventoryLocationDetails: any;

  /** Exception View */
  isExceptionsView: boolean;

  /** Search Toggled */
  isSearchToggled: boolean;

  selectedProductIds: string[];
  /** Ten Key Search text */
  tenKeySearchText: string;

  /** Add products Error Message */
  toggleErrorMessage: boolean;

  quantity: string;
  /** Is Minimized sticky Header */
  isMinimized: boolean;
  /** To Open Product Search Modal */
  isProductsSearchModalOpen: boolean;
  /** Is Multi Product Modal */
  isMultiProductModal: boolean;

  /** Query to resolve */
  searchQuery: string;

  /** Unresolved Entry Code */
  unresolvedCode: string;

  /** Unresolved Quantity */
  unresolvedQuantity: string | number;

  /** Spinner for the Multi Product data */
  isMultiModalLoading: boolean;
  entities?: any;
}

/** Initial state of Location object */
export const initialState: IState = {
  isLoading: false,
  sortId: 'entryNumber',
  isSortDesc: false,
  selectedInventoryLocationDetails: {},
  isExceptionsView: false,
  isSearchToggled: false,
  selectedProductIds: [],
  tenKeySearchText: '',
  toggleErrorMessage: false,
  quantity: '0.000',
  isMinimized: false,
  isProductsSearchModalOpen: false,
  isMultiProductModal: false,
  searchQuery: '',
  unresolvedCode: '',
  isMultiModalLoading: false,
  unresolvedQuantity: '0.000',
};

/** Reducer for Location Details Actions */
export default (state: IState = initialState, action: Actions): IState => {
  switch (action.type) {
    case 'SET_LOCATION_DETAILS_SORT_OPTIONS':
      return {
        ...state,
        sortId: action.payload.sortId,
        isSortDesc: action.payload.isSortDesc,
      };
    case 'DELETE_PRODUCTS-REQUEST':
    case 'REFRESH_PRODUCTS_ACQUISITION_COST-REQUEST':
    case 'FETCH_LOCATION_DETAILS-REQUEST':
      return {
        ...state,
        isLoading: true,
      };
    case 'FETCH_LOCATION_DETAILS-SUCCESS':
      return {
        ...state,
        isLoading: false,
      };
    case 'DELETE_PRODUCTS-SUCCESS':
      return {
        ...state,
        selectedProductIds: [],
        isLoading: false,
      };
    case 'REFRESH_PRODUCTS_ACQUISITION_COST-FAILURE':
    case 'REFRESH_PRODUCTS_ACQUISITION_COST-SUCCESS':
    case 'DELETE_PRODUCTS-FAILURE':
      return {
        ...state,
        isLoading: false,
        selectedProductIds: [],
      };
    case 'FETCH_LOCATION_DETAILS-FAILURE':
      return {
        ...state,
        isLoading: false,
      };
    case 'TOGGLE_LOCATION_SEARCH_BAR':
      return {
        ...state,
        isSearchToggled: !state.isSearchToggled,
      };
    case 'TOGGLE_EXCEPTION_VIEW':
      return {
        ...state,
        isExceptionsView: !state.isExceptionsView,
      };
    case 'UPDATE_10KEY_SEARCH_TEXT':
      return {
        ...state,
        tenKeySearchText: action.payload.searchText,
        toggleErrorMessage: false,
      };
    case 'UPDATE_PRODUCT_QUANTITY':
      return {
        ...state,
        quantity: action.payload.quantity,
      };
    case 'TOGGLE_MINIMIZED_HEADER':
      return {
        ...state,
        isMinimized: !state.isMinimized,
      };
    case 'LOCATION_DETAILS_SET_ALL_SELECTED_PRODUCT_ITEMS':
    case 'LOCATION_DETAILS_SET_SELECTED_PRODUCT_ITEMS':
      const selectedProductIds = action.payload.selectedProductIds;
      return {
        ...state,
        selectedProductIds,
      };
    case 'TOGGLE_ADD_ENTRY_ERROR_MSG':
      return {
        ...state,
        toggleErrorMessage: !state.toggleErrorMessage,
      };
    case 'ADD-PRODUCT-BY-TENKEY-SUCCESS':
      return {
        ...state,
        toggleErrorMessage: false,
        tenKeySearchText: '',
        quantity: '0.000',
      };
    case 'OPEN_PRODUCTS_SEARCH_MODAL':
      return { ...state, isProductsSearchModalOpen: true };
    case 'CLOSE_PRODUCTS_SEARCH_MODAL':
      return { ...state, isProductsSearchModalOpen: false };
    case 'TOGGLE_MULTIPLE_PRODUCTS_MODAL':
      return {
        ...state,
        isMultiProductModal: true,
        searchQuery: action.payload.searchQuery,
        unresolvedCode: action.payload.unresolvedCode,
        unresolvedQuantity: action.payload.exceptionQty,
      };
    case 'CLOSE_MULTIPLE_PRODUCTS_MODAL':
      return {
        ...state,
        isMultiProductModal: false,
        searchQuery: '',
        unresolvedCode: '',
        unresolvedQuantity: '',
      };
    case 'UPDATE_UNRESOLVED_CODE':
      return {
        ...state,
        unresolvedCode: action.payload.unresolvedCode,
      };
    case 'SEARCH_MULTI_PRODUCTS-REQUEST':
      return {
        ...state,
        isMultiModalLoading: true,
      };
    case 'SEARCH_MULTI_PRODUCTS-SUCCESS':
    case 'SEARCH_MULTI_PRODUCTS-FAILURE':
      return {
        ...state,
        isMultiModalLoading: false,
      };
    default:
      return state;
  }
};
