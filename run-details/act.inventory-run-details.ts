import { inventoryLocationSchema } from 'modules/entities/schemas/physical-inventory/inventory-locations-schema';
import { inventoryRunDetailsSchema } from 'modules/entities/schemas/physical-inventory/inventoryRunDetails.schema';
import * as Types from 'modules/physical-inventory/run-details/run-details.types';
import { IAddToast } from 'modules/toast/types';
import { API_CALL, HS_BASE_PATH, USERNAME } from 'redux/middleware/api';
import { IChangeLocationAccount, ILocations } from 'types/inventory-run-details';
import RSAA from 'types/rsaa';

/** Fetches runs Details for currently selected Accounts & runs */
const fetchSelectedRunDetailsAction = (runCode: string, b2bUnitId: string): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `/abcb2bcommercewebservices/v3/abcb2b/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}`,
      method: 'GET',
      schema: { inventoryRunDetailsSchema },
      throwOnError: true,
      types: [
        'RECEIVING_FETCH_RUN_DETAILS-REQUEST',
        'RECEIVING_FETCH_RUN_DETAILS-SUCCESS',
        'RECEIVING_FETCH_RUN_DETAILS-FAILURE',
      ],
    },
  };
};

/** Delete Location REST call */
const deleteLocation = (locationData: ILocations): RSAA => {
  const body = {
    locationList: [
      {
        code: locationData.code,
        runCode: locationData.runCode,
      },
    ],
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${locationData.b2bUnitId}/users/${USERNAME}/pi/delete-run-locations`,
      method: 'DELETE',
      body,
      throwOnError: true,
      types: [
        'DELETE_INVENTORY_LOCATION-REQUEST',
        'DELETE_INVENTORY_LOCATION-SUCCESS',
        'DELETE_INVENTORY_LOCATION-FAILURE',
      ],
    },
  };
};

/** Action to trigger delete location success toast */
export const triggerAddDeleteLocationSuccessToast = (
  locationName: string,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Location Deleted',
    body: `${locationName} deleted successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** Action to trigger on account change success toast */
export const triggerAccountChangeSuccessToast = (): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Account Changed',
    body: 'Account associated with run successfully changed',
    iconType: 'success',
    duration: 6,
  },
});

/** Change Runs Date */
const setRunNameAction = (
  name: string,
  runCode: string,
  b2bUnitId: string,
): RSAA => {
  const body = { name };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}`,
      method: 'PUT',
      body,
      types: [
        'SAVE_RESPONSE_RUN_NAME_CHANGE-REQUEST',
        'SAVE_RESPONSE_RUN_NAME_CHANGE-SUCCESS',
        'SAVE_RESPONSE_RUN_NAME_CHANGE-FAILURE',
      ],
    },
  };
};

/** Change Run Account */
const updateRunAccount = (
  newAccount: string,
  runCode: string,
  b2bUnitId: string,
): RSAA => {
  const body = {
    b2bUnitId: newAccount,
    code: runCode,
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}`,
      method: 'PUT',
      body,
      types: [
        'SAVE_RESPONSE_RUN_ACCOUNT_CHANGE-REQUEST',
        'SAVE_RESPONSE_RUN_ACCOUNT_CHANGE-SUCCESS',
        'SAVE_RESPONSE_RUN_ACCOUNT_CHANGE-FAILURE',
      ],
    },
  };
};

/** Creating Action For Update UOM value for location */
const updateUoMForLocation = (
  locationData: ILocations,
  changedString: string,
): RSAA => {
  const body = {
    locationList: [
      {
        runCode: locationData.runCode,
        code: locationData.code,
        b2bUnitId: locationData.b2bUnitId,
        unitOfMeasure: changedString,
      },
    ],
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${locationData.b2bUnitId}/users/${USERNAME}/pi/update-run-locations`,
      method: 'PUT',
      body,
      throwOnError: true,
      types: [
        'UPDATE_UOM_FOR_LOCATION-REQUEST',
        'UPDATE_UOM_FOR_LOCATION-SUCCESS',
        'UPDATE_UOM_FOR_LOCATION-FAILURE',
      ],
    },
  };
};

/** Creating Action For Refresh Acquisition Cost for location */
const refreshLocationAcquisitionCost = (locationData: ILocations): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${locationData.b2bUnitId}/users/${USERNAME}/pi/runs/${locationData.runCode}/locations/${locationData.code}`,
      method: 'PUT',
      throwOnError: true,
      types: [
        'REFRESH_LOCATION_ACQUISITION_COST-REQUEST',
        'REFRESH_LOCATION_ACQUISITION_COST-SUCCESS',
        'REFRESH_LOCATION_ACQUISITION_COST-FAILURE',
      ],
    },
  };
};

/** Creating Action For copy location */
const copyLocation = (
  runCode: string,
  b2bUnitId: string,
  source: string,
  target: string,
  selectedProductIds: string[],
  isDelete: boolean,
): RSAA => {
  let url = `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}/locations/copy-and-delete-entries?`;
  url += `source=${source}`;
  url += `&target=${target}`;
  url += `&isDelete=${isDelete}`;

  if (selectedProductIds.length > 0) {
    url += `&entries=${selectedProductIds}`;
  }

  return {
    [API_CALL]: {
      endpoint: url,
      method: 'POST',
      throwOnError: true,
      types: [
        'COPY-RUN-LOCATION-REQUEST',
        {
          type: 'COPY-RUN-LOCATION-SUCCESS',
          meta: { isDelete, source },
        },
        'COPY-RUN-LOCATION-FAILURE',
      ],
    },
  };
};

