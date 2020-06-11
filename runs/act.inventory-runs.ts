import { inventoryRunsSchema } from 'modules/entities/schemas/physical-inventory/inventoryRuns.schema';
import { redirectToRunDetailsPage } from 'modules/physical-inventory/runs/thunk.inventory-runs';
import { IAddToast } from 'modules/toast/types';
import { API_CALL, HS_BASE_PATH, USERNAME } from 'redux/middleware/api';
import FSA from 'types/fsa';
import { IImportExportFormat } from 'types/import-export-format';
import { IInventoryRuns } from 'types/inventory-runs';
import RSAA from 'types/rsaa';

/** Creating Action For fetching Inventory Runs */
const fetchInitialRuns = (b2bUnitId: string): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/selected-runs?b2bUnitIds=${b2bUnitId}`,
      method: 'POST',
      schema: { runsList: [inventoryRunsSchema] },
      types: [
        'FETCH_INVENTORY_RUNS-REQUEST',
        {
          type: 'FETCH_INVENTORY_RUNS-SUCCESS',
          meta: { replace: true, keys: ['inventoryRuns'] },
        },
        'FETCH_INVENTORY_RUNS-FAILURE',
      ],
    },
  };
};

/** Creating Action For creating new run */
const createNewRun = (b2bUnitId: string, runName: string): RSAA => {
  const body = {
    name: runName,
    b2bUnitId,
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs`,
      method: 'POST',
      body,
      types: [
        'CREATE_RUN-REQUEST',
        {
          type: 'CREATE_RUN-SUCCESS',
          payload: (action, res, respData, dispatch) => {
            dispatch(redirectToRunDetailsPage(respData.data[0].code));
            return respData;
          },
        },
        'CREATE_RUN-FAILURE',
      ],
    },
  };
};

/** Change Runs Date */
const setRunsDateAction = (date: Date, runCode: string, b2bUnitId: string): RSAA => {
  const body = {
    date,
  };
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}`,
      method: 'PUT',
      body,
      types: [
        'SAVE_RESPONSE_RUNS_DATE_CHANGE-REQUEST',
        {
          type: 'SAVE_RESPONSE_RUNS_DATE_CHANGE-SUCCESS',
          meta: { runCode, date },
        },
        'SAVE_RESPONSE_RUNS_DATE_CHANGE-FAILURE',
      ],
    },
  };
};

/** Interface for toggle Create Run modal Action Type */
export interface IToggleCreateRunModal extends FSA {
  type: 'TOGGLE_CREATE_RUN_MODAL';
}
/** Action creator for toggle Create Run modal */
const toggleCreateRunModal = (): IToggleCreateRunModal => ({
  type: 'TOGGLE_CREATE_RUN_MODAL',
});

/** Interface for Update Create run text Action Type */
export interface IUpdateRunNameText extends FSA {
  type: 'UPDATE_CREATE_RUN_TEXT';
  payload: { runName: string; runNameHasSpecialChar: boolean };
}
/** Action creator for Update Create run text */
const updateRunNameText = (
  runName: string,
  runNameHasSpecialChar: boolean,
): IUpdateRunNameText => ({
  type: 'UPDATE_CREATE_RUN_TEXT',
  payload: { runName, runNameHasSpecialChar },
});

/** Interface for Update Create new run selected account Action Type */
export interface ISelectedNewRunAccount extends FSA {
  type: 'UPDATE_CHANGED_ACCOUNT_FOR_CREATE_RUN';
  payload: { changedAccount: string };
}
/** Action creator for Update Create new run selected account */
const selectedNewRunAccount = (changedAccount: string): ISelectedNewRunAccount => ({
  type: 'UPDATE_CHANGED_ACCOUNT_FOR_CREATE_RUN',
  payload: { changedAccount },
});

/** Check product count for Inventory Runs */
const checkProductCountForRun = (b2bUnitId: string, runCode: string): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}/check-products-count`,
      method: 'GET',
      throwOnError: true,
      types: [
        'CHECK_PRODUCT_COUNT_FOR_RUN-REQUEST',
        {
          type: 'CHECK_PRODUCT_COUNT_FOR_RUN-SUCCESS',
          payload: (action, res, respData, dispatch) => {
            const isBtnEnabled = respData.data[0].isRefreshAndGenerateBtnEnable;
            return isBtnEnabled;
          },
        },
        'CHECK_PRODUCT_COUNT_FOR_RUN-FAILURE',
      ],
    },
  };
};

