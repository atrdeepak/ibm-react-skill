import { Actions } from 'modules/physical-inventory/run-details/run-details.types';
import { IChangeLocationAccount } from 'types/inventory-run-details';

/** Declaration of values in runs state */
export interface IState {
  /** Is the page currently loading data */
  isLoading: boolean;
  /** Is the page currently loading data */
  selectedInventoryRunDetails: any;
  /** toggle copy location modal */
  showCopyLocationModal: boolean;
  /** toggle change location Account modal */
  showChangeLocationAccountModal: boolean;
  /** Selected Location Account Object */
  selectedLocationAccount: IChangeLocationAccount;
  /** source location code */
  sourceLocationCode: string;
  /** destination location code */
  destinationLocationCode: string;
  /** is delete location */
  isDeleteLocation: boolean;
  /** open and close Add Existing Locations Modal */
  isAddExistingLocationsModalOpen: boolean;
  /** selected location in Add existing location modal */
  selectedLocations: string[];
  /** whether selected all checkbox */
  selectAllCheckboxChecked: boolean;
}

const initialSelectedLocationAccountObj: IChangeLocationAccount = {
  runCode: '',
  code: '',
  b2bUnitId: '',
  changedAccount: '',
};

/** Initial state of run object */
export const initialState: IState = {
  isLoading: false,
  selectedInventoryRunDetails: {},
  showCopyLocationModal: false,
  showChangeLocationAccountModal: false,
  selectedLocationAccount: initialSelectedLocationAccountObj,
  sourceLocationCode: '',
  destinationLocationCode: '',
  isDeleteLocation: false,
  isAddExistingLocationsModalOpen: false,
  selectedLocations: [],
  selectAllCheckboxChecked: false,
};

/** Reducers for actions on runs state */
export default (state: IState = initialState, action: Actions): IState => {
  switch (action.type) {
    case 'SAVE_RESPONSE_RUN_ACCOUNT_CHANGE-REQUEST':
    case 'SAVE_RESPONSE_RUN_NAME_CHANGE-REQUEST':
    case 'RECEIVING_FETCH_RUN_DETAILS-REQUEST':
    case 'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-REQUEST':
      return {
        ...state,
        isLoading: true,
      };
    case 'SAVE_RESPONSE_RUN_ACCOUNT_CHANGE-SUCCESS':
    case 'SAVE_RESPONSE_RUN_NAME_CHANGE-SUCCESS':
    case 'RECEIVING_FETCH_RUN_DETAILS-SUCCESS':
    case 'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-SUCCESS':
      return {
        ...state,
        isLoading: false,
      };
    case 'SAVE_RESPONSE_RUN_NAME_CHANGE-FAILURE':
    case 'RECEIVING_FETCH_RUN_DETAILS-FAILURE':
    case 'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-FAILURE':
      return {
        ...state,
        isLoading: false,
      };
    case 'TOGGLE_COPY_LOCATION_MODAL':
      return {
        ...state,
        showCopyLocationModal: !state.showCopyLocationModal,
        sourceLocationCode: action.payload.locationCode,
        destinationLocationCode: '',
        isDeleteLocation: false,
      };
    case 'LOCATION_DETAILS_OPEN_CHANGE_ACCOUNT_MODAL':
      return {
        ...state,
        showChangeLocationAccountModal: true,
        selectedLocationAccount: action.payload.changeLocationData,
      };
    case 'LOCATION_DETAILS_CLOSE_CHANGE_ACCOUNT_MODAL':
      return {
        ...state,
        showChangeLocationAccountModal: false,
        selectedLocationAccount: initialSelectedLocationAccountObj,
      };
    case 'UPDATE_CANGE_LOCATION_ACCOUNT_DATA':
      return {
        ...state,
        selectedLocationAccount: action.payload.changeLocationData,
      };
    case 'UPDATE_DESTINATION_LOCATION_CODE':
      return {
        ...state,
        destinationLocationCode: action.payload.destinationLocationCode,
      };
    case 'TOGGLE_IS_DELETE_AFTER_COPY':
      return {
        ...state,
        isDeleteLocation: action.payload.isDelete,
      };
    case 'TOGGLE_ADD_EXISTING_LOCATIONS_MODAL':
      return {
        ...state,
        isAddExistingLocationsModalOpen: !state.isAddExistingLocationsModalOpen,
        selectedLocations: [],
        selectAllCheckboxChecked: false,
      };
    case 'ADD_EXISTING_LOCATIONS_MODAL_UPDATE_SELECTED_LOCATION_IDS':
      return {
        ...state,
        selectedLocations: action.payload.updatedSelectedLocationIds,
        selectAllCheckboxChecked: action.payload.updatedSelectAllCheckbox,
      };
    default:
      return state;
  }
};
