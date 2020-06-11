import {
  closeConfirmationModal,
  openConfirmationModal,
} from 'modules/confirmation-modal/act.confirmation-modal';
import { getDefaultOrSelectedAccount } from 'modules/dashboard/ordering-dashboard.selectors';
import { openErrorModal, openGenericErrorModal } from 'modules/errors/act.errors';
import {
  checkBarcodeAlreadyLearned,
  setLearnBarCodeLocationAccount,
} from 'modules/learn-barcode/act.learn-barcode';
import { hideGlobalLoadingSpinner } from 'modules/loading-spinner/act.loading-spinner';
import { setPageFilterSelectedAccount } from 'modules/page-filters/act.page-filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import {
  exceptionTypeEntry,
  exceptionTypeLocation,
  exceptionTypeRun,
  getMultiUserModalBodyText,
  getMultiUserModalTitle,
} from 'modules/physical-inventory/helpers';
import {
  addABCProductEntryAction,
  addProductByTenKeyAction,
  addProductToLocation,
  closeMultiProductModal,
  closeProductsSearchModal,
  deleteProductsAction,
  fetchSearchProducts,
  fetchSelectedLocationDetailsAction,
  refreshProductsAcquisitionCost,
  saveSequenceNumber,
  searchMultiProduct,
  setlocationNameAction,
  toggleMultipleProducts,
  updateProductDetailsAction,
  updateUnresolvedCodeOfProduct,
} from 'modules/physical-inventory/location-details/act.inventory-location-details';
import {
  triggerAddProductSuccessToast,
  triggerCopyLocationAllProductsSuccessToast,
  triggerCopyLocationSelectedProductsSuccessToast,
  triggerProductsDeletePartialSuccessToast,
  triggerProductsDeleteSuccessToast,
  triggerSuccessToast,
} from 'modules/physical-inventory/location-details/act.inventory-location-details-modal';
import {
  getInventoryLocationDetails,
  getSelectedProductDetails,
} from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import {
  copyLocation,
  fetchSelectedRunDetailsAction,
  toggleCopyLocationModal,
} from 'modules/physical-inventory/run-details/act.inventory-run-details';
import Router from 'next/router';
import { ReactElement } from 'react';
import {
  IInventoryLocationDetails,
  ILocationEntry,
  IProductsDeleteBody,
  IProductsDetail,
} from 'types/inventory-location-details';
import { ThunkAction } from 'types/thunk';

/** Fetch Location Details Thunk */
export const fetchSelectedLocationDetails = (
  selectedLocationCode: string,
  selectedRunCode?: string,
  b2bUnitId?: string,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const newb2bUnitId = b2bUnitId || getDefaultOrSelectedAccount(state);
  try {
    await dispatch(
      fetchSelectedLocationDetailsAction(
        selectedRunCode,
        selectedLocationCode,
        newb2bUnitId,
      ),
    );
  } catch (exception) {
    dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, newb2bUnitId));
    const isExceptionRunLocation = exceptionTypeRun(exception);
    const isExceptionTypeLocation = exceptionTypeLocation(exception);
    if (isExceptionRunLocation) {
      dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, newb2bUnitId));
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionRunLocation),
          getMultiUserModalBodyText(isExceptionRunLocation, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else if (isExceptionTypeLocation) {
      dispatch(
        openConfirmationModal({
          title: 'Location Does Not Exist',
          body: 'This location does not exist. It has been deleted by another user.',
          confirmAction: redirectToRunPage(selectedRunCode),
          confirmButtonLabel: 'OK',
          hideCancelBtn: true,
          cancelButtonLabel: 'Cancel',
          cancelAction: closeConfirmationModal(),
        }),
      );
    } else {
      dispatch(
        openGenericErrorModal(
          null,
          'Unexpected Error Occured',
          true,
          '/physical-inventory',
        ),
      );
    }
    throw exception;
  }
};

