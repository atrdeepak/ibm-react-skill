import FileSaver from 'file-saver';
import { getTimezoneAbbreviation } from 'helpers/format-date';
import { inventoryLocationSchema } from 'modules/entities/schemas/physical-inventory/inventory-locations-schema';
import { openGenericErrorModal } from 'modules/errors/act.errors';
import { IAddToast } from 'modules/toast/types';
import { API_CALL, HS_BASE_PATH, USERNAME } from 'redux/middleware/api';
import FSA from 'types/fsa';
import RSAA from 'types/rsaa';

//#region Open GenerateReport Modal

/** TODO: Add comment */
export interface IOpenGenerateReportModalAction extends FSA {
  type: 'OPEN_GENERATE_REPORT_MODAL';
}

/** TODO: Add comment */
export const toggleGenerateReportModal = (): IOpenGenerateReportModalAction => ({
  type: 'OPEN_GENERATE_REPORT_MODAL',
});

//#endregion Open GenerateReport Modal

//#region Close GenerateReport Modal

/** TODO: Add comment */
export interface ICloseGenerateReportModalAction extends FSA {
  type: 'CLOSE_GENERATE_REPORT_MODAL';
}

/** TODO: Add comment */
export const closeGenerateReportModal = (): ICloseGenerateReportModalAction => ({
  type: 'CLOSE_GENERATE_REPORT_MODAL',
});

//#endregion Close GenerateReport Modal

//#region Fetch all locations for associated run on click of GenerateReport icon on runs Landing page
interface IFetchAssociatedRunLocationsRequest extends FSA {
  type: 'FETCH_ASSOCIATED_RUN_LOCATIONS-REQUEST';
}

interface IFetchAssociatedRunLocationsSuccess extends FSA {
  type: 'FETCH_ASSOCIATED_RUN_LOCATIONS-SUCCESS';
}

interface IFetchAssociatedRunLocationsFailure extends FSA {
  type: 'FETCH_ASSOCIATED_RUN_LOCATIONS-FAILURE';
}

const fetchAllLocationsForAssociatedRunAction = (
  runCode: string,
  b2bUnitId: string,
): RSAA => {
  return {
    [API_CALL]: {
      endpoint: `${HS_BASE_PATH}/unitId/${b2bUnitId}/users/${USERNAME}/pi/runs/${runCode}`,
      method: 'GET',
      schema: { locations: [inventoryLocationSchema] },
      throwOnError: true,
      types: [
        'FETCH_ASSOCIATED_RUN_LOCATIONS-REQUEST',
        {
          type: 'FETCH_ASSOCIATED_RUN_LOCATIONS-SUCCESS',
          meta: { replace: true, keys: ['inventoryLocations'] },
        },
        'FETCH_ASSOCIATED_RUN_LOCATIONS-FAILURE',
      ],
    },
  };
};
//#endregion Fetch all locations for associated run on click of GenerateReport icon on runs Landing page

interface IShowLocationsAsDropdownOptions extends FSA {
  payload: {
    locationsList: string[];
  };
  type: 'SHOW_LOCATIONS_AS_DROPDOWN_OPTIONS';
}

/** Show the locations names as dropdown options for generate report modal */
const showLocationsAsDropdownOptions = (
  locationsList: string[],
): IShowLocationsAsDropdownOptions => {
  return {
    payload: {
      locationsList,
    },
    type: 'SHOW_LOCATIONS_AS_DROPDOWN_OPTIONS',
  };
};

/** This toast message fires as soon as the user clicks the Download button when importing Non abc products usage  data */
export const generateReportDownloadProcessingToast = (): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Generating Report',
    body: 'Larger files may take longer to download',
    iconType: 'processing',
    duration: 6,
  },
});

interface IUpdateSelectedLocations extends FSA {
  payload: {
    checkedValues: string[];
  };
  type: 'UPDATE_SELECTED_LOCATIONS';
}

/** Update the dropdown options for generate report modal */
const updateSelectedLocations = (
  checkedValues: string[],
): IUpdateSelectedLocations => {
  return {
    payload: {
      checkedValues,
    },
    type: 'UPDATE_SELECTED_LOCATIONS',
  };
};

interface IGetRunCodeForGeneratingReport extends FSA {
  payload: {
    runCode: string;
  };
  type: 'GET_RUN_CODE_FOR_GENERATING_REPORT';
}

