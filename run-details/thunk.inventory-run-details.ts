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
  hideGlobalLoadingSpinner,
  showGlobalLoadingSpinner,
} from 'modules/loading-spinner/act.loading-spinner';
import {
  setPageFilterSearchTerm,
  setPageFilterSelectedAccount,
} from 'modules/page-filters/act.page-filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { getSelectedAccountForPageKey } from 'modules/page-filters/page-filters.selectors';
import {
  getMultiUserModalBodyText,
  getMultiUserModalTitle,
  isMultiLocationDeletedException,
} from 'modules/physical-inventory/helpers';
import {
  addExistingLocations,
  changeLocationAccountApiService,
  closeChangeLocationAccountModal,
  copyLocation,
  deleteLocation,
  fetchInventoryLocationsAction,
  fetchSelectedRunDetailsAction,
  openChangeLocationAccountModal,
  refreshLocationAcquisitionCost,
  setRunNameAction,
  toggleAddExistingLocationsModal,
  toggleCopyLocationModal,
  toggleIsDeletedAfterCopy,
  triggerAccountChangeSuccessToast,
  triggerAddDeleteLocationSuccessToast,
  triggerAddExistingLocationPartialSucessToast,
  triggerAddExistingLocationSucessToast,
  triggerCopyLocationSuccessToast,
  triggerLocationAccountChangedToast,
  triggerLocationRefreshAcquisitionCostSuccessToast,
  updateChangeLocationAccountData,
  updateDestinationLocationCode,
  updateRunAccount,
  updateSelectedLocationIds,
  updateUoMForLocation,
} from 'modules/physical-inventory/run-details/act.inventory-run-details';
import {
  getFilteredInventoryLocations,
  getRunCode,
  getSearchedInventoryLocations,
} from 'modules/physical-inventory/run-details/inventory-run-details.selectors';
import Router from 'next/router';
import { IChangeLocationAccount, ILocations } from 'types/inventory-run-details';
import { ThunkAction } from 'types/thunk';

/** Action to fetch Run Details for selected Run */
export const fetchSelectedRunDetails = (
  selectedRunCode: string,
  selectedAccount: string,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  selectedAccount = selectedAccount ? selectedAccount : b2bUnitId;
  dispatch(
    setPageFilterSelectedAccount(PageKey.INVENTORY_RUN_DETAILS, selectedAccount),
  );
  try {
    await dispatch(fetchSelectedRunDetailsAction(selectedRunCode, selectedAccount));
  } catch (e) {
    dispatch(
      openGenericErrorModal(
        null,
        'Unexpected Error Occured',
        true,
        '/physical-inventory',
      ),
    );
    throw e;
  }
};

/** set Run Name Changes */
export const setRunNameThunk = (
  name: string,
  runCode: string,
): ThunkAction => async (dispatch, getState) => {
  try {
    const state = getState();
    const b2bUnitId = getDefaultOrSelectedAccount(state);
    dispatch(setRunNameAction(name, runCode, b2bUnitId));
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};
/** Navigate to Location Details Page */
export const navigateLocationDetails = (
  runCode: string,
  locationCode: string,
): ThunkAction => async dispatch => {
  dispatch(navigateToLocationDetailsPage(runCode, locationCode));
};

/** This action will helps to navigate from rin details page to location Details page */
export const navigateToLocationDetailsPage = (
  selectedRunCode: string,
  selectedLocationCode: string,
): ThunkAction => async () => {
  const url = '/physical-inventory/location-details';
  Router.push({
    pathname: url,
    query: {
      runCode: selectedRunCode,
      locationCode: selectedLocationCode,
    },
  });
};
/** update Run Account Changes */
export const setRunAccountThunk = (
  newAccount: string,
  runCode: string,
): ThunkAction => async (dispatch, getState) => {
  try {
    const state = getState();
    const b2bUnitId = getDefaultOrSelectedAccount(state);
    dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, newAccount));
    dispatch(
      setPageFilterSelectedAccount(PageKey.INVENTORY_RUN_DETAILS, newAccount),
    );
    await dispatch(updateRunAccount(newAccount, runCode, b2bUnitId));
    dispatch(triggerAccountChangeSuccessToast());
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};