/** Action to trigger Refresh Acquisition Cost for location success toast */
export const triggerLocationRefreshAcquisitionCostSuccessToast = (
  locationName: string,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Acquisition Cost Refreshed',
    body: `${locationName} refreshed successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** Action to trigger copy location success toast */
export const triggerCopyLocationSuccessToast = (
  locationName: string,
  locationCode: string,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Products Copied Successfully',
    body: `view ${locationName} >`,
    iconType: 'success',
    url: `/physical-inventory/location-details?locationCode=${locationCode}`,
    disableNavigation: false,
    duration: 6,
  },
});

/** Action creator for Close Change location Account modal */
const closeChangeLocationAccountModal = (): Types.ICloseChangeLocationAccountModal => ({
  type: 'LOCATION_DETAILS_CLOSE_CHANGE_ACCOUNT_MODAL',
});

/** Action creator for Open Change location Account modal */
const openChangeLocationAccountModal = (
  changeLocationData: IChangeLocationAccount,
): Types.IOpenChangeLocationAccountModal => ({
  type: 'LOCATION_DETAILS_OPEN_CHANGE_ACCOUNT_MODAL',
  payload: { changeLocationData },
});

/** Action creator for toggle copy location modal */
const toggleCopyLocationModal = (
  locationCode: string,
): Types.IToggleCopyLocationModal => ({
  type: 'TOGGLE_COPY_LOCATION_MODAL',
  payload: { locationCode },
});

/** Creating Action For Change account for location */
const changeLocationAccountApiService = (
  b2bUnitId: string,
  locationData: IChangeLocationAccount,
): RSAA => {
  const body = {
    locationList: [
      {
        runCode: locationData.runCode,
        code: locationData.code,
        b2bUnitId: locationData.changedAccount,
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
        'CHANGE_LOCATION_ACCOUNT_ID-REQUEST',
        'CHANGE_LOCATION_ACCOUNT_ID-SUCCESS',
        'CHANGE_LOCATION_ACCOUNT_ID-FAILURE',
      ],
    },
  };
};

/** Action for triggering location Account changed success toast */
export const triggerLocationAccountChangedToast = (): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Account Changed',
    body: 'Account Changed successfully',
    iconType: 'success',
    duration: 6,
  },
});

/** Action for Updating change location account modal */
const updateChangeLocationAccountData = (
  changeLocationData: IChangeLocationAccount,
): Types.IUpdateChangeLocationAccountData => ({
  type: 'UPDATE_CANGE_LOCATION_ACCOUNT_DATA',
  payload: { changeLocationData },
});

/** Action for toggle copy location modal */
const toggleIsDeletedAfterCopy = (
  isDelete: boolean,
): Types.IToggleIsDeleteAfterCopy => ({
  type: 'TOGGLE_IS_DELETE_AFTER_COPY',
  payload: { isDelete },
});

/** Action for update destination code */
const updateDestinationLocationCode = (
  destinationLocationCode: string,
): Types.IUpdateDestinationLocationCode => ({
  type: 'UPDATE_DESTINATION_LOCATION_CODE',
  payload: { destinationLocationCode },
});

/** fetch Physical Inventory Locations action */
const fetchInventoryLocationsAction = (b2bUnitId: string): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/account-locations?b2bUnitIds=${b2bUnitId}`,
      schema: {
        locationList: [inventoryLocationSchema],
      },
      method: 'GET',
      throwOnError: true,
      toastOnError: true,
      types: [
        'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-REQUEST',
        'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-SUCCESS',
        'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-FAILURE',
      ],
    },
  };
};

const updateSelectedLocationIds = (
  updatedSelectedLocationIds: string[],
  updatedSelectAllCheckbox: boolean,
): Types.IUpdateSelectedLocationIds => {
  return {
    type: 'ADD_EXISTING_LOCATIONS_MODAL_UPDATE_SELECTED_LOCATION_IDS',
    payload: { updatedSelectedLocationIds, updatedSelectAllCheckbox },
  };
};

/** Action for Hide and show of Add Existing Locations Modal */
const toggleAddExistingLocationsModal = (): Types.IToggleAddExistingLocationsModal => ({
  type: 'TOGGLE_ADD_EXISTING_LOCATIONS_MODAL',
});

/** Action for adding Existing locations to Run on click Of ADD in add Existing Locations Modal */
const addExistingLocations = (b2bUnitId: string, locationData: ILocations): RSAA => {
  const body = {
    locationList: locationData,
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/add-run-locations`,
      method: 'POST',
      body,
      throwOnError: true,
      types: [
        'ADD_EXISTING_LOCATIONS-REQUEST',
        'ADD_EXISTING_LOCATIONS-SUCCESS',
        'ADD_EXISTING_LOCATIONS-FAILURE',
      ],
    },
  };
};

/** Action to trigger Add existing locations sucessful toast */
export const triggerAddExistingLocationSucessToast = (): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Locations Added',
    body: `Locations added successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** Action to trigger Add existing locations partial sucessful toast */
export const triggerAddExistingLocationPartialSucessToast = (): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Some Location(s) Added',
    body: `Some locations were added successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** export Actions */
export {
  fetchSelectedRunDetailsAction,
  setRunNameAction,
  updateRunAccount,
  updateUoMForLocation,
  deleteLocation,
  refreshLocationAcquisitionCost,
  toggleCopyLocationModal,
  updateDestinationLocationCode,
  toggleIsDeletedAfterCopy,
  copyLocation,
  openChangeLocationAccountModal,
  closeChangeLocationAccountModal,
  updateChangeLocationAccountData,
  changeLocationAccountApiService,
  toggleAddExistingLocationsModal,
  fetchInventoryLocationsAction,
  updateSelectedLocationIds,
  addExistingLocations,
};