const getRunCodeForGeneratingReport = (
  runCode: string,
): IGetRunCodeForGeneratingReport => {
  return {
    payload: { runCode },
    type: 'GET_RUN_CODE_FOR_GENERATING_REPORT',
  };
};

interface IGenerateReportRequest extends FSA {
  type: 'GENERATE_REPORT-REQUEST';
}

interface IGenerateReportSuccess extends FSA {
  type: 'GENERATE_REPORT-SUCCESS';
}

interface IGenerateReportFailure extends FSA {
  type: 'GENERATE_REPORT-FAILURE';
}

/** Generate the report for the run */
const generateReport = (
  runCode: string,
  selectedFormatAndType: string,
  selectedLocationCodes: string,
  downloadedfileExt: string,
  downloadedfileName: string,
  downloadedfileType: string,
): RSAA => {
  let reportEndpoint = `${HS_BASE_PATH}/pi/report/${selectedFormatAndType}?runCode=${runCode}`;
  reportEndpoint += `&locations=${selectedLocationCodes}&headerLine=Y&timeZoneId=${getTimezoneAbbreviation()}`;
  return {
    [API_CALL]: {
      endpoint: `${reportEndpoint}`,
      method: 'GET',
      throwOnError: true,
      types: [
        'GENERATE_REPORT-REQUEST',
        {
          meta: { isDownload: true },
          type: 'GENERATE_REPORT-SUCCESS',
          payload: async (action, res, data: string, dispatch) => {
            try {
              if (downloadedfileType && downloadedfileType === 'application/pdf') {
                const blob = new Blob([data], { type: `${downloadedfileType}` });
                FileSaver.saveAs(blob, `${downloadedfileName}.${downloadedfileExt}`);
              } else {
                const blob = await res.blob();
                FileSaver.saveAs(blob, `${downloadedfileName}.${downloadedfileExt}`);
              }
            } catch (exception) {
              dispatch(openGenericErrorModal());
            }
          },
        },
        'GENERATE_REPORT-FAILURE',
      ],
    },
  };
};

/** Generate the Comparison report for the run */
const comparisonGenerateReport = (
  selectedFileFormat: string,
  runCode1: string,
  runCode2: string,
  downloadedfileExt: string,
  downloadedfileName: string,
  downloadedfileType: string,
): RSAA => {
  const reportEndpoint = `${HS_BASE_PATH}/pi/report/compare/${selectedFileFormat}?runCode1=${runCode1}&runCode2=${runCode2}`;
  return {
    [API_CALL]: {
      endpoint: `${reportEndpoint}`,
      method: 'GET',
      throwOnError: true,
      types: [
        'GENERATE_REPORT-REQUEST',
        {
          meta: { isDownload: true },
          type: 'GENERATE_REPORT-SUCCESS',
          payload: async (action, res, data: string, dispatch) => {
            try {
              if (downloadedfileType && downloadedfileType === 'application/pdf') {
                const blob = new Blob([data], { type: `${downloadedfileType}` });
                FileSaver.saveAs(blob, `${downloadedfileName}.${downloadedfileExt}`);
              } else {
                const blob = await res.blob();
                FileSaver.saveAs(blob, `${downloadedfileName}.${downloadedfileExt}`);
              }
            } catch (exception) {
              dispatch(openGenericErrorModal());
            }
          },
        },
        'GENERATE_REPORT-FAILURE',
      ],
    },
  };
};

/** TODO: Add comment */
type Actions =
  | IOpenGenerateReportModalAction
  | ICloseGenerateReportModalAction
  | IFetchAssociatedRunLocationsRequest
  | IFetchAssociatedRunLocationsSuccess
  | IFetchAssociatedRunLocationsFailure
  | IUpdateSelectedLocations
  | IShowLocationsAsDropdownOptions
  | IGetRunCodeForGeneratingReport
  | IGenerateReportRequest
  | IGenerateReportSuccess
  | IGenerateReportFailure;

/** Export Actyions for generate report Modal */
export {
  Actions,
  fetchAllLocationsForAssociatedRunAction,
  showLocationsAsDropdownOptions,
  updateSelectedLocations,
  getRunCodeForGeneratingReport,
  generateReport,
  comparisonGenerateReport,
};
