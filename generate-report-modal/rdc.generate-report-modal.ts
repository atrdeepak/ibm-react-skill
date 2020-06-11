import { Actions } from './act.generate-report-modal';

/** TODO: Add comment */
export interface IModalState {
  /**
   * [optional] Whether the generate report modal is open
   */
  readonly isOpen?: boolean;
  /**
   * [optional] selected Locations in dropdown
   */
  selectedLocations: string[];
  /**
   * [required] run code for generating report
   */
  selectedRunCode: string;
  /**
   * Flag for generating report
   */
  isReportGenerating: boolean;
}

/** TODO: Add comment */
export const initialState: IModalState = {
  isOpen: false,
  selectedLocations: [],
  selectedRunCode: '',
  isReportGenerating: false,
};

/** TODO: Add comment */
export default (state: IModalState = initialState, action: Actions): IModalState => {
  switch (action.type) {
    case 'OPEN_GENERATE_REPORT_MODAL':
      return {
        ...state,
        isOpen: true,
      };
    case 'CLOSE_GENERATE_REPORT_MODAL':
      return {
        ...state,
        isOpen: false,
      };
    case 'GENERATE_REPORT-REQUEST':
      return {
        ...action.payload,
        ...state,
        isReportGenerating: true,
      };
    case 'FETCH_ASSOCIATED_RUN_LOCATIONS-REQUEST':
      return {
        ...action.payload,
        ...state,
      };
    case 'GENERATE_REPORT-SUCCESS':
      return {
        ...state,
        isReportGenerating: false,
      };
    case 'FETCH_ASSOCIATED_RUN_LOCATIONS-SUCCESS':
      return {
        ...state,
      };
    case 'SHOW_LOCATIONS_AS_DROPDOWN_OPTIONS':
      return {
        ...state,
        selectedLocations: action.payload.locationsList,
      };
    case 'UPDATE_SELECTED_LOCATIONS':
      return {
        ...state,
        selectedLocations: action.payload.checkedValues,
      };
    case 'FETCH_ASSOCIATED_RUN_LOCATIONS-FAILURE':
      return {
        ...state,
        isOpen: false,
      };
    case 'GET_RUN_CODE_FOR_GENERATING_REPORT':
      return {
        ...state,
        selectedRunCode: action.payload.runCode,
      };
    default:
      return state;
  }
};