/** Delete products - Redirect to Run page when the location is not found or deleted  */
const redirectToRunPage = (runCode: string): ThunkAction => async (
  dispatch,
  getState,
) => {
  Router.push(`/physical-inventory/run-details?runCode=${runCode}`);
};

/** Delete products Thunk Action */
const deleteForProducts = (productsDetail: IProductsDetail): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const inventoryLocationDetails = getInventoryLocationDetails(state);
  const runCode = inventoryLocationDetails.runCode;
  const b2bUnitId = inventoryLocationDetails.b2bUnitId;
  const locationCode = inventoryLocationDetails.code;

  dispatch(closeConfirmationModal());
  try {
    const body: IProductsDeleteBody = {
      locationList: [
        {
          runCode,
          entries: [],
        },
      ],
    };
    body.locationList[0].entries = productsDetail.entries.reduce((list, entry) => {
      list.push({
        code: entry.code,
        locationCode,
      });
      return list;
    }, []);
    await dispatch(deleteProductsAction(b2bUnitId, body));
    dispatch(triggerProductsDeleteSuccessToast());
  } catch (exception) {
    const isExceptionTypeEntry = exceptionTypeEntry(exception);
    const isExceptionTypeLocation = exceptionTypeLocation(exception);
    const isExceptionRunLocation = exceptionTypeRun(exception);

    if (isExceptionTypeEntry) {
      const deletedEntries = exception.response.data[0].exceptionData[0].entryNumber.split(
        ',',
      );
      if (deletedEntries.length) {
        dispatch(
          fetchSelectedLocationDetailsAction(runCode, locationCode, b2bUnitId),
        );
        dispatch(triggerProductsDeletePartialSuccessToast(deletedEntries.length));
      }
    } else if (isExceptionTypeLocation) {
      dispatch(
        openConfirmationModal({
          title: 'Location Does Not Exist',
          body: 'This location does not exist. It has been deleted by another user.',
          confirmAction: redirectToRunPage(runCode),
          confirmButtonLabel: 'OK',
          hideCancelBtn: true,
          cancelButtonLabel: 'Cancel',
          cancelAction: f => f,
        }),
      );
    } else if (isExceptionRunLocation) {
      dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, b2bUnitId));
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionRunLocation),
          getMultiUserModalBodyText(isExceptionRunLocation, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else {
      dispatch(openGenericErrorModal());
    }
    throw exception;
  }
};

