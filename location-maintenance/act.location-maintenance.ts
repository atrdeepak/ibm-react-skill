import { inventoryLocationSchema } from 'modules/entities/schemas/physical-inventory/inventory-locations-schema';
import { IAddToast } from 'modules/toast/types';
import { API_CALL, HS_BASE_PATH, USERNAME } from 'redux/middleware/api';
import FSA from 'types/fsa';
import { ICreateLocationReq, ILocations } from 'types/inventory-run-details';
import RSAA from 'types/rsaa';

/** Fetch Physical Inventory Locations request */
export interface IFetchLocationsRequest extends FSA {
  type: 'LOCATION_MAINTENANCE_FETCH_LOCATIONS-REQUEST';
}

/** Fetch Physical Inventory Locations success */
export interface IFetchLocationsSuccess extends FSA {
  type: 'LOCATION_MAINTENANCE_FETCH_LOCATIONS-SUCCESS';
}

/** Fetch Physical Inventory Locations failure */
export interface IFetchLocationsFailure extends FSA {
  type: 'LOCATION_MAINTENANCE_FETCH_LOCATIONS-FAILURE';
}

/** fetch Physical Inventory Locations action */
export const fetchInventoryLocationsAction = (b2bUnitId: string): RSAA => {
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
        'LOCATION_MAINTENANCE_FETCH_LOCATIONS-REQUEST',
        'LOCATION_MAINTENANCE_FETCH_LOCATIONS-SUCCESS',
        'LOCATION_MAINTENANCE_FETCH_LOCATIONS-FAILURE',
      ],
    },
  };
};

/** Fetch Physical Inventory Locations success */
export interface IDeleteInventoryLocationsSuccess extends FSA {
  type: 'LOCATION_MAINTENANCE_DELETE_LOCATION-SUCCESS';
}

/** Delete Inventory Location Action */
export const deleteInventoryLocationAction = (location: ILocations): RSAA => {
  const body = {
    locationList: [
      {
        code: location.code,
      },
    ],
  };
  const b2bUnitId = location.b2bUnitId;
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/delete-locations`,
      method: 'DELETE',
      body,
      throwOnError: true,
      types: [
        'LOCATION_MAINTENANCE_DELETE_LOCATION-REQUEST',
        'LOCATION_MAINTENANCE_DELETE_LOCATION-SUCCESS',
        'LOCATION_MAINTENANCE_DELETE_LOCATION-FAILURE',
      ],
    },
  };
};

/** Action to trigger delete location success toast */
export const deleteLocationSuccessToast = (locationName: string): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Location Deleted',
    body: `${locationName} deleted successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** Interface to open Create New Location Modal */
export interface IOpenCreateLocationModalAction extends FSA {
  type: 'LOCATION_MAINTENANCE_OPEN_CREATE_LOCATION_MODAL';
  payload: {
    locationReq: ICreateLocationReq;
    b2bUnitId: string;
  };
}

/** Open Create New Location Modal */
export const openCreateLocationModalAction = (
  b2bUnitId: string,
  locationReq: ICreateLocationReq,
): IOpenCreateLocationModalAction => ({
  type: 'LOCATION_MAINTENANCE_OPEN_CREATE_LOCATION_MODAL',
  payload: {
    b2bUnitId,
    locationReq,
  },
});

/** Interface to close Create New Location Modal */
export interface ICloseCreateLocationModal extends FSA {
  type: 'LOCATION_MAINTENANCE_CLOSE_CREATE_LOCATION_MODAL';
}

/** Close Create Location Modal */
export const closeCreateLocationModal = (): ICloseCreateLocationModal => ({
  type: 'LOCATION_MAINTENANCE_CLOSE_CREATE_LOCATION_MODAL',
});

/** Interface to open Create Edit Location Modal */
export interface IOpenEditLocationModal extends FSA {
  type: 'LOCATION_MAINTENANCE_OPEN_EDIT_LOCATION_MODAL';
}

/** Open Create Edit Location Modal */
export const openEditLocationModalAction = (): IOpenEditLocationModal => ({
  type: 'LOCATION_MAINTENANCE_OPEN_EDIT_LOCATION_MODAL',
});

/** Interface to close Create Edit Location Modal */
export interface ICloseEditLocationModal extends FSA {
  type: 'LOCATION_MAINTENANCE_CLOSE_EDIT_LOCATION_MODAL';
}

/** Close Edit Location Modal */
export const closeEditLocationModal = (): ICloseEditLocationModal => ({
  type: 'LOCATION_MAINTENANCE_CLOSE_EDIT_LOCATION_MODAL',
});

/** Interface to set selected location name */
export interface ISetLocationName extends FSA {
  type: 'LOCATION_MAINTENANCE_SET_LOCATION_NAME';
  payload: { locationName: string; locationNameHasSpecialChar: boolean };
}

/** Set Selected Location Name */
export const setLocationName = (
  locationName: string,
  locationNameHasSpecialChar: boolean,
): ISetLocationName => ({
  type: 'LOCATION_MAINTENANCE_SET_LOCATION_NAME',
  payload: { locationName, locationNameHasSpecialChar },
});

/** Interface to set selected UOM */
export interface ISetLocationUom extends FSA {
  type: 'LOCATION_MAINTENANCE_SET_LOCATION_UOM';
  payload: { uom: string };
}

/** Set Selected Location UOM */
export const setLocationUom = (uom: string): ISetLocationUom => ({
  type: 'LOCATION_MAINTENANCE_SET_LOCATION_UOM',
  payload: { uom },
});

/** Interface to set selected B2bUnit Id */
export interface ISetLocationB2bunitId extends FSA {
  type: 'LOCATION_MAINTENANCE_SET_LOCATION_B2BUNIT_ID';
  payload: { b2bUnitId: string };
}

/** Set Selected Location B2bUnit Id */
export const setlocationB2bUnitId = (b2bUnitId: string): ISetLocationB2bunitId => ({
  type: 'LOCATION_MAINTENANCE_SET_LOCATION_B2BUNIT_ID',
  payload: { b2bUnitId },
});

/** Create Inventory Location Action */
export const createLocationAction = (
  createLocationReq: ICreateLocationReq,
): RSAA => {
  const b2bUnitId = createLocationReq.b2bUnitId;
  const body = {
    locationList: [createLocationReq],
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/create-location-maintenance`,
      schema: inventoryLocationSchema,
      method: 'POST',
      body,
      throwOnError: true,
      types: [
        'LOCATION_MAINTENANCE_CREATE_LOCATION-REQUEST',
        'LOCATION_MAINTENANCE_CREATE_LOCATION-SUCCESS',
        'LOCATION_MAINTENANCE_CREATE_LOCATION-FAILURE',
      ],
    },
  };
};

/** Edit Inventory Location Action */
export const editLocationAction = (editLocationReq: ICreateLocationReq): RSAA => {
  const b2bUnitId = editLocationReq.b2bUnitId;
  const body = editLocationReq;
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/locations-maintenance-update`,
      schema: inventoryLocationSchema,
      method: 'PUT',
      body,
      throwOnError: true,
      types: [
        'LOCATION_MAINTENANCE_EDIT_LOCATION-REQUEST',
        'LOCATION_MAINTENANCE_EDIT_LOCATION-SUCCESS',
        'LOCATION_MAINTENANCE_EDIT_LOCATION-FAILURE',
      ],
    },
  };
};

