import {
  closeConfirmationModal,
  openConfirmationModal,
} from 'modules/confirmation-modal/act.confirmation-modal';
import { getDefaultOrSelectedAccount } from 'modules/dashboard/ordering-dashboard.selectors';
import { getEditableAccountUidsFromSelectedFacility } from 'modules/entities/selectors/accounts.selectors';
import { openErrorModal, openGenericErrorModal } from 'modules/errors/act.errors';
import { isANSIx12CompliantAnyLength } from 'modules/forms/validators';
import {
  hideGlobalLoadingSpinner,
  showGlobalLoadingSpinner,
} from 'modules/loading-spinner/act.loading-spinner';
import {
  setPageFilterSelectedAccount,
  setPageFiltersForPageKey,
} from 'modules/page-filters/act.page-filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { getSelectedAccountForPageKey } from 'modules/page-filters/page-filters.selectors';
import { IPageFilters } from 'modules/page-filters/rdc.page-filters';
import { generateReportRunLandingModal } from 'modules/physical-inventory/generate-report-modal/thunk.runs-landing-report-modal';
import { navigateToRunDetailsPage } from 'modules/physical-inventory/helpers';
import {
  checkProductCountForRun,
  closeInventoryRunImportModal,
  createNewRun,
  deleteRun,
  fetchInitialRuns,
  fileImportProcessingToast,
  getPIImportExportFormatsAction,
  openInventoryRunImportModal,
  refreshRunAcquisitionCost,
  selectedNewRunAccount,
  setRunsDateAction,
  submitInventoryRunileUploadInternal,
  toggleCreateRunModal,
  triggerAddDeleteRunSuccessToast,
  triggerRefreshAcquisitionCostSuccessToast,
  updateRunNameText,
} from 'modules/physical-inventory/runs/act.inventory-runs';
import { getSelectedAccountForCreateRunModal } from 'modules/physical-inventory/runs/inventory-runs.selectors';
import { IInventoryRuns } from 'types/inventory-runs';
import { ThunkAction } from 'types/thunk';

/** Open Create Run Error  modal  */
export const openCreateRunErrorModal = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  dispatch(openGenericErrorModal(null, 'Unavailable to Create new run !!'));
};

/** Fetch Runs for default account on page load */
export const fetchRuns = (): ThunkAction => (dispatch, getState) => {
  const state = getState();
  const pageFilters: IPageFilters = {
    resetFiltersOnNavigation: true,
    searchTerm: '',
  };
  dispatch(setPageFiltersForPageKey(PageKey.INVENTORY_RUN, pageFilters));
  const selectedAccount = getSelectedAccountForPageKey(state, PageKey.INVENTORY_RUN);
  if (selectedAccount) {
    dispatch(fetchInitialRuns(selectedAccount));
  } else {
    const b2bUnitId = getDefaultOrSelectedAccount(state);
    dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, b2bUnitId));
    dispatch(fetchInitialRuns(b2bUnitId));
  }
};

/** Create New Run */
export const createRun = (runName: string): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const b2bUnitId = getSelectedAccountForCreateRunModal(state);
  try {
    dispatch(showOrHideCreateRunModal());
    dispatch(showGlobalLoadingSpinner());
    await dispatch(createNewRun(b2bUnitId, runName));
    dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN, b2bUnitId));
    dispatch(setPageFilterSelectedAccount(PageKey.INVENTORY_RUN_DETAILS, b2bUnitId));
  } catch (exception) {
    dispatch(openCreateRunErrorModal());
    throw exception;
  } finally {
    dispatch(hideGlobalLoadingSpinner());
  }
};

/** Redirect to run details page */
export const redirectToRunDetailsPage = (
  runCode: string,
): ThunkAction => async () => {
  navigateToRunDetailsPage(runCode);
};