/** Refresh Acquisition Cost For Products Thunk Action */
const refreshAcquisitionCostForProducts = (
  products: string[],
  locationCode: string,
): ThunkAction => async (dispatch, getState) => {
  dispatch(closeConfirmationModal());
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  const toastTitle = 'Acquisition Cost Refreshed';
  const locationDetails = getInventoryLocationDetails(state);
  try {
    await dispatch(
      refreshProductsAcquisitionCost(
        products,
        b2bUnitId,
        locationCode,
        locationDetails.runCode,
      ),
    );
    dispatch(triggerSuccessToast(toastTitle, 'Products refreshed successfully'));
  } catch (exception) {
    const isExceptionTypeEntry = exceptionTypeEntry(exception);
    const isExceptionTypeLocation = exceptionTypeLocation(exception);
    const isExceptionTypeRun = exceptionTypeRun(exception);

    if (isExceptionTypeEntry) {
      dispatch(fetchSelectedLocationDetails(locationCode));
      const deletedEntries = exception.response.data[0].exceptionData[0].entryNumber.split(
        ',',
      );
      if (products.length === deletedEntries.length) {
        dispatch(
          openErrorModal(
            getMultiUserModalTitle('ENTRY_DELETED_EXCEPTION_LOCATION_DETAILS_PAGE'),
            getMultiUserModalBodyText(
              'ENTRY_DELETED_EXCEPTION_LOCATION_DETAILS_PAGE',
              '',
            ),
            closeConfirmationModal,
          ),
        );
      } else {
        dispatch(
          triggerSuccessToast(
            toastTitle,
            'Some products were refreshed successfully',
          ),
        );
      }
    } else if (isExceptionTypeLocation) {
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionTypeLocation),
          getMultiUserModalBodyText(isExceptionTypeLocation, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory/run-details?runCode=${locationDetails.runCode}`,
        ),
      );
    } else if (isExceptionTypeRun) {
      dispatch(
        setPageFilterSelectedAccount(
          PageKey.INVENTORY_RUN,
          locationDetails.b2bUnitId,
        ),
      );
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionTypeRun),
          getMultiUserModalBodyText(isExceptionTypeRun, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else {
      dispatch(openGenericErrorModal());
    }
    throw exception;
  }
};

/** Refresh Acquisition cost For Products Confirmation modal Thunk Action */
export const confirmProductsRefreshAcquisitionCost = (
  products: any,
  locationCode: string,
): ThunkAction => dispatch => {
  dispatch(
    openConfirmationModal({
      title: 'Refresh Acquisition Cost',
      body:
        'Are you sure you want to refresh the acquisition cost(s) of the selected product(s)? This will also reset any manually entered values.',
      confirmAction: refreshAcquisitionCostForProducts(products, locationCode),
      confirmButtonLabel: 'Refresh',
      hideCancelBtn: false,
      cancelButtonLabel: 'Cancel',
      cancelAction: closeConfirmationModal(),
    }),
  );
};

/** Delete Products Confirmation modal Thunk Action */
export const confirmDeleteProducts = (
  productsDetail: IProductsDetail,
  message: ReactElement | string,
): ThunkAction => dispatch => {
  dispatch(
    openConfirmationModal({
      title: 'Delete Products?',
      body: message,
      confirmAction: deleteForProducts(productsDetail),
      confirmButtonLabel: 'Delete',
      hideCancelBtn: false,
      cancelButtonLabel: 'Cancel',
      cancelAction: closeConfirmationModal(),
    }),
  );
};

/** Update Resolvedcode Thunk */
export const updateResolvedCodeThunk = (
  unresolvedCode: string,
): ThunkAction => async dispatch => {
  try {
    dispatch(updateUnresolvedCodeOfProduct(unresolvedCode));
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};

/** Location name Thunk */
export const setLocationNameThunk = (
  name: string,
  locationDetails: IInventoryLocationDetails,
): ThunkAction => async dispatch => {
  try {
    await dispatch(
      setlocationNameAction(
        name,
        locationDetails.code,
        locationDetails.b2bUnitId,
        locationDetails.runCode,
      ),
    );
  } catch (exception) {
    const isExceptionRunLocation = exceptionTypeRun(exception);
    if (isExceptionRunLocation) {
      dispatch(
        setPageFilterSelectedAccount(
          PageKey.INVENTORY_RUN,
          locationDetails.b2bUnitId,
        ),
      );
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionRunLocation),
          getMultiUserModalBodyText(isExceptionRunLocation, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else {
      dispatch(openGenericErrorModal());
    }
    throw exception;
  }
};
/** Add Product Search Modal Thunk */
export const addProductsSearchModalThunk = (
  productId: string,
  quantity: string | number,
  b2bUnitId: string,
  code: string,
  productName: string,
): ThunkAction => async (dispatch, getState) => {
  try {
    const runCode: string = getInventoryLocationDetails(getState()).runCode;
    await dispatch(closeProductsSearchModal());
    await dispatch(
      addProductToLocation(productId, quantity, b2bUnitId, code, runCode),
    );
    dispatch(triggerAddProductSuccessToast(productName));
  } catch (exception) {
    const exceptionErrorsRef = exception.response.data[0].exceptionData;
    const exceptionMessage =
      exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
    const multiUserExceptionList = ['RUN_DELETED_EXCEPTION'];

    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(e => exceptionMessage.includes(e));

    if (exceptionType) {
      dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, b2bUnitId));
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(exceptionType),
          getMultiUserModalBodyText(exceptionType, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else {
      dispatch(openGenericErrorModal());
    }
    throw exception;
  }
};
/** Fetch Search Product Thunk */
export const fetchSearchProductsThunk = (
  searchProductText: string,
  activeB2bUnit: string,
): ThunkAction => async dispatch => {
  try {
    await dispatch(fetchSearchProducts(searchProductText, activeB2bUnit));
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};
/** Save Entry Number Thunk Action */
export const saveEntryNumberThunk = (
  entryNo: string,
  locationEntry: ILocationEntry,
  b2bUnitId: string,
  locationCode: string,
): ThunkAction => async (dispatch, getState) => {
  const runCode: string = getInventoryLocationDetails(getState()).runCode;
  try {
    const newLocationEntry = {
      runCode,
      entries: [
        {
          code: locationEntry.code,
          locationCode,
          entryNumber: Number(entryNo),
          price: locationEntry.price,
          quantity: locationEntry.quantity,
        },
      ],
    };
    await dispatch(saveSequenceNumber(newLocationEntry, b2bUnitId));
  } catch (exception) {
    const isExceptionRunLocation = exceptionTypeRun(exception);
    const exceptionErrorsRef = exception.response.data[0].exceptionData;
    const exceptionMessage =
      exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
    const multiUserExceptionList = [
      'ENTRY_DELETED_EXCEPTION',
      'LOCATION_DELETED_EXCEPTION',
    ];

    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(e => exceptionMessage.includes(e));
    if (exceptionType) {
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(exceptionType),
          getMultiUserModalBodyText(exceptionType, ''),
          closeConfirmationModal,
        ),
      );
    } else if (isExceptionRunLocation) {
      dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, b2bUnitId));
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionRunLocation),
          getMultiUserModalBodyText(isExceptionRunLocation, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else {
      dispatch(openGenericErrorModal());
    }
    throw exception;
  }
};

/** Location name Thunk */
export const addProductByTenKeyThunk = (
  searchText: string,
  quantity: string | number,
): ThunkAction => async (dispatch, getState) => {
  const locationDetails = getInventoryLocationDetails(getState());
  try {
    await dispatch(
      addProductByTenKeyAction(
        locationDetails.runCode,
        locationDetails.code,
        locationDetails.b2bUnitId,
        searchText,
        quantity,
        false,
      ),
    );
    await dispatch(
      triggerSuccessToast('Product Added', `${searchText} added successfully`),
    );
  } catch (exception) {
    const isExceptionRunLocation = exceptionTypeRun(exception);
    if (isExceptionRunLocation) {
      dispatch(
        setPageFilterSelectedAccount(
          PageKey.INVENTORY_RUN,
          locationDetails.b2bUnitId,
        ),
      );
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionRunLocation),
          getMultiUserModalBodyText(isExceptionRunLocation, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else {
      dispatch(
        generateErrorModalsThunk(
          exception,
          locationDetails.code,
          locationDetails.b2bUnitId,
        ),
      );
    }

    throw exception;
  }
};

/** Update product Thunk Action */
export const updateProductDetailsThunk = (
  b2bUnitId: string,
  locationCode: string,
  locationEntry: ILocationEntry,
  updateAcqCost: string,
  updateQuantity?: number | string,
): ThunkAction => async (dispatch, getState) => {
  const runCode = getInventoryLocationDetails(getState()).runCode;
  try {
    const updatedLocationEntry = {
      locationList: [
        {
          runCode,
          entries: [
            {
              code: locationEntry.code,
              locationCode,
              price: Number(updateAcqCost),
              quantity: updateQuantity,
            },
          ],
        },
      ],
    };
    await dispatch(updateProductDetailsAction(updatedLocationEntry, b2bUnitId));
  } catch (exception) {
    dispatch(generateErrorModalsThunk(exception, locationCode, b2bUnitId));
  } finally {
    dispatch(hideGlobalLoadingSpinner());
  }
};

/** Common Error Modal Thunk */
export const generateErrorModalsThunk = (
  exception: any,
  locationCode: string,
  b2bUnitId: string,
): ThunkAction => async (dispatch, getState) => {
  const inventoryLocationDetails = getInventoryLocationDetails(getState());
  const isExceptionTypeLocation = exceptionTypeLocation(exception);
  const isExceptionRunLocation = exceptionTypeRun(exception);
  const exceptionErrorsRef = exception.response.data[0].exceptionData;
  const exceptionMessage = exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
  const destination = isExceptionTypeLocation
    ? `/physical-inventory/run-details?runCode=${inventoryLocationDetails.runCode}`
    : `/physical-inventory/location-details?locationCode=${inventoryLocationDetails.code}`;
  const multiUserExceptionList = [
    'ENTRY_DELETED_EXCEPTION',
    'LOCATION_DELETED_EXCEPTION',
  ];
  const exceptionType: any =
    exceptionMessage &&
    multiUserExceptionList.find(e => exceptionMessage.includes(e));

  if (exceptionType) {
    dispatch(
      openErrorModal(
        getMultiUserModalTitle(exceptionType),
        getMultiUserModalBodyText(exceptionType, ''),
        closeConfirmationModal,
        null,
        true,
        destination,
      ),
    );
  } else if (isExceptionRunLocation) {
    dispatch(
      setPageFilterSelectedAccount(
        PageKey.INVENTORY_RUN,
        inventoryLocationDetails.b2bUnitId,
      ),
    );
    dispatch(
      openErrorModal(
        getMultiUserModalTitle(isExceptionRunLocation),
        getMultiUserModalBodyText(isExceptionRunLocation, ''),
        closeConfirmationModal,
        null,
        true,
        `/physical-inventory`,
      ),
    );
  } else {
    dispatch(openGenericErrorModal());
  }
  await dispatch(
    fetchSelectedLocationDetailsAction(
      inventoryLocationDetails.runCode,
      locationCode,
      b2bUnitId,
    ),
  );
  throw exception;
};

/** Thunk Open Multi Product Modal */
export const openMultiProductModalThunk = (
  searchQuery: string,
  unresolvedCode: string,
  exceptionQty: string | number,
): ThunkAction => async (dispatch, getState) => {
  const runCode = getInventoryLocationDetails(getState()).runCode;
  const inventoryLocationDetails = getInventoryLocationDetails(getState());
  const b2bUnitId = inventoryLocationDetails.b2bUnitId;
  const locationCode = inventoryLocationDetails.code;
  try {
    dispatch(toggleMultipleProducts(searchQuery, unresolvedCode, exceptionQty));
    await dispatch(searchMultiProduct(runCode, b2bUnitId, searchQuery, false));
  } catch (exception) {
    dispatch(generateErrorModalsThunk(exception, locationCode, b2bUnitId));
  }
};

/** Thunk Add ABC Product Entry */
export const addABCProductEntryThunk = (
  productCode: string,
  qty: number,
  productType?: string,
): ThunkAction => async (dispatch, getState) => {
  const runCode = getInventoryLocationDetails(getState()).runCode;
  const locationDetails = getInventoryLocationDetails(getState());
  const unresolvedCode = getState().physicalInventory.inventoryLocationDetails
    .unresolvedCode;
  const isMultipleModalOpen = getState().physicalInventory.inventoryLocationDetails
    .isMultiProductModal;
  isMultipleModalOpen && dispatch(closeMultiProductModal());
  try {
    await dispatch(
      addABCProductEntryAction(
        runCode,
        productCode,
        locationDetails.b2bUnitId,
        unresolvedCode,
        qty,
        locationDetails.code,
        productType === 'NONABC',
      ),
    );
    await dispatch(
      triggerSuccessToast('Product Replaced', `${productCode} added successfully`),
    );
  } catch (exception) {
    dispatch(
      generateErrorModalsThunk(
        exception,
        locationDetails.code,
        locationDetails.b2bUnitId,
      ),
    );
  }
};

/** copy selected run location products  */
export const copyRunLocationSelectedProducts = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const locationDetails = getInventoryLocationDetails(state);
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  const source = state.physicalInventory.inventoryRunDetails.sourceLocationCode;
  const target = state.physicalInventory.inventoryRunDetails.destinationLocationCode;
  const isDelete = state.physicalInventory.inventoryRunDetails.isDeleteLocation;
  const runCode: any = state.entities.inventoryRunDetails.code;
  const selectedProductIds =
    state.physicalInventory.inventoryLocationDetails.selectedProductIds;
  const copiedLocation = Object.values(
    state.entities.inventoryRunDetails.locations,
  ).filter((location: any) => location.code === target);
  dispatch(toggleCopyLocationModal(''));
  try {
    await dispatch(
      copyLocation(runCode, b2bUnitId, source, target, selectedProductIds, isDelete),
    );
    dispatch(
      triggerCopyLocationAllProductsSuccessToast(
        copiedLocation[0].name,
        target,
        'Products Copied Successfully',
      ),
    );
    dispatch(redirectToRunPage(runCode));
  } catch (exception) {
    const exceptionErrorsRef = exception.response.data[0];
    const exceptionMessage =
      exceptionErrorsRef && exception.response.data[0].message;

    const sourceDeletedException = 'Locations already deleted or does not exist!';
    const sourceDeletedExceptionType: boolean =
      exceptionMessage && exceptionMessage.indexOf(sourceDeletedException) !== -1;

    const destinationDeletedException =
      'The location you are trying to copy to has been deleted.';
    const destinationDeletedExceptionType: boolean =
      exceptionMessage &&
      exceptionMessage.indexOf(destinationDeletedException) !== -1;

    const subStringToMatch = 'product(s)';
    const productsPartialCopyExceptionType: boolean =
      exceptionMessage && exceptionMessage.indexOf(subStringToMatch) !== -1;

    const runDeletedExceptionStr = 'The run you are trying to edit has been deleted';
    const isRunDeletedException: boolean =
      exceptionMessage && exceptionMessage.indexOf(runDeletedExceptionStr) !== -1;

    if (isRunDeletedException) {
      dispatch(
        setPageFilterSelectedAccount(
          PageKey.INVENTORY_RUN,
          locationDetails.b2bUnitId,
        ),
      );
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(runDeletedExceptionStr),
          getMultiUserModalBodyText(runDeletedExceptionStr, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    }

    destinationDeletedExceptionType &&
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(destinationDeletedException),
          getMultiUserModalBodyText(destinationDeletedException, ''),
          closeConfirmationModal,
        ),
      );

    sourceDeletedExceptionType &&
      dispatch(
        openConfirmationModal({
          title: 'Source Location Does Not Exist',
          body:
            'The source location does not exist. It has been deleted by another user.',
          confirmAction: redirectToRunPage(runCode),
          confirmButtonLabel: 'Ok',
          hideCancelBtn: false,
          cancelButtonLabel: 'Cancel',
          cancelAction: closeConfirmationModal(),
        }),
      );

    productsPartialCopyExceptionType &&
      dispatch(
        triggerCopyLocationSelectedProductsSuccessToast(
          'Some Products Copied Successfully',
          exceptionMessage.replace(/[\[\]]/g, ''),
        ),
      );

    !sourceDeletedExceptionType &&
      !destinationDeletedExceptionType &&
      productsPartialCopyExceptionType &&
      dispatch(redirectToRunPage(runCode));

    !sourceDeletedExceptionType &&
      !destinationDeletedExceptionType &&
      !productsPartialCopyExceptionType &&
      !isRunDeletedException &&
      dispatch(openGenericErrorModal());

    await dispatch(fetchSelectedRunDetailsAction(runCode, b2bUnitId));
    throw exception;
  }
};

/** Save Entry Number Thunk Action */
export const saveEntryNumber = (
  entryNo: string,
  locationEntry: ILocationEntry,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const inventoryLocationDetails = getInventoryLocationDetails(state);
  const b2bUnitId = inventoryLocationDetails.b2bUnitId;
  const locationCode = inventoryLocationDetails.code;
  const runCode = inventoryLocationDetails.runCode;
  try {
    const newLocationEntry = {
      runCode,
      entries: [
        {
          code: locationEntry.code,
          locationCode,
          entryNumber: Number(entryNo),
          price: locationEntry.price,
          quantity: locationEntry.quantity,
        },
      ],
    };
    await dispatch(saveSequenceNumber(newLocationEntry, b2bUnitId));
  } catch (exception) {
    const isExceptionRunLocation = exceptionTypeRun(exception);
    const exceptionErrorsRef = exception.response.data[0].exceptionData;
    const exceptionMessage =
      exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
    const multiUserExceptionList = [
      'ENTRY_DELETED_EXCEPTION',
      'LOCATION_DELETED_EXCEPTION',
    ];

    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(e => exceptionMessage.includes(e));
    if (exceptionType) {
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(exceptionType),
          getMultiUserModalBodyText(exceptionType, ''),
          closeConfirmationModal,
        ),
      );
    } else if (isExceptionRunLocation) {
      dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, b2bUnitId));
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionRunLocation),
          getMultiUserModalBodyText(isExceptionRunLocation, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else {
      dispatch(openGenericErrorModal());
    }
    throw exception;
  }
};

/** Update product Thunk Action */
export const updateProductDetails = (
  locationEntry: ILocationEntry,
  updateAcqCost: string,
  updateQuantity?: number | string,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const inventoryLocationDetails = getInventoryLocationDetails(state);
  const b2bUnitId = inventoryLocationDetails.b2bUnitId;
  const locationCode = inventoryLocationDetails.code;
  const runCode = inventoryLocationDetails.runCode;
  try {
    const updatedLocationEntry = {
      locationList: [
        {
          runCode,
          entries: [
            {
              code: locationEntry.code,
              locationCode,
              price: Number(updateAcqCost),
              quantity: updateQuantity,
            },
          ],
        },
      ],
    };
    await dispatch(updateProductDetailsAction(updatedLocationEntry, b2bUnitId));
  } catch (exception) {
    dispatch(generateErrorModalsThunk(exception, locationCode, b2bUnitId));
  } finally {
    dispatch(hideGlobalLoadingSpinner());
  }
};

/** Confirm Single delete location Entry */
export const confirmDeleteLocationEntry = (
  locationEntry: ILocationEntry,
): ThunkAction => (dispatch, getState) => {
  const state = getState();
  const productsDetail = getSelectedProductDetails(state);
  const locationEntryName = locationEntry.name || 'unknown';
  const updatedProductDetails = {
    ...productsDetail,
    entries: [
      {
        name: locationEntryName,
        code: locationEntry.code || '',
      },
    ],
  };

  const message =
    locationEntryName === 'unknown'
      ? `Are you sure you want to delete
         Unknown Product ${locationEntry.scannedBarcode} from this location?
        `
      : `
          Are you sure you want to delete ${locationEntryName} from this location?
        `;
  dispatch(
    openConfirmationModal({
      title: 'Delete Products?',
      body: message,
      confirmAction: deleteForProducts(updatedProductDetails),
      confirmButtonLabel: 'Delete',
      hideCancelBtn: false,
      cancelButtonLabel: 'Cancel',
      cancelAction: closeConfirmationModal(),
    }),
  );
};

/** Update product Thunk Action */
export const handleLearnBarCodeClick = (
  locationEntry: ILocationEntry,
): ThunkAction => (dispatch, getState) => {
  const state = getState();
  const inventoryLocationDetails = getInventoryLocationDetails(state);
  const b2bUnitId = inventoryLocationDetails.b2bUnitId;

  dispatch(setLearnBarCodeLocationAccount(b2bUnitId));
  dispatch(
    checkBarcodeAlreadyLearned(locationEntry.scannedBarcode, b2bUnitId, true, true),
  );
  dispatch(updateResolvedCodeThunk(locationEntry.code));
};

// tslint:disable-next-line:max-file-line-count
