import { closeConfirmationModal } from 'modules/confirmation-modal/act.confirmation-modal';
import { getDefaultOrSelectedAccount } from 'modules/dashboard/ordering-dashboard.selectors';
import {
  closeErrorModal,
  openErrorModal,
  openGenericErrorModal,
} from 'modules/errors/act.errors';
import { setPageFilterSelectedAccount } from 'modules/page-filters/act.page-filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { getSelectedAccountForPageKey } from 'modules/page-filters/page-filters.selectors';
import {
  getRunCodeForGeneratingReport,
  toggleGenerateReportModal,
} from 'modules/physical-inventory/generate-report-modal/act.generate-report-modal';
import {
  exceptionTypeRun,
  getMultiUserModalBodyText,
  getMultiUserModalTitle,
  isLocationDeletedExceptionForGenerateReport,
  navigateToRunDetailsPage,
} from 'modules/physical-inventory/helpers';
import { fetchSelectedLocationDetailsAction } from 'modules/physical-inventory/location-details/act.inventory-location-details';
import { getInventoryLocationDetails } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import { fetchSelectedRunDetailsAction } from 'modules/physical-inventory/run-details/act.inventory-run-details';
import { ThunkAction } from 'types/thunk';

/** thunk action to render Location deleted modal */
const locationDeletedErrorModalForGenerateReport = (
  selectedRunCode: string,
): ThunkAction => (dispatch, getState) => {
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  const selectedAccountId = getSelectedAccountForPageKey(
    state,
    PageKey.INVENTORY_RUN_DETAILS,
  );
  const selectedAccount = selectedAccountId ? selectedAccountId : b2bUnitId;
  const updateInventoryRunLocations = () => {
    dispatch(closeErrorModal());
    dispatch(fetchSelectedRunDetailsAction(selectedRunCode, selectedAccount));
    navigateToRunDetailsPage(selectedRunCode);
  };
  return dispatch(
    openErrorModal(
      'Location Does Not Exist',
      'This location does not exist. It has been deleted by another user.',
      null,
      {
        confirmBtnText: 'OK',
        confirmFn: updateInventoryRunLocations,
        hideCancelBtn: true,
      },
    ),
  );
};

/** generate report modal thunk action for Run details Page */
export const generateReportLocationDetailsModal = (
  selectedLocationCode: string,
  runCode: string,
): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const b2bUnitId = getDefaultOrSelectedAccount(state);
  const locationDetails = getInventoryLocationDetails(state);
  try {
    await dispatch(
      fetchSelectedLocationDetailsAction(runCode, selectedLocationCode, b2bUnitId),
    );
    dispatch(getRunCodeForGeneratingReport(runCode));
    dispatch(toggleGenerateReportModal());
  } catch (exception) {
    const isExceptionTypeRun = exceptionTypeRun(exception);
    if (isLocationDeletedExceptionForGenerateReport(exception)) {
      dispatch(locationDeletedErrorModalForGenerateReport(runCode));
    } else if (isExceptionTypeRun) {
      if (locationDetails.b2bUnitId) {
        dispatch(
          setPageFilterSelectedAccount(
            PageKey.INVENTORY_RUN,
            locationDetails.b2bUnitId,
          ),
        );
      }
      dispatch(
        openErrorModal(
          getMultiUserModalTitle(isExceptionTypeRun),
          getMultiUserModalBodyText(isExceptionTypeRun, ''),
          closeConfirmationModal,
          null,
          true,
          `/physical-inventory`,
        ),
      );
    } else {
      dispatch(openGenericErrorModal());
    }
    throw exception;
  }
};