/** Fetch Runs on account changed */
export const fetchRunsOnAccountChanged = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const selectedAccount = getSelectedAccountForPageKey(state, PageKey.INVENTORY_RUN);
  dispatch(
    setPageFilterSelectedAccount(PageKey.INVENTORY_RUN_DETAILS, selectedAccount),
  );
  dispatch(fetchInitialRuns(selectedAccount));
};

/** Show or Hide Create Run Modal */
export const showOrHideCreateRunModal = (): ThunkAction => async dispatch => {
  dispatch(toggleCreateRunModal());
};

/** Update Create run text  */
export const updateCreateRunNameText = (
  runName: string,
): ThunkAction => async dispatch => {
  dispatch(updateRunNameText(runName, !isANSIx12CompliantAnyLength(runName)));
};

/** Update Selected New Run Account  */
export const updateSelectedNewRunAccount = (
  changedAccount: string,
): ThunkAction => async dispatch => {
  dispatch(selectedNewRunAccount(changedAccount));
};

/** set Runs Date Chnages */
export const setRunsDateThunk = (date: Date, runCode: string): ThunkAction => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const b2bUnitId = getDefaultOrSelectedAccount(state);
    dispatch(setRunsDateAction(date, runCode, b2bUnitId));
  } catch (exception) {
    dispatch(openGenericErrorModal());
    throw exception;
  }
};
/** Delete Run Thunk Action */
const deleteInventoryRun = (
  runData: IInventoryRuns,
): ThunkAction => async dispatch => {
  dispatch(closeConfirmationModal());
  try {
    const res: any = await dispatch(deleteRun(runData.b2bUnitId, runData.code));
    const responseType = res && res.payload && res.payload.type;
    if (responseType === 'Success') {
      // for create success toast delete run message)
      dispatch(triggerAddDeleteRunSuccessToast(runData.name));
    }
  } catch (exception) {
    const exceptionErrorsRef = exception.response.errors;
    const exceptionMessage = exceptionErrorsRef && exceptionErrorsRef[0].type;
    const multiUserDeleteExceptionList = ['RunDeletedError'];

    const exceptionType =
      exceptionMessage &&
      multiUserDeleteExceptionList.find(e => exceptionMessage.includes(e));
    const title: string = 'Run Does Not Exist';
    const content: string = `${runData.name} does not exist. It has been deleted by another user.`;
    exceptionType
      ? dispatch(openErrorModal(title, content, closeConfirmationModal))
      : dispatch(openGenericErrorModal());
    throw exception;
  }
};

/** Confirm Delete Run Confirmation modal thunk action */
export const confirmDeleteRun = (
  runData: IInventoryRuns,
): ThunkAction => dispatch => {
  dispatch(
    openConfirmationModal({
      title: 'Delete Run',
      body: 'Are you sure you want to delete this run ?',
      confirmAction: deleteInventoryRun(runData),
      confirmButtonLabel: 'Delete',
      hideCancelBtn: false,
      cancelButtonLabel: 'Cancel',
      cancelAction: closeConfirmationModal(),
    }),
  );
};

/** Refresh Acquisition Cost Thunk Action */
const refreshAcquisitionCostForRun = (
  runData: IInventoryRuns,
): ThunkAction => async dispatch => {
  dispatch(closeConfirmationModal());
  try {
    await dispatch(refreshRunAcquisitionCost(runData));
    dispatch(triggerRefreshAcquisitionCostSuccessToast(runData.name));
  } catch (exception) {
    const title: string = 'Run Does Not Exist';
    const content: string = `This run does not exist. It has been deleted by another user.`;
    dispatch(openErrorModal(title, content, closeConfirmationModal));
    throw exception;
  }
};

