import { closeConfirmationModal } from 'modules/confirmation-modal/act.confirmation-modal';
import { getDefaultOrSelectedAccount } from 'modules/dashboard/ordering-dashboard.selectors';
import { openErrorModal, openGenericErrorModal } from 'modules/errors/act.errors';
import {
  fetchAllLocationsForAssociatedRunAction,
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

/** generate report modal thunk action for Run details Page */
export const generateReportRunDetailsModal = (
  runCode: string,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  try {
    await dispatch(fetchAllLocationsForAssociatedRunAction(runCode, b2bUnitId));

    const newState = getState();
    const locationListDropdownOptions = getLocationListDropdownOptions(newState);
    await dispatch(showLocationsAsDropdownOptions(locationListDropdownOptions));
    dispatch(getRunCodeForGeneratingReport(runCode));
    dispatch(toggleGenerateReportModal());
  } catch (exception) {
    const exceptionErrorsRef = exception.response.data[0];
    const exceptionMessage =
      exceptionErrorsRef && exception.response.data[0].runMessage;
    const multiUserExceptionList = [
      'The run you are trying to edit has been deleted',
    ];
    const exceptionType: any =
      exceptionMessage &&
      multiUserExceptionList.find(e => exceptionMessage.includes(e));

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
