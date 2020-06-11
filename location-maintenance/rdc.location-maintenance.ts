import { Actions as LocationMaintenanceActions } from 'modules/physical-inventory/location-maintenance/act.location-maintenance';
import { ICreateLocationReq } from 'types/inventory-run-details';

/** Physcial Inventory Location Maintenance State */
export interface IState {
  /**
   * True if locations are being fetchced
   */
  isLoading: boolean;
  /**
   * True if Create New modal open
   */
  isCreateLocationModalOpen: boolean;
  /**
   * Is Edit Location Modal open
   */
  isEditLocationModalOpen: boolean;
  /**
   * Location request
   */
  createLocationReq: ICreateLocationReq;
  /**
   * toggle text error message
   */
  toggleErrorMessage: boolean;
  /**
   * enable disable next button
   */
  enableNextButton: boolean;
}

const createLocationInitialState: ICreateLocationReq = {
  name: '',
  unitOfMeasure: 'Base',
  b2bUnitId: '',
  toggleErrorMessage: false,
  enableNextButton: false,
};

/** Physcial Inventory Location Maintenance Initial State */
export const initialState: IState = {
  isLoading: false,
  isCreateLocationModalOpen: false,
  isEditLocationModalOpen: false,
  createLocationReq: createLocationInitialState,
  toggleErrorMessage: false,
  enableNextButton: false,
};

/** Physcial Inventory Location Maintenance State */
export default (
  state: IState = initialState,
  action: LocationMaintenanceActions,
): IState => {
  switch (action.type) {
    case 'LOCATION_MAINTENANCE_FETCH_LOCATIONS-REQUEST':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOCATION_MAINTENANCE_FETCH_LOCATIONS-SUCCESS':
      return {
        ...state,
        isLoading: false,
      };
    case 'LOCATION_MAINTENANCE_FETCH_LOCATIONS-FAILURE':
      return {
        ...state,
        isLoading: false,
      };
    case 'LOCATION_MAINTENANCE_OPEN_CREATE_LOCATION_MODAL':
      return {
        ...state,
        isCreateLocationModalOpen: true,
        createLocationReq: action.payload.locationReq
          ? {
              ...createLocationInitialState,
              ...action.payload.locationReq,
            }
          : {
              ...createLocationInitialState,
              b2bUnitId: action.payload.b2bUnitId,
            },
      };
    case 'LOCATION_MAINTENANCE_CLOSE_CREATE_LOCATION_MODAL':
      return {
        ...state,
        isCreateLocationModalOpen: false,
        createLocationReq: createLocationInitialState,
      };
    case 'LOCATION_MAINTENANCE_SET_LOCATION_NAME':
      return {
        ...state,
        createLocationReq: {
          ...state.createLocationReq,
          name: action.payload.locationName,
          toggleErrorMessage: action.payload.locationNameHasSpecialChar,
          enableNextButton: !action.payload.locationNameHasSpecialChar,
        },
      };
    case 'LOCATION_MAINTENANCE_SET_LOCATION_UOM':
      return {
        ...state,
        createLocationReq: {
          ...state.createLocationReq,
          unitOfMeasure: action.payload.uom,
        },
      };
    case 'LOCATION_MAINTENANCE_SET_LOCATION_B2BUNIT_ID':
      return {
        ...state,
        createLocationReq: {
          ...state.createLocationReq,
          b2bUnitId: action.payload.b2bUnitId,
        },
      };
    default:
      return state;
  }
};