/** Created Delete Run REST call */
const deleteRun = (b2bUnitId: string, code: string): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${code}`,
      method: 'DELETE',
      throwOnError: true,
      types: [
        'DELETE_INVENTORY_RUNS-REQUEST',
        {
          type: 'DELETE_INVENTORY_RUNS-SUCCESS',
          meta: { code },
        },
        {
          type: 'DELETE_INVENTORY_RUNS-FAILURE',
          meta: { code },
        },
      ],
    },
  };
};

/** Refresh Acquisition cost request interface for action */
interface IRefreshAcquisitionCostRequest extends FSA {
  type: 'REFRESH_ACQUISITION_COST-REQUEST';
}
/** Refresh Acquisition cost Success interface for action */
interface IRefreshAcquisitionCostSuccess extends FSA {
  type: 'REFRESH_ACQUISITION_COST-SUCCESS';
}
/** Refresh Acquisition cost fails interface for action */
interface IRefreshAcquisitionCostFailure extends FSA {
  type: 'REFRESH_ACQUISITION_COST-FAILURE';
}

/** Creating Action For Refresh Acquisition Cost */
const refreshRunAcquisitionCost = (runData: IInventoryRuns): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${runData.b2bUnitId}/users/${USERNAME}/pi/runs/refresh/${runData.code}`,
      method: 'GET',
      throwOnError: true,
      types: [
        'REFRESH_ACQUISITION_COST-REQUEST',
        'REFRESH_ACQUISITION_COST-SUCCESS',
        'REFRESH_ACQUISITION_COST-FAILURE',
      ],
    },
  };
};

/** Action to trigger Refresh Acquisition Cost success toast */
export const triggerRefreshAcquisitionCostSuccessToast = (
  runName: string,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Acquisition Cost Refreshed',
    body: `${runName} refreshed successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** Action to trigger delete run success toast */
export const triggerAddDeleteRunSuccessToast = (runName: string): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Run Deleted',
    body: `${runName} deleted successfully`,
    iconType: 'success',
    duration: 6,
  },
});

interface IFetchInventoryRunsRequest extends FSA {
  type: 'FETCH_INVENTORY_RUNS-REQUEST';
}

/** Successfully retrieved Runs */
interface IFetchInventoryRunsSuccess extends FSA {
  type: 'FETCH_INVENTORY_RUNS-SUCCESS';
}
/** If Runs fetch failed */
interface IFetchInventoryRunsFailure extends FSA {
  type: 'FETCH_INVENTORY_RUNS-FAILURE';
}
/** Create run request interface for action */
interface ICreateRunRequest extends FSA {
  type: 'CREATE_RUN-REQUEST';
}
/** Create run Success interface for action */
interface ICreateRunSuccess extends FSA {
  type: 'CREATE_RUN-SUCCESS';
}
/** Create run fails interface for action */
interface ICreateRunFailure extends FSA {
  type: 'CREATE_RUN-FAILURE';
}
interface ISetInventoryRunsDateRequest extends FSA {
  type: 'SAVE_RESPONSE_RUNS_DATE_CHANGE-REQUEST';
}
/** Successfully retrieved Runs */
interface ISetInventoryRunsDateSuccess extends FSA {
  type: 'SAVE_RESPONSE_RUNS_DATE_CHANGE-SUCCESS';
}
/** If Runs fetch failed */
interface ISetInventoryRunsDateFailure extends FSA {
  type: 'SAVE_RESPONSE_RUNS_DATE_CHANGE-FAILURE';
}

interface IDeleteInventoryRunsRequest extends FSA {
  type: 'DELETE_INVENTORY_RUNS-REQUEST';
}

interface IDeleteInventoryRunsSuccess extends FSA {
  type: 'DELETE_INVENTORY_RUNS-SUCCESS';
}

interface IDeleteInventoryRunsFailure extends FSA {
  type: 'DELETE_INVENTORY_RUNS-FAILURE';
}

/** Interface to Open Physical Inventory Run import modal */
export interface IOpenInventoryRunImportModal extends FSA {
  type: 'OPEN_PI_RUN_IMPORT_MODAL';
}
/** Action to Open the Physical Inventory Run import modal */
export const openInventoryRunImportModal = (): IOpenInventoryRunImportModal => ({
  type: 'OPEN_PI_RUN_IMPORT_MODAL',
});

/** Interface to Setting Selected File format Physical Inventory Run import modal */
export interface ISetImportRunSelectedFileFormatModal extends FSA {
  type: 'SET_IMPORT_RUN_SELECTED_FILE_FORMAT';
  payload: { selectedFileFormat: string };
}
/** Action to Setting Selected File format Physical Inventory Run import modal */
export const setImportRunSelectedFileFormat = (
  selectedFileFormat: string,
): ISetImportRunSelectedFileFormatModal => ({
  type: 'SET_IMPORT_RUN_SELECTED_FILE_FORMAT',
  payload: { selectedFileFormat },
});

/** Interface to Close Physical Inventory Run ImportModal */
export interface ICloseInventoryRunImportModal extends FSA {
  type: 'CLOSE_PI_RUN_IMPORT_MODAL';
}

/** Action to Close the Physical Inventory Run import modal */
export const closeInventoryRunImportModal = (): ICloseInventoryRunImportModal => ({
  type: 'CLOSE_PI_RUN_IMPORT_MODAL',
});

/** Interface to Physical Inventory Run import file select text change */
export interface IUpdateInventoryRunImportFileSelectText extends FSA {
  type: 'UPDATE_PI_RUN_IMPORT_FILE_SELECT_TEXT';
  payload: {
    newTextValue: string;
  };
}

/** Action to Physical Inventory import Run file select text change */
export const updateInventoryRunFileSelectText = (
  newTextValue: string,
): IUpdateInventoryRunImportFileSelectText => ({
  type: 'UPDATE_PI_RUN_IMPORT_FILE_SELECT_TEXT',
  payload: {
    newTextValue,
  },
});

/** Interface to include column headers */
export interface IToggleInventoryRunImportIncludeHeaders extends FSA {
  type: 'TOGGLE_PI_RUN_IMPORT_INCLUDE_HEADERS';
}

/** Action to toggle include headers */
export const toggleInventoryRunImportIncludeHeaders = (): IToggleInventoryRunImportIncludeHeaders => ({
  type: 'TOGGLE_PI_RUN_IMPORT_INCLUDE_HEADERS',
});

/** This toast message fires as soon as the user clicks the Import button when importing an softblock data */
export const fileImportProcessingToast = (): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'File Import',
    body: 'Processing...',
    iconType: 'processing',
    duration: 6,
  },
});

/** Physical Inventory Run file import api call and error handling */
export const submitInventoryRunileUploadInternal = (
  formData: FormData,
  selectedAccountId: string,
  uploadType: string,
  headerIncluded: string,
  importFormatId: string,
): RSAA => {
  return {
    [API_CALL]: {
      body: formData,
      endpoint: `${HS_BASE_PATH}/unitId/${selectedAccountId}/users/${USERNAME}/uploadFile?uploadType=${uploadType}&headerIncluded=${headerIncluded}&fileType=${importFormatId}`,
      headers: { 'Content-Type': 'multipart/form-data' },
      throwOnError: true,
      method: 'POST',
      types: [
        'PI_RUN_FILE_UPLOAD-REQUEST',
        'PI_RUN_FILE_UPLOAD-SUCCESS',
        'PI_RUN_FILE_UPLOAD-FAILURE',
      ],
    },
  };
};

/** Physical Inventory Import File Formats */
export const getPIImportExportFormatsAction = (
  selectedAccountId: string,
  serviceType: string,
  cddType: string,
): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${selectedAccountId}/users/${USERNAME}/cdd-imp-exp-formats?serviceType=${serviceType}&cddType=${cddType}`,
      method: 'GET',
      throwOnError: true,
      types: [
        'GET_PI_IMPORT_EXPORT_FORMATS-REQUEST',
        'GET_PI_IMPORT_EXPORT_FORMATS-SUCCESS',
        'GET_PI_IMPORT_EXPORT_FORMATS-FAILURE',
      ],
    },
  };
};

