import {
  closeConfirmationModal,
  openConfirmationModal,
} from 'modules/confirmation-modal/act.confirmation-modal';
import { getDefaultOrSelectedAccount } from 'modules/dashboard/ordering-dashboard.selectors';
import {
  closeErrorModal,
  openErrorModal,
  openGenericErrorModal,
} from 'modules/errors/act.errors';
import {
  setPageFilterSelectedAccount,
  setPageFiltersForPageKey,
} from 'modules/page-filters/act.page-filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { getSelectedAccountForPageKey } from 'modules/page-filters/page-filters.selectors';
import { IPageFilters } from 'modules/page-filters/rdc.page-filters';
import { isLocationDeletedException } from 'modules/physical-inventory/helpers';
import {
  closeCreateLocationModal,
  createLocationAction,
  createLocationAndAddToRunAction,
  deleteInventoryLocationAction,
  deleteLocationSuccessToast,
  editLocationAction,
  fetchInventoryLocationsAction,
  openCreateLocationModalAction,
  triggerCreateLocationSuccessToast,
  triggerEditLocationSuccessToast,
} from 'modules/physical-inventory/location-maintenance/act.location-maintenance';
import { getRunCode } from 'modules/physical-inventory/run-details/inventory-run-details.selectors';
import { fetchSelectedRunDetails } from 'modules/physical-inventory/run-details/thunk.inventory-run-details';
import { ILocations } from 'types/inventory-run-details';
import { ThunkAction } from 'types/thunk';

/** Fetch Inventory locations for default account on page load */
export const fetchInitialInventoryLocations = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  const pageFilters: IPageFilters = {
    resetFiltersOnNavigation: false,
    selectedAccount: b2bUnitId,
    searchTerm: '',
  };

  dispatch(setPageFiltersForPageKey(PageKey.LOCATION_MAINTENANCE, pageFilters));
  dispatch(fetchInventoryLocations());
};

/** Fetch Inventory Locations for selected Account */
export const fetchInventoryLocations = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const b2bUnitId = getSelectedAccountForPageKey(
    state,
    PageKey.LOCATION_MAINTENANCE,
  );
  try {
    await dispatch(fetchInventoryLocationsAction(b2bUnitId));
  } catch (exception) {
    throw exception;
  }
};

/** action to render Location deleted modal */
const locationDeletedErrorModal = (): ThunkAction => dispatch => {
  const updateInventoryLocations = () => {
    dispatch(closeErrorModal());
    dispatch(fetchInventoryLocations());
  };
  return dispatch(
    openErrorModal(
      'Location Does Not Exist',
      'This location does not exist. It has been deleted by another user.',
      null,
      {
        confirmBtnText: 'OK',
        confirmFn: updateInventoryLocations,
        hideCancelBtn: true,
      },
    ),
  );
};

/** Delete Location Thunk Action */
const deleteInventoryLocation = (
  location: ILocations,
): ThunkAction => async dispatch => {
  dispatch(closeConfirmationModal());
  try {
    await dispatch(deleteInventoryLocationAction(location));
    dispatch(deleteLocationSuccessToast(location.name));
  } catch (exception) {
    isLocationDeletedException(exception)
      ? dispatch(locationDeletedErrorModal())
      : dispatch(openGenericErrorModal());
    throw exception;
  }
};

/**  Delete Location Confirmation modal  */
export const confirmDeleteInventoryLocation = (
  location: ILocations,
): ThunkAction => dispatch => {
  dispatch(
    openConfirmationModal({
      title: 'Delete Location',
      body: 'Are you sure you want to delete this location?',
      confirmAction: deleteInventoryLocation(location),
      confirmButtonLabel: 'Delete',
      hideCancelBtn: false,
      cancelButtonLabel: 'Cancel',
      cancelAction: closeConfirmationModal(),
    }),
  );
};

/**  Create New Location  */
export const setAccountPageFilterIfChanged = (
  selectedB2bUnitId: string,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const b2bUnitId = getSelectedAccountForPageKey(
    state,
    PageKey.LOCATION_MAINTENANCE,
  );
  const isAccountChanged = selectedB2bUnitId !== b2bUnitId;
  isAccountChanged &&
    dispatch(
      setPageFilterSelectedAccount(PageKey.LOCATION_MAINTENANCE, selectedB2bUnitId),
    );
};

/** Opens Create Location Modal  */
export const openCreateLocationModal = (
  locationInitialState?: ILocations,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const b2bUnitId = getSelectedAccountForPageKey(
    state,
    PageKey.LOCATION_MAINTENANCE,
  );
  dispatch(openCreateLocationModalAction(b2bUnitId, locationInitialState));
};

/** Opens Create Location Modal  */
export const openCreateLocationModalAndAddRun = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const runCode = getRunCode(state);
  const b2bUnitId = getSelectedAccountForPageKey(
    state,
    PageKey.INVENTORY_RUN_DETAILS,
  );
  const locationInitialState = {
    runCode,
    b2bUnitId,
  };
  dispatch(openCreateLocationModalAction(b2bUnitId, locationInitialState));
};

/**  Create New Location  */
export const createLocation = (): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const createLocationReq =
    state.physicalInventory.locationMaintenance.createLocationReq;
  const selectedB2bUnitId = createLocationReq.b2bUnitId;

  try {
    dispatch(closeCreateLocationModal());
    await dispatch(createLocationAction(createLocationReq));
    dispatch(setAccountPageFilterIfChanged(selectedB2bUnitId));
    dispatch(triggerCreateLocationSuccessToast(createLocationReq.name));
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};

/**  Edit Location  */
export const editLocation = (): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const editLocationReq =
    state.physicalInventory.locationMaintenance.createLocationReq;
  const selectedB2bUnitId = editLocationReq.b2bUnitId;

  try {
    dispatch(closeCreateLocationModal());
    await dispatch(editLocationAction(editLocationReq));
    dispatch(setAccountPageFilterIfChanged(selectedB2bUnitId));
    dispatch(triggerEditLocationSuccessToast(editLocationReq.name));
  } catch (exception) {
    isLocationDeletedException(exception)
      ? dispatch(locationDeletedErrorModal())
      : dispatch(openGenericErrorModal());
    throw exception;
  }
};

/**  Create New Location and Add to Run */
export const createLocationAndAddToRun = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const createLocationReq =
    state.physicalInventory.locationMaintenance.createLocationReq;
  const runB2bUnitId = getSelectedAccountForPageKey(
    state,
    PageKey.INVENTORY_RUN_DETAILS,
  );

  try {
    dispatch(closeCreateLocationModal());
    await dispatch(createLocationAndAddToRunAction(createLocationReq));
    await fetchSelectedRunDetails(createLocationReq.runCode, runB2bUnitId);
    dispatch(triggerCreateLocationSuccessToast(createLocationReq.name));
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};
