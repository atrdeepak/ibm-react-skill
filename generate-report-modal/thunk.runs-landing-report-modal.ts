import { closeConfirmationModal } from 'modules/confirmation-modal/act.confirmation-modal';
import { getDefaultOrSelectedAccount } from 'modules/dashboard/ordering-dashboard.selectors';
import { openErrorModal, openGenericErrorModal } from 'modules/errors/act.errors';
import {
  closeGenerateReportModal,
  comparisonGenerateReport,
  fetchAllLocationsForAssociatedRunAction,
  generateReport,
  generateReportDownloadProcessingToast,
  getRunCodeForGeneratingReport,
  showLocationsAsDropdownOptions,
  toggleGenerateReportModal,
} from 'modules/physical-inventory/generate-report-modal/act.generate-report-modal';
import { getLocationListDropdownOptions } from 'modules/physical-inventory/generate-report-modal/generate-report-modal.selectors';
import {
  getMultiUserModalBodyText,
  getMultiUserModalTitle,
} from 'modules/physical-inventory/helpers';
import { ThunkAction } from 'types/thunk';

/** generate report modal thunk action */

export const generateReportRunLandingModal = (
  runCode: string,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  dispatch(toggleGenerateReportModal());
  try {
    await dispatch(fetchAllLocationsForAssociatedRunAction(runCode, b2bUnitId));
    const newState = getState();
    const locationListDropdownOptions = getLocationListDropdownOptions(newState);
    await dispatch(showLocationsAsDropdownOptions(locationListDropdownOptions));
    dispatch(getRunCodeForGeneratingReport(runCode));
  } catch (exception) {
    const exceptionErrorsRef = exception.response.data[0];
    const exceptionMessage =
      exceptionErrorsRef && exception.response.data[0].message;

    const multiUserExceptionList = [
      'Location already deleted or doesnt exist!',
      'The location you are trying to copy to has been deleted.',
    ];
    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(element => exceptionMessage.includes(element));

    exceptionType
      ? dispatch(
          openErrorModal(
            getMultiUserModalTitle(exceptionType),
            getMultiUserModalBodyText(exceptionType, ''),
            closeConfirmationModal,
          ),
        )
      : dispatch(openGenericErrorModal());
    throw exception;
  }
};

/** Generate report thunk action */
export const generateReportThunkAction = (
  runCode: string,
  selectedFormatAndType: string,
  selectedLocationCodes: string,
  downloadedfileExt: string,
  downloadedfileName: string,
  downloadedfileType: string,
): ThunkAction => dispatch => {
  try {
    dispatch(generateReportDownloadProcessingToast());
    dispatch(
      generateReport(
        runCode,
        selectedFormatAndType,
        selectedLocationCodes,
        downloadedfileExt,
        downloadedfileName,
        downloadedfileType,
      ),
    );
    dispatch(closeGenerateReportModal());
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};

/** Comparison Generate report thunk action */
export const comparisonGenerateReportThunkAction = (
  selectedFileFormat: string,
  runCode1: string,
  runCode2: string,
  downloadedfileExt: string,
  downloadedfileName: string,
  downloadedfileType: string,
): ThunkAction => dispatch => {
  try {
    dispatch(generateReportDownloadProcessingToast());
    dispatch(
      comparisonGenerateReport(
        selectedFileFormat,
        runCode1,
        runCode2,
        downloadedfileExt,
        downloadedfileName,
        downloadedfileType,
      ),
    );
    dispatch(closeGenerateReportModal());
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};