/** change UoM For Location Thunk Action */
export const changeUoMForLocation = (
  locationData: ILocations,
  changedString: string,
): ThunkAction => async dispatch => {
  try {
    await dispatch(updateUoMForLocation(locationData, changedString));
  } catch (exception) {
    const exceptionErrorsRef = exception.response.data[0].exceptionData;
    const exceptionMessage =
      exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
    const multiUserExceptionList = ['LOCATION_DELETED_EXCEPTION'];
    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(e => exceptionMessage.includes(e));
    exceptionType
      ? dispatch(
          openErrorModal(
            getMultiUserModalTitle(exceptionType),
            getMultiUserModalBodyText(exceptionType, ''),
            closeConfirmationModal,
          ),
        )
      : dispatch(openGenericErrorModal());
    throw exception;
  }
};

/** Add Existing Locations Modal Thunk Action */
export const addExistingLocationsModal = (): ThunkAction => dispatch => {
  dispatch(toggleAddExistingLocationsModal());
  dispatch(setPageFilterSearchTerm(PageKey.INVENTORY_RUN_DETAILS, ''));
};

/** Delete Location Thunk Action */
const deleteInventoryLocation = (
  locationData: ILocations,
): ThunkAction => async dispatch => {
  dispatch(closeConfirmationModal());
  try {
    await dispatch(deleteLocation(locationData));
    dispatch(triggerAddDeleteLocationSuccessToast(locationData.name));
  } catch (exception) {
    const exceptionErrorsRef = exception.response.data[0].exceptionData;
    const exceptionMessage =
      exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
    const multiUserExceptionList = ['LOCATION_DELETED_EXCEPTION'];
    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(e => exceptionMessage.includes(e));
    exceptionType
      ? dispatch(
          openErrorModal(
            getMultiUserModalTitle(exceptionType),
            getMultiUserModalBodyText(exceptionType, ''),
            closeConfirmationModal,
          ),
        )
      : dispatch(openGenericErrorModal());
    throw exception;
  }
};

/** Confirm Delete Location Confirmation modal thunk action */
export const confirmDeleteLocation = (
  locationData: ILocations,
): ThunkAction => dispatch => {
  dispatch(
    openConfirmationModal({
      title: 'Delete Location',
      body: 'Are you sure you want to delete this location?',
      confirmAction: deleteInventoryLocation(locationData),
      confirmButtonLabel: 'Delete',
      hideCancelBtn: false,
      cancelButtonLabel: 'Cancel',
      cancelAction: closeConfirmationModal(),
    }),
  );
};

/** Refresh Acquisition Cost For Location Thunk Action */
const refreshAcquisitionCostForLocation = (
  locationData: ILocations,
): ThunkAction => async dispatch => {
  dispatch(closeConfirmationModal());
  try {
    await dispatch(refreshLocationAcquisitionCost(locationData));
    dispatch(triggerLocationRefreshAcquisitionCostSuccessToast(locationData.name));
  } catch (exception) {
    const exceptionErrorsRef = exception.response.data[0].exceptionData;
    const exceptionMessage =
      exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
    const multiUserExceptionList = ['LOCATION_DELETED_EXCEPTION'];

    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(e => exceptionMessage.includes(e));

    exceptionType
      ? dispatch(
          openErrorModal(
            getMultiUserModalTitle(exceptionType),
            getMultiUserModalBodyText(exceptionType, ''),
            closeConfirmationModal,
          ),
        )
      : dispatch(openGenericErrorModal());
    throw exception;
  }
};

/** Refresh Acquisition cost For Location Confirmation modal Thunk Action */
export const confirmLocationRefreshAcquisitionCost = (
  locationData: ILocations,
): ThunkAction => dispatch => {
  dispatch(
    openConfirmationModal({
      title: 'Refresh Acquisition Cost',
      body:
        'Are you sure you want to refresh the acquisition cost(s) in this location? This will also reset any manually entered values.',
      confirmAction: refreshAcquisitionCostForLocation(locationData),
      confirmButtonLabel: 'Refresh',
      hideCancelBtn: false,
      cancelButtonLabel: 'Cancel',
      cancelAction: closeConfirmationModal(),
    }),
  );
};

/** Change Modal status */
export const hideShowCopyLocationModal = (
  locationCode: string,
): ThunkAction => async (dispatch, getState) => {
  dispatch(toggleCopyLocationModal(locationCode));
};
/** Show Change Location Account Modal */
export const showChangeLocationAccountModal = (
  locationData: IChangeLocationAccount,
): ThunkAction => async (dispatch, getState) => {
  dispatch(openChangeLocationAccountModal(locationData));
};
/** Hide Change Location Account Modal */
export const hideChangeLocationAccountModal = (): ThunkAction => async dispatch => {
  dispatch(closeChangeLocationAccountModal());
};

