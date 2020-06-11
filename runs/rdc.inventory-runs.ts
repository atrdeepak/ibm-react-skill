import { Actions } from 'modules/physical-inventory/runs/act.inventory-runs';
import { IImportExportFormat } from 'types/import-export-format';

/** Declaration of values in runs state */
export interface IState {
  /** Is the page currently loading data */
  isLoading: boolean;
  /** Show Create Run Modal */
  showCreateRunModal: boolean;
  /** Entered Run Name Text */
  runNameText: string;
  /** Selected New Run Account */
  selectedNewRunAccount: string;
  /** Is PI Run file imprt modal open */
  isImportModalOpen: boolean;
  /** PI run filename text */
  importFileText: string;
  /** PI Import Run  checkbox */
  isIncludeHeaders: boolean;
  /** Create Run Modal Button enable or disable */
  enableCreateButton: boolean;
  /** Import run Selected File Format */
  selectedFileFormat: string;
  /** Import run File Formats */
  importExportFormats: IImportExportFormat[];
  /** toggle text error message */
  toggleErrorMessage: boolean;
}

/** Initial state of run object */
export const initialState: IState = {
  isLoading: false,
  showCreateRunModal: false,
  runNameText: '',
  selectedNewRunAccount: '',
  isImportModalOpen: false,
  importFileText: '',
  isIncludeHeaders: false,
  enableCreateButton: false,
  selectedFileFormat: '',
  importExportFormats: [],
  toggleErrorMessage: false,
};

/** Reducers for actions on runs state */
export default (state: IState = initialState, action: Actions): IState => {
  switch (action.type) {
    case 'SAVE_RESPONSE_RUNS_DATE_CHANGE-REQUEST':
    case 'FETCH_INVENTORY_RUNS-REQUEST':
      return {
        ...state,
        isLoading: true,
      };
    case 'SAVE_RESPONSE_RUNS_DATE_CHANGE-SUCCESS':
    case 'FETCH_INVENTORY_RUNS-SUCCESS':
      return {
        ...state,
        isLoading: false,
      };
    case 'SAVE_RESPONSE_RUNS_DATE_CHANGE-FAILURE':
    case 'FETCH_INVENTORY_RUNS-FAILURE':
      return {
        ...state,
        isLoading: false,
      };
    case 'TOGGLE_CREATE_RUN_MODAL':
      return {
        ...state,
        runNameText: '',
        selectedNewRunAccount: '',
        showCreateRunModal: !state.showCreateRunModal,
        toggleErrorMessage: false,
      };
    case 'UPDATE_CREATE_RUN_TEXT':
      return {
        ...state,
        runNameText: action.payload.runName,
        enableCreateButton: !action.payload.runNameHasSpecialChar,
        toggleErrorMessage: action.payload.runNameHasSpecialChar,
      };
    case 'UPDATE_CHANGED_ACCOUNT_FOR_CREATE_RUN':
      return {
        ...state,
        selectedNewRunAccount: action.payload.changedAccount,
      };
    case 'OPEN_PI_RUN_IMPORT_MODAL':
      return {
        ...state,
        isImportModalOpen: true,
      };
    case 'CLOSE_PI_RUN_IMPORT_MODAL':
      return {
        ...state,
        isImportModalOpen: false,
        importFileText: '',
        isIncludeHeaders: false,
      };
    case 'UPDATE_PI_RUN_IMPORT_FILE_SELECT_TEXT':
      return {
        ...state,
        importFileText: action.payload.newTextValue,
      };
    case 'TOGGLE_PI_RUN_IMPORT_INCLUDE_HEADERS':
      return {
        ...state,
        isIncludeHeaders: !state.isIncludeHeaders,
      };
    case 'SET_IMPORT_RUN_SELECTED_FILE_FORMAT':
      return {
        ...state,
        selectedFileFormat: action.payload.selectedFileFormat,
      };
    case 'GET_PI_IMPORT_EXPORT_FORMATS-REQUEST':
      return {
        ...state,
        importExportFormats: [],
        selectedFileFormat: 'standardCSV',
      };
    case 'GET_PI_IMPORT_EXPORT_FORMATS-SUCCESS':
      return {
        ...state,
        importExportFormats: action.payload.partnerList,
      };
    default:
      return state;
  }
};