/** Fetch Physical Inventory Create Location request */
export interface ICreatRunLocationRequest extends FSA {
  type: 'LOCATION_MAINTENANCE_CREATE_LOCATION_ADD_TO_RUN-REQUEST';
}

/** Fetch Physical Inventory Create Run Location success */
export interface ICreateRunLocationSuccess extends FSA {
  type: 'LOCATION_MAINTENANCE_CREATE_LOCATION_ADD_TO_RUN-SUCCESS';
}

/** Fetch Physical Inventory Create Run Location failure */
export interface ICreateRunLocationFailure extends FSA {
  type: 'LOCATION_MAINTENANCE_CREATE_LOCATION_ADD_TO_RUN-FAILURE';
}

/** Create Location and Add location to Run Action */
export const createLocationAndAddToRunAction = (
  createLocationReq: ICreateLocationReq,
): RSAA => {
  const b2bUnitId = createLocationReq.b2bUnitId;
  const body = {
    locationList: [createLocationReq],
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/create-run-locations`,
      method: 'POST',
      body,
      throwOnError: true,
      types: [
        'LOCATION_MAINTENANCE_CREATE_LOCATION_ADD_TO_RUN-REQUEST',
        'LOCATION_MAINTENANCE_CREATE_LOCATION_ADD_TO_RUN-SUCCESS',
        'LOCATION_MAINTENANCE_CREATE_LOCATION_ADD_TO_RUN-FAILURE',
      ],
    },
  };
};

/** Action to trigger Create location success toast */
export const triggerCreateLocationSuccessToast = (
  locationName: string,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Location Created',
    body: `${locationName} created successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** Action to trigger Edit location success toast */
export const triggerEditLocationSuccessToast = (
  locationName: string,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Location Updated',
    body: `${locationName} updated  successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** export Physical Inventory Locations actions */
export type Actions =
  | IFetchLocationsRequest
  | IFetchLocationsSuccess
  | IFetchLocationsFailure
  | IDeleteInventoryLocationsSuccess
  | IOpenCreateLocationModalAction
  | ICloseCreateLocationModal
  | IOpenEditLocationModal
  | ICloseEditLocationModal
  | ISetLocationName
  | ISetLocationUom
  | ISetLocationB2bunitId
  | ICreateRunLocationSuccess;
