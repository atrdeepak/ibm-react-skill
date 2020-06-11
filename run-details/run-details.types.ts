import FSA from 'types/fsa';
import { IChangeLocationAccount } from 'types/inventory-run-details';

/** Update UOM value for Location request interface for action */
export interface IUpdateUoMForLocationRequest extends FSA {
  type: 'UPDATE_UOM_FOR_LOCATION-REQUEST';
}
/** Update UOM value for Location Success interface for action */
export interface IUpdateUoMForLocationSuccess extends FSA {
  type: 'UPDATE_UOM_FOR_LOCATION-SUCCESS';
}
/** Update UOM value for Location fails interface for action */
export interface IUpdateUoMForLocationFailure extends FSA {
  type: 'UPDATE_UOM_FOR_LOCATION-FAILURE';
}
/** Action Interface for receiving the Inventory Run details API response  */
export interface IFetchInventoryRunDetailsRequest extends FSA {
  type: 'RECEIVING_FETCH_RUN_DETAILS-REQUEST';
}
/** Successfully retrieved Run Details */
export interface IFetchInventoryRunDetailsSuccess extends FSA {
  type: 'RECEIVING_FETCH_RUN_DETAILS-SUCCESS';
}
/** If Run details fetch failed */
export interface IFetchInventoryRunDetailsFailure extends FSA {
  type: 'RECEIVING_FETCH_RUN_DETAILS-FAILURE';
}
/** Action interface for Setting the Run Name */
export interface ISetInventoryRunNameRequest extends FSA {
  type: 'SAVE_RESPONSE_RUN_NAME_CHANGE-REQUEST';
}
/** Successfully retrieved Runs */
export interface ISetInventoryRunNameSuccess extends FSA {
  type: 'SAVE_RESPONSE_RUN_NAME_CHANGE-SUCCESS';
}
/** If Runs fetch failed */
export interface ISetInventoryRunNameFailure extends FSA {
  type: 'SAVE_RESPONSE_RUN_NAME_CHANGE-FAILURE';
}
/** Action interface for Setting the Inventory Run account */
export interface ISetInventoryRunAccountRequest extends FSA {
  type: 'SAVE_RESPONSE_RUN_ACCOUNT_CHANGE-REQUEST';
}
/** Successfully retrieved Runs */
export interface ISetInventoryRunAccountSuccess extends FSA {
  type: 'SAVE_RESPONSE_RUN_ACCOUNT_CHANGE-SUCCESS';
}
/** If Runs fetch failed */
export interface ISetInventoryRunAccountFailure extends FSA {
  type: 'SAVE_RESPONSE_RUN_ACCOUNT_CHANGE-FAILURE';
}
/** Action interface for Deleting the Inventory location */
export interface IDeleteInventoryLocationRequest extends FSA {
  type: 'DELETE_INVENTORY_LOCATION-REQUEST';
}
/** Successfully deleted location */
export interface IDeleteInventoryLocationSuccess extends FSA {
  type: 'DELETE_INVENTORY_LOCATION-SUCCESS';
}
/** If location delete failed */
export interface IDeleteInventoryLocationFailure extends FSA {
  type: 'DELETE_INVENTORY_LOCATION-FAILURE';
}
/** Interface for toggle copy location modal Action Type */
export interface IToggleCopyLocationModal extends FSA {
  type: 'TOGGLE_COPY_LOCATION_MODAL';
  payload: { locationCode: string };
}
/** Interface for Open Change location Account modal Action Type */
export interface IOpenChangeLocationAccountModal extends FSA {
  type: 'LOCATION_DETAILS_OPEN_CHANGE_ACCOUNT_MODAL';
  payload: { changeLocationData: IChangeLocationAccount };
}
/** Interface for Close Change location Account modal Action Type */
export interface ICloseChangeLocationAccountModal extends FSA {
  type: 'LOCATION_DETAILS_CLOSE_CHANGE_ACCOUNT_MODAL';
}
/** Interface for Update change location account modal Action Type */
export interface IUpdateChangeLocationAccountData extends FSA {
  type: 'UPDATE_CANGE_LOCATION_ACCOUNT_DATA';
  payload: { changeLocationData: IChangeLocationAccount };
}
/** Change Location Account id request interface for action */
export interface IChangeLocationAccountRequest extends FSA {
  type: 'CHANGE_LOCATION_ACCOUNT_ID-REQUEST';
}
/** Change Location Account id Success interface for action */
export interface IChangeLocationAccountSuccess extends FSA {
  type: 'CHANGE_LOCATION_ACCOUNT_ID-SUCCESS';
}
/** Change Location Account id fails interface for action */
export interface IChangeLocationAccountFailure extends FSA {
  type: 'CHANGE_LOCATION_ACCOUNT_ID-FAILURE';
}
/** Interface for toggle copy location modal Action Type */
export interface IToggleIsDeleteAfterCopy extends FSA {
  type: 'TOGGLE_IS_DELETE_AFTER_COPY';
  payload: { isDelete: boolean };
}
/** Interface for update destination code Action Type */
export interface IUpdateDestinationLocationCode extends FSA {
  type: 'UPDATE_DESTINATION_LOCATION_CODE';
  payload: { destinationLocationCode: string };
}
/** Refresh Acquisition cost for location request interface for action */
export interface IRefreshLocationAcquisitionCostRequest extends FSA {
  type: 'REFRESH_LOCATION_ACQUISITION_COST-REQUEST';
}
/** Refresh Acquisition cost for location Success interface for action */
export interface IRefreshLocationAcquisitionCostSuccess extends FSA {
  type: 'REFRESH_LOCATION_ACQUISITION_COST-SUCCESS';
}
/** Refresh Acquisition cost for location fails interface for action */
export interface IRefreshLocationAcquisitionCostFailure extends FSA {
  type: 'REFRESH_LOCATION_ACQUISITION_COST-FAILURE';
}
/** copy location request  */
export interface ICopyRunLocationRequest extends FSA {
  type: 'COPY-RUN-LOCATION-REQUEST';
}
/** copy location success */
export interface ICopyRunLocationSucess extends FSA {
  type: 'COPY-RUN-LOCATION-SUCCESS';
}
/** copy location failure */
export interface ICopyRunLocationFailure extends FSA {
  type: 'COPY-RUN-LOCATION-FAILURE';
}
/** Action interface for Add existing locations modal */
export interface IToggleAddExistingLocationsModal extends FSA {
  type: 'TOGGLE_ADD_EXISTING_LOCATIONS_MODAL';
}