/** Refresh Acquisition cost Confirmation modal Thunk Action */
export const confirmRunRefreshAcquisitionCost = (
  runData: IInventoryRuns,
): ThunkAction => async dispatch => {
  try {
    dispatch(showGlobalLoadingSpinner());
    const productCountCheck = await dispatch(
      checkProductCountForRun(runData.b2bUnitId, runData.code),
    );
    dispatch(hideGlobalLoadingSpinner());
    productCountCheck.payload
      ? dispatch(
          openConfirmationModal({
            title: 'Refresh Acquisition Cost',
            body:
              'Are you sure you want to refresh the acquisition cost(s) in this run? This will also reset any manually entered values.',
            confirmAction: refreshAcquisitionCostForRun(runData),
            confirmButtonLabel: 'Refresh',
            hideCancelBtn: false,
            cancelButtonLabel: 'Cancel',
            cancelAction: closeConfirmationModal(),
          }),
        )
      : dispatch(
          openConfirmationModal({
            title: 'Refresh Acquisition Cost',
            body:
              'Cannot refresh acquisition cost because there are no locations or products associated with this run.',
            confirmAction: closeConfirmationModal(),
            confirmButtonLabel: 'OK',
            hideCancelBtn: true,
          }),
        );
  } catch (exception) {
    dispatch(hideGlobalLoadingSpinner());
    dispatch(openGenericErrorModal());
  }
};

/** Confirm Run Generate Report modal Thunk Action */
export const confirmRunGenerateReportModal = (
  runData: IInventoryRuns,
): ThunkAction => async dispatch => {
  try {
    dispatch(showGlobalLoadingSpinner());
    const productCountCheck = await dispatch(
      checkProductCountForRun(runData.b2bUnitId, runData.code),
    );
    dispatch(hideGlobalLoadingSpinner());
    productCountCheck.payload
      ? dispatch(generateReportRunLandingModal(runData.code))
      : dispatch(
          openConfirmationModal({
            title: 'Generate Reports',
            body:
              'Cannot generate reports because there are no locations or products associated with this run.',
            confirmAction: closeConfirmationModal(),
            confirmButtonLabel: 'OK',
            hideCancelBtn: true,
          }),
        );
  } catch (exception) {
    dispatch(hideGlobalLoadingSpinner());
    dispatch(openGenericErrorModal());
  }
};

/** Opens Inventory Run Import error modal  */
const openInventoryRunImportErrorModal = (): ThunkAction => async (
  dispatch,
  getState,
) => {
  dispatch(openGenericErrorModal(null, ' Import File Unavailable'));
};

/** This action initiates the Inventory Run import process and triggers a toast to indicate the process has begun */
export const uploadInventoryRunFile = (formData: {
  file: File;
  uploadType: string;
  headerIncluded: boolean;
}): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const selectedAccountId = getEditableAccountUidsFromSelectedFacility(state)[0];
  const importFormatId = state.physicalInventory.inventoryRuns.selectedFileFormat;
  const uploadFormData: FormData = new FormData();
  uploadFormData.append('file', formData.file);
  dispatch(closeInventoryRunImportModal());
  dispatch(fileImportProcessingToast());
  try {
    await dispatch(
      submitInventoryRunileUploadInternal(
        uploadFormData,
        selectedAccountId,
        formData.uploadType,
        formData.headerIncluded.toString(),
        importFormatId,
      ),
    );
    dispatch({ type: 'START_NOTIFICATION_POLLING_PHYSICALINVENTORY' });
  } catch (exception) {
    dispatch(openInventoryRunImportErrorModal());
    throw exception;
  }
};

/** Open Run Import Modal  */
export const openRunImportModal = (): ThunkAction => async (dispatch, getState) => {
  const state = getState();
  const selectedAccountId = getSelectedAccountForPageKey(
    state,
    PageKey.INVENTORY_RUN,
  );
  try {
    dispatch(showGlobalLoadingSpinner());
    await dispatch(
      getPIImportExportFormatsAction(
        selectedAccountId,
        'import',
        'PHYSICALINVENTORY',
      ),
    );
    dispatch(openInventoryRunImportModal());
  } catch (exception) {
    dispatch(openInventoryRunImportErrorModal());
    throw exception;
  } finally {
    dispatch(hideGlobalLoadingSpinner());
  }
};
