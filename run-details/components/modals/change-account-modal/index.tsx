import { ConnectedSearchAndSelectActiveAccount } from 'components/select-active-account-button-and-modal/search-and-select-active-account';
import { Modal } from 'hss_components';
import {
  IFooterConfigMap,
  renderModalHeader,
} from 'modules/physical-inventory/run-details/components/modals/shared';
import {
  changeLocationAccountService,
  hideChangeLocationAccountModal,
  triggerChangeLocationAccountData,
} from 'modules/physical-inventory/run-details/thunk.inventory-run-details';
import React from 'react';
import { connect } from 'react-redux';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IChangeLocationAccount } from 'types/inventory-run-details';

interface IStateProps {
  /**
   * Show Location Account Change Modal
   */
  showChangeLocationAccountModal: boolean;
  /**
   * Initial Selected account for modal
   */
  selectedAccount: IChangeLocationAccount;
}

type IProps = IStateProps & IDispatchProp;

const ChangeLocationAccountModal: React.SFC<IProps> = props => {
  const closeFn = () => {
    props.dispatch(hideChangeLocationAccountModal());
  };

  const confirmFn = () => {
    props.dispatch(changeLocationAccountService(props.selectedAccount));
  };

  const isConfirmButtonDisabled = () => {
    return props.selectedAccount.changedAccount &&
      props.selectedAccount.b2bUnitId !== props.selectedAccount.changedAccount
      ? false
      : true;
  };

  const updateFn = (changedAccount: string) => {
    const updatedAccountData: IChangeLocationAccount = {
      ...props.selectedAccount,
      changedAccount,
    };
    props.dispatch(triggerChangeLocationAccountData(updatedAccountData));
  };

  const selectAccountFooterConfig: IFooterConfigMap = {
    closeFn: () => closeFn(),
    backFn: null,
    confirmFn: () => confirmFn(),
    disableConfirmBtn: isConfirmButtonDisabled(),
    confirmBtnText: 'Select',
    showBackBtn: false,
  };

  return props.showChangeLocationAccountModal ? (
    <Modal
      width={584}
      height={633}
      customHeader={renderModalHeader(
        'Select Account',
        'Select an account to associate with the location.',
        '',
        0,
      )}
      footer={selectAccountFooterConfig}
      isOpen={true}
    >
      <ConnectedSearchAndSelectActiveAccount
        selectedAccount={props.selectedAccount.b2bUnitId}
        updateAction={updateFn}
      />
    </Modal>
  ) : null;
};

// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    showChangeLocationAccountModal:
      state.physicalInventory.inventoryRunDetails.showChangeLocationAccountModal,
    selectedAccount:
      state.physicalInventory.inventoryRunDetails.selectedLocationAccount,
  };
};

/** export Connected Change Location Account Modal Component */
export const ConnectedChangeLocationAccountModal = connect<
  IStateProps,
  IDispatchProp,
  {}
>(mapStateToProps)(ChangeLocationAccountModal);
