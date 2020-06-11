import FSA from 'types/fsa';

/** Toggle Minimized Header interface for action */
export interface IToggleMinimizedHeader extends FSA {
  type: 'TOGGLE_MINIMIZED_HEADER';
}

/** Fetch Inventory Location Details Request interface for action */
export interface IFetchInventoryLocationDetailsRequest extends FSA {
  type: 'FETCH_LOCATION_DETAILS-REQUEST';
}

/** Successfully retrieved Location Details */
export interface IFetchInventoryLocationDetailsSuccess extends FSA {
  type: 'FETCH_LOCATION_DETAILS-SUCCESS';
}

/** If Run details fetch failed */
export interface IFetchInventoryLocationDetailsFailure extends FSA {
  type: 'FETCH_LOCATION_DETAILS-FAILURE';
}

/** Set Inventory Location Name Request interface for action */
export interface ISetInventoryLocationNameRequest extends FSA {
  type: 'SAVE_LOCATION_NAME_CHANGE-REQUEST';
}

/** Set Inventory Location Name Success interface for action */
export interface ISetInventoryLocationNameSuccess extends FSA {
  type: 'SAVE_LOCATION_NAME_CHANGE-SUCCESS';
}

/** Set Inventory Location Name Failure interface for action */
export interface ISetInventoryLocationNameFailure extends FSA {
  type: 'SAVE_LOCATION_NAME_CHANGE-FAILURE';
}

/** Refresh Acquisition cost for products request export interface for action */
export interface IRefreshProductsAcquisitionCostRequest extends FSA {
  type: 'REFRESH_PRODUCTS_ACQUISITION_COST-REQUEST';
}
/** Refresh Acquisition cost for products Success export interface for action */
export interface IRefreshProductsAcquisitionCostSuccess extends FSA {
  type: 'REFRESH_PRODUCTS_ACQUISITION_COST-SUCCESS';
}
/** Refresh Acquisition cost for products fails export interface for action */
export interface IRefreshProductsAcquisitionCostFailure extends FSA {
  type: 'REFRESH_PRODUCTS_ACQUISITION_COST-FAILURE';
}

/** Toggle Search bar interface for action */
export interface IToggleSearchbar extends FSA {
  type: 'TOGGLE_LOCATION_SEARCH_BAR';
}

/** Save  Location Entry Sequence Success interface for action */
export interface ISaveSequenceNumberSucess extends FSA {
  type: 'SAVE_SEQUENCE_NUMBER-SUCCESS';
}

/** Save  Location Entry Sequence Request interface for action */
export interface ISaveSequenceNumberRequest extends FSA {
  type: 'SAVE_SEQUENCE_NUMBER-REQUEST';
}

/** Save  Location Entry Sequence Failure interface for action */
export interface ISaveSequenceNumberFailure extends FSA {
  type: 'SAVE_SEQUENCE_NUMBER-FAILURE';
}

/** Update Search text interface for action */
export interface IUpdate10KeySearchText extends FSA {
  type: 'UPDATE_10KEY_SEARCH_TEXT';
  payload: { searchText: string };
}

/** Add  Location Entry Sequence Success interface for action */
export interface IAddProductByTenKeySucess extends FSA {
  type: 'ADD-PRODUCT-BY-TENKEY-SUCCESS';
}

/** Add  Location Entry Sequence Request interface for action */
export interface IAddProductByTenKeyRequest extends FSA {
  type: 'ADD-PRODUCT-BY-TENKEY-REQUEST';
}

/** Add  Location Entry Sequence Failure interface for action */
export interface IAddProductByTenKeyFailure extends FSA {
  type: 'ADD-PRODUCT-BY-TENKEY-FAILURE';
}

/** Update Product Qty interface for action */
export interface IUpdateProductQuantity extends FSA {
  type: 'UPDATE_PRODUCT_QUANTITY';
  payload: { id: string; quantity: string };
}
/** Toggle Error Message export interface for action */
export interface IToogleAddEntryErrorMsg extends FSA {
  type: 'TOGGLE_ADD_ENTRY_ERROR_MSG';
}
/** Toggle Multiple Products Interface for Action */
export interface IToogleMultipleProductModal extends FSA {
  type: 'TOGGLE_MULTIPLE_PRODUCTS_MODAL';
  payload: {
    searchQuery: string;
    unresolvedCode: string;
    exceptionQty: string | number;
  };
}
/** Close Multiple Products Modal Interface for Action */
export interface ICloseMultiProductModal extends FSA {
  type: 'CLOSE_MULTIPLE_PRODUCTS_MODAL';
}
/** Update Acq Cost For a product request export interface for action */
export interface IUpdateAcqCostForProductRequest extends FSA {
  type: 'UPDATE_LOCATION_PRODUCT_DETAILS-REQUEST';
}
/** Update Acq Cost For a product Success export interface for action */
export interface IUpdateAcqCostForProductSuccess extends FSA {
  type: 'UPDATE_LOCATION_PRODUCT_DETAILS-SUCCESS';
}
/** Update Acq Cost For a product fails export interface for action */
export interface IUpdateAcqCostForProductFailure extends FSA {
  type: 'UPDATE_LOCATION_PRODUCT_DETAILS-FAILURE';
}
/** Toggle Exception Entries View export interface */
export interface IToggleExceptionView extends FSA {
  type: 'TOGGLE_EXCEPTION_VIEW';
}
/** Selected Product Items */
export interface ISetSelectedProductItems extends FSA {
  type: 'LOCATION_DETAILS_SET_SELECTED_PRODUCT_ITEMS';
  payload: {
    selectedProductIds: string[];
  };
}
/** Select All Product Items Action */
export interface ISetAllSelectedProductItems extends FSA {
  payload: {
    selectedProductIds: string[];
  };
  type: 'LOCATION_DETAILS_SET_ALL_SELECTED_PRODUCT_ITEMS';
}

