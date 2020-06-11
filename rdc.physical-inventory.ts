import generateReportModal, {
  IModalState as IIGenerateReportModalState,
  initialState as generateReportModalInitialState,
} from 'modules/physical-inventory/generate-report-modal/rdc.generate-report-modal';
import inventoryLocationDetails, {
  initialState as inventoryLocationDetailsInitalState,
  IState as IInventoryLocationDetailsState,
} from 'modules/physical-inventory/location-details/rdc.inventory-location-details';
import locationMaintenance, {
  initialState as locationMaintenanceInitialState,
  IState as ILocationMaintenanceState,
} from 'modules/physical-inventory/location-maintenance/rdc.location-maintenance';
import inventoryRunDetails, {
  initialState as inventoryRunDetailsInitialState,
  IState as IInventoryRunDetailsState,
} from 'modules/physical-inventory/run-details/rdc.inventory-run-details';
import inventoryRuns, {
  initialState as inventoryRunsInitialState,
  IState as IInventoryRunsState,
} from 'modules/physical-inventory/runs/rdc.inventory-runs';
import { combineReducers } from 'redux';

/** Defines the state structure for the physical inventory portion of state */
export interface IState {
  generateReportModal: IIGenerateReportModalState;
  inventoryRuns: IInventoryRunsState;
  inventoryRunDetails: IInventoryRunDetailsState;
  locationMaintenance: ILocationMaintenanceState;
  inventoryLocationDetails: IInventoryLocationDetailsState;
}

/** Defines the initial state values of physical inventory */
export const initialState: IState = {
  generateReportModal: generateReportModalInitialState,
  inventoryRuns: inventoryRunsInitialState,
  inventoryRunDetails: inventoryRunDetailsInitialState,
  locationMaintenance: locationMaintenanceInitialState,
  inventoryLocationDetails: inventoryLocationDetailsInitalState,
};

/** combines the physical inventory sub reducers */
export default combineReducers<IState>({
  generateReportModal,
  inventoryRuns,
  inventoryRunDetails,
  locationMaintenance,
  inventoryLocationDetails,
});