/** Action interface for Fetch All Physical Inventory Locations request */
export interface IFetchLocationsRequest extends FSA {
  type: 'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-REQUEST';
}

/** Action interface for Fetch All Physical Inventory Locations success */
export interface IFetchLocationsSuccess extends FSA {
  type: 'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-SUCCESS';
}

/** Action interface for Fetch All Physical Inventory Locations failure */
export interface IFetchLocationsFailure extends FSA {
  type: 'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-FAILURE';
}

/** Action interface for update selected locations in Add existing locations modal */
export interface IUpdateSelectedLocationIds extends FSA {
  type: 'ADD_EXISTING_LOCATIONS_MODAL_UPDATE_SELECTED_LOCATION_IDS';
  payload: {
    updatedSelectedLocationIds: string[];
    updatedSelectAllCheckbox: boolean;
  };
}

/** Action interface for Adding Existing locations to run request */
export interface IAddExistingLocationsRequest extends FSA {
  type: 'ADD_EXISTING_LOCATIONS-REQUEST';
}

/** Action interface for Adding Existing locations to run success */
export interface IAddExistingLocationsSuccess extends FSA {
  type: 'ADD_EXISTING_LOCATIONS-SUCCESS';
}

/** Action interface for Adding Existing locations to run failure */
export interface IAddExistingLocationsFailure extends FSA {
  type: 'ADD_EXISTING_LOCATIONS-FAILURE';
}
/** All actions for Runs */
export type Actions =
  | IFetchInventoryRunDetailsRequest
  | IFetchInventoryRunDetailsSuccess
  | IFetchInventoryRunDetailsFailure
  | ISetInventoryRunNameRequest
  | ISetInventoryRunNameSuccess
  | ISetInventoryRunNameFailure
  | IUpdateUoMForLocationRequest
  | IUpdateUoMForLocationSuccess
  | IUpdateUoMForLocationFailure
  | IDeleteInventoryLocationRequest
  | IDeleteInventoryLocationSuccess
  | IDeleteInventoryLocationFailure
  | ISetInventoryRunAccountRequest
  | ISetInventoryRunAccountSuccess
  | ISetInventoryRunAccountFailure
  | IRefreshLocationAcquisitionCostRequest
  | IRefreshLocationAcquisitionCostSuccess
  | IRefreshLocationAcquisitionCostFailure
  | IToggleCopyLocationModal
  | ICopyRunLocationRequest
  | ICopyRunLocationSucess
  | ICopyRunLocationFailure
  | IUpdateDestinationLocationCode
  | IToggleIsDeleteAfterCopy
  | IOpenChangeLocationAccountModal
  | ICloseChangeLocationAccountModal
  | IUpdateChangeLocationAccountData
  | IChangeLocationAccountRequest
  | IChangeLocationAccountSuccess
  | IChangeLocationAccountFailure
  | IToggleAddExistingLocationsModal
  | IFetchLocationsRequest
  | IFetchLocationsSuccess
  | IFetchLocationsFailure
  | IUpdateSelectedLocationIds
  | IAddExistingLocationsRequest
  | IAddExistingLocationsSuccess
  | IAddExistingLocationsFailure;