/** Trigger Change Location Account Data Modal */
export const triggerChangeLocationAccountData = (
  locationData: IChangeLocationAccount,
): ThunkAction => async (dispatch, getState) => {
  dispatch(updateChangeLocationAccountData(locationData));
};

/** Service Call to Change Location Account Modal */
export const changeLocationAccountService = (
  locationData: IChangeLocationAccount,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  try {
    dispatch(closeChangeLocationAccountModal());
    dispatch(showGlobalLoadingSpinner());
    await dispatch(changeLocationAccountApiService(b2bUnitId, locationData));
    await dispatch(fetchSelectedRunDetailsAction(locationData.runCode, b2bUnitId));
    dispatch(triggerLocationAccountChangedToast());
  } catch (exception) {
    const exceptionType = 'LOCATION_DELETED_EXCEPTION';
    dispatch(
      openErrorModal(
        getMultiUserModalTitle(exceptionType),
        getMultiUserModalBodyText(exceptionType, ''),
        closeConfirmationModal,
      ),
    );
    await dispatch(fetchSelectedRunDetailsAction(locationData.runCode, b2bUnitId));
    throw exception;
  } finally {
    dispatch(hideGlobalLoadingSpinner());
  }
};
/** Change Modal status */
export const toggleIsDeleteAfterCopy = (
  isDelete: boolean,
): ThunkAction => async dispatch => {
  dispatch(toggleIsDeletedAfterCopy(isDelete));
};
/** update destination location code */
export const updateDestinationLocation = (
  destinationLocationCode: string,
): ThunkAction => dispatch => {
  dispatch(updateDestinationLocationCode(destinationLocationCode));
};
/** copy run location  */
export const copyRunLocation = (): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const b2bUnitId =
    getDefaultOrSelectedAccount(state) ||
    state.entities.inventoryLocationDetails.b2bUnitId;
  const source = state.physicalInventory.inventoryRunDetails.sourceLocationCode;
  const target = state.physicalInventory.inventoryRunDetails.destinationLocationCode;
  const isDelete = state.physicalInventory.inventoryRunDetails.isDeleteLocation;
  const runCode: any = state.entities.inventoryRunDetails.code;
  const selectedProductIds = Object.values(
    state.entities.inventoryLocationDetails.entries,
  ).map((x: any) => x.code);
  const copiedLocation = Object.values(
    state.entities.inventoryRunDetails.locations,
  ).filter((location: any) => location.code === target);
  dispatch(toggleCopyLocationModal(''));
  try {
    await dispatch(
      copyLocation(runCode, b2bUnitId, source, target, selectedProductIds, isDelete),
    );
    await dispatch(fetchSelectedRunDetails(runCode, b2bUnitId));
    dispatch(triggerCopyLocationSuccessToast(copiedLocation[0].name, target));
  } catch (exception) {
    const exceptionErrorsRef = exception.response.data[0];
    const exceptionMessage =
      exceptionErrorsRef && exception.response.data[0].message;
    const multiUserExceptionList = [
      'The run you are trying to edit has been deleted',
      'Locations already deleted or does not exist!',
      'The location you are trying to copy to has been deleted.',
    ];
    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(element => exceptionMessage.includes(element));
    exceptionType
      ? dispatch(
          openErrorModal(
            getMultiUserModalTitle(exceptionType),
            getMultiUserModalBodyText(exceptionType, ''),
            closeConfirmationModal,
          ),
        )
      : dispatch(openGenericErrorModal());
    await dispatch(fetchSelectedRunDetailsAction(runCode, b2bUnitId));
    throw exception;
  }
};

/** Fetch All Inventory Locations for selected Account on Add Existing Locations Modal open */
export const fetchInventoryLocations = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const b2bUnitId = getSelectedAccountForPageKey(
    state,
    PageKey.INVENTORY_RUN_DETAILS,
  );
  try {
    dispatch(fetchInventoryLocationsAction(b2bUnitId));
    await dispatch(addExistingLocationsModal());
  } catch (exception) {
    throw exception;
  }
};