/** Interface for file import and export formats request */
export interface IGetImportExportFormatsRequest extends FSA {
  type: 'GET_PI_IMPORT_EXPORT_FORMATS-REQUEST';
}

/** Interface for file import and export formats success */
export interface IGetImportExportFormatsSuccess extends FSA {
  payload: {
    partnerList: IImportExportFormat[];
  };
  type: 'GET_PI_IMPORT_EXPORT_FORMATS-SUCCESS';
}

/** Interface for file import and export formats failure */
export interface IGetImportExportFormatsFailure extends FSA {
  type: 'GET_PI_IMPORT_EXPORT_FORMATS-FAILURE';
}
/** All actions for Runs */
type Actions =
  | IFetchInventoryRunsRequest
  | IFetchInventoryRunsSuccess
  | IFetchInventoryRunsFailure
  | IToggleCreateRunModal
  | ICreateRunRequest
  | ICreateRunSuccess
  | ICreateRunFailure
  | ISetInventoryRunsDateRequest
  | ISetInventoryRunsDateSuccess
  | ISetInventoryRunsDateFailure
  | IDeleteInventoryRunsRequest
  | IDeleteInventoryRunsSuccess
  | IDeleteInventoryRunsFailure
  | IUpdateRunNameText
  | ISelectedNewRunAccount
  | IRefreshAcquisitionCostRequest
  | IRefreshAcquisitionCostSuccess
  | IRefreshAcquisitionCostFailure
  | IOpenInventoryRunImportModal
  | ICloseInventoryRunImportModal
  | IUpdateInventoryRunImportFileSelectText
  | ISetImportRunSelectedFileFormatModal
  | IToggleInventoryRunImportIncludeHeaders
  | IGetImportExportFormatsRequest
  | IGetImportExportFormatsSuccess
  | IGetImportExportFormatsFailure;

/** export Actions */
export {
  Actions,
  fetchInitialRuns,
  deleteRun,
  refreshRunAcquisitionCost,
  setRunsDateAction,
  toggleCreateRunModal,
  createNewRun,
  updateRunNameText,
  selectedNewRunAccount,
  checkProductCountForRun,
};