/** request Search Multiple Products */
export interface ISearchMultiProductRequest extends FSA {
  type: 'SEARCH_MULTI_PRODUCTS-REQUEST';
}

/** Success Search Multiple Products */
export interface ISearchMultiProductSuccess extends FSA {
  type: 'SEARCH_MULTI_PRODUCTS-SUCCESS';
}

/** Failure Search Multiple Products */
export interface ISearchMultiProductFailure extends FSA {
  type: 'SEARCH_MULTI_PRODUCTS-FAILURE';
}

/** interface for close product search modal */
export interface ICloseProductsSearchModal extends FSA {
  type: 'CLOSE_PRODUCTS_SEARCH_MODAL';
}

/** interface for open product search modal */
export interface IOpenProductsSearchModal extends FSA {
  type: 'OPEN_PRODUCTS_SEARCH_MODAL';
}

/** Successfully retrieved product Details */
export interface IFetchProductDetailsSuccess extends FSA {
  type: 'LOCATION_DETAILS_FETCH_SEARCH_PRODUCT-SUCCESS';
}

/** failure retrieved product Details */
export interface IFetchProductDetailsFailure extends FSA {
  type: 'LOCATION_DETAILS_FETCH_SEARCH_PRODUCT-FAILURE';
}

/** request retrieved product Details */
export interface IFetchProductDetailsRequest extends FSA {
  type: 'LOCATION_DETAILS_FETCH_SEARCH_PRODUCT-REQUEST';
}

/** Successfully retrieved product Details */
export interface IAddProductDetailsSuccess extends FSA {
  type: 'LOCATION_DETAILS_ADD_PRODUCT-SUCCESS';
}
/** failure retrieved product Details */
export interface IAddProductDetailsFailure extends FSA {
  type: 'LOCATION_DETAILS_ADD_PRODUCT-FAILURE';
}
/** requect retrieved product Details */
export interface IAddProductDetailsRequest extends FSA {
  type: 'LOCATION_DETAILS_ADD_PRODUCT-REQUEST';
}

/** request Add ABC product Details */
export interface IAddABCProductRequest extends FSA {
  type: 'ADD_ABC_PRODUCTS-REQUEST';
}

/** Success Add ABC product Details */
export interface IAddABCProductSuccess extends FSA {
  type: 'ADD_ABC_PRODUCTS-SUCCESS';
}

/** Failure Add ABC product Details */
export interface IAddABCProductFailure extends FSA {
  type: 'ADD_ABC_PRODUCTS-FAILURE';
}

/** Failure Delete product Details */
export interface IDeleteProductFailure extends FSA {
  type: 'DELETE_PRODUCTS-FAILURE';
}
/** Success Delete product Details */
export interface IDeleteProductSuccess extends FSA {
  type: 'DELETE_PRODUCTS-SUCCESS';
}
/** Request Delete product Details */
export interface IDeleteProductRequest extends FSA {
  type: 'DELETE_PRODUCTS-REQUEST';
}
/** Toggle Multiple Products Interface for Action */
export interface IUpdateUnresolvedCodeRequest extends FSA {
  type: 'UPDATE_UNRESOLVED_CODE';
  payload: { unresolvedCode: string };
}

/**  interface to update sort ID and sort direction */
export interface ISetLocationDetailsDetailsSortOptions extends FSA {
  type: 'SET_LOCATION_DETAILS_SORT_OPTIONS';
  payload: {
    sortId: string;
    isSortDesc: boolean;
  };
}
/** export all Actions */
export type Actions =
  | IFetchInventoryLocationDetailsRequest
  | IFetchInventoryLocationDetailsSuccess
  | IFetchInventoryLocationDetailsFailure
  | ISetInventoryLocationNameSuccess
  | ISetInventoryLocationNameRequest
  | ISetInventoryLocationNameFailure
  | IToggleSearchbar
  | ISaveSequenceNumberSucess
  | ISaveSequenceNumberRequest
  | ISaveSequenceNumberFailure
  | IToggleExceptionView
  | ISetSelectedProductItems
  | ISetAllSelectedProductItems
  | IRefreshProductsAcquisitionCostRequest
  | IRefreshProductsAcquisitionCostSuccess
  | IRefreshProductsAcquisitionCostFailure
  | IUpdateAcqCostForProductRequest
  | IUpdateAcqCostForProductSuccess
  | IUpdateAcqCostForProductFailure
  | IUpdate10KeySearchText
  | IUpdate10KeySearchText
  | IAddProductByTenKeySucess
  | IAddProductByTenKeyRequest
  | IAddProductByTenKeyFailure
  | IUpdateProductQuantity
  | IToggleMinimizedHeader
  | IToogleAddEntryErrorMsg
  | IToogleMultipleProductModal
  | ICloseProductsSearchModal
  | IOpenProductsSearchModal
  | IFetchProductDetailsSuccess
  | IFetchProductDetailsFailure
  | IFetchProductDetailsRequest
  | IAddProductDetailsSuccess
  | IAddProductDetailsFailure
  | IAddProductDetailsRequest
  | ISearchMultiProductRequest
  | ISearchMultiProductSuccess
  | ISearchMultiProductFailure
  | IAddABCProductRequest
  | IAddABCProductSuccess
  | IAddABCProductFailure
  | IDeleteProductFailure
  | IDeleteProductRequest
  | IDeleteProductSuccess
  | IUpdateUnresolvedCodeRequest
  | ICloseMultiProductModal
  | ISetLocationDetailsDetailsSortOptions;