/** Updates the selected Location codes in Add Existing Locations Modal */
export const updateSelectedLocations = (code: string): ThunkAction => (
  dispatch,
  getState,
) => {
  const state = getState();
  const allFilteredLocations = getSearchedInventoryLocations(state);
  const totalNumberOfLocations = Object.keys(allFilteredLocations).length;
  const selectedLocationIds =
    state.physicalInventory.inventoryRunDetails.selectedLocations;
  const updatedSelectedLocationIds =
    selectedLocationIds.findIndex(said => said === code) !== -1
      ? selectedLocationIds.filter(said => said !== code)
      : selectedLocationIds.concat(code);
  const selectAllCheckbox =
    totalNumberOfLocations === updatedSelectedLocationIds.length;
  dispatch(updateSelectedLocationIds(updatedSelectedLocationIds, selectAllCheckbox));
};
/** Updates the selected Locations when select all checkbox is clicked in Add Existing Locations Modal */
export const selectAllLocationsCheckbox = (): ThunkAction => (
  dispatch,
  getState,
) => {
  const state = getState();
  const allFilteredLocations = getSearchedInventoryLocations(state);
  const allLocationIds = allFilteredLocations.map((loc: any) => loc.code);
  const totalNumberOfLocations = allLocationIds.length;
  const selectedLocationIds =
    state.physicalInventory.inventoryRunDetails.selectedLocations;
  const areAllSelected = totalNumberOfLocations === selectedLocationIds.length;
  const updatedSelectAllCheckbox = !areAllSelected;
  const updatedSelectedApprovalIds = areAllSelected ? [] : allLocationIds;
  dispatch(
    updateSelectedLocationIds(updatedSelectedApprovalIds, updatedSelectAllCheckbox),
  );
};
/** action to render Multi Location deleted modal */
const multiLocationDeletedErrorModal = (): ThunkAction => dispatch => {
  const updateInventoryRunLocations = () => {
    dispatch(closeErrorModal());
  };
  return dispatch(
    openErrorModal(
      'Location Does Not Exist',
      'The location does not exist. It has been deleted by another user',
      null,
      {
        confirmBtnText: 'OK',
        confirmFn: updateInventoryRunLocations,
        hideCancelBtn: true,
      },
    ),
  );
};

/** Update the run details and open the partial success toast for added locations  */
export const updateRunAfterPartialAddedLocations = (
  runCode: string,
  b2bUnitId: string,
): ThunkAction => async dispatch => {
  dispatch(showGlobalLoadingSpinner());
  await dispatch(fetchSelectedRunDetailsAction(runCode, b2bUnitId));
  dispatch(triggerAddExistingLocationPartialSucessToast());
};

/** Add the locations to Run on click of Add button in Add Existing Locations Modal */
export const addExistingLocationsToRun = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  const allFilteredLocations = getFilteredInventoryLocations(state);
  const selectedLocationsCode =
    state.physicalInventory.inventoryRunDetails.selectedLocations;
  const locationsToBeAdded = allFilteredLocations.filter((locationObj: ILocations) =>
    selectedLocationsCode.includes(locationObj.code),
  );
  const runCode = getRunCode(state);
  const payload = locationsToBeAdded.reduce((accVal: any, locObj: ILocations) => {
    return [
      ...accVal,
      {
        runCode,
        code: locObj.code,
        b2bUnitId,
        unitOfMeasure: locObj.unitOfMeasure,
        name: locObj.name,
      },
    ];
  }, []);
  try {
    dispatch(setPageFilterSearchTerm(PageKey.INVENTORY_RUN_DETAILS, ''));
    dispatch(toggleAddExistingLocationsModal());
    await dispatch(addExistingLocations(b2bUnitId, payload));
    await dispatch(fetchSelectedRunDetailsAction(runCode, b2bUnitId));
    dispatch(triggerAddExistingLocationSucessToast());
  } catch (exception) {
    const [
      deletedLocationsCount,
      areLocationsDeleted,
    ] = isMultiLocationDeletedException(exception);
    const locationsSelectedCount = selectedLocationsCode.length;
    const areAllLocationsDeleted =
      deletedLocationsCount === locationsSelectedCount ? true : false;
    const arePartialLocationsDeleted =
      deletedLocationsCount < locationsSelectedCount ? true : false;
    areLocationsDeleted && areAllLocationsDeleted
      ? dispatch(multiLocationDeletedErrorModal())
      : areLocationsDeleted && arePartialLocationsDeleted
      ? dispatch(updateRunAfterPartialAddedLocations(runCode, b2bUnitId))
      : dispatch(openGenericErrorModal());
    throw exception;
  } finally {
    dispatch(hideGlobalLoadingSpinner());
  }
};
// tslint:disable-next-line:max-file-line-count
