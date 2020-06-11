import { ConnectedSearchAndSelectActiveAccount } from 'components/select-active-account-button-and-modal/search-and-select-active-account';
import { colors, Fonts, FormTextInput, Modal } from 'hss_components';
import { validationMsgFn } from 'modules/physical-inventory/helpers';
import { getSelectedAccount } from 'modules/physical-inventory/runs/inventory-runs.selectors';
import {
  createRun,
  showOrHideCreateRunModal,
  updateCreateRunNameText,
  updateSelectedNewRunAccount,
} from 'modules/physical-inventory/runs/thunk.inventory-runs';
import { IFooterConfigMap } from 'modules/settings/departments/components/create-departments-modal/shared';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';

/** Style for create run modal header */
const HeaderContainer = styled.div`
  display: flex;
  padding: 24px 29px 16px 24px;
`;

/** Input field for create runs modal */
const InputField = styled(FormTextInput)`
  width: 360px;
`;
/** Styled Require Text Container */
const StyledRequireContainer = styled.div`
  margin-top: 16px;
  padding-bottom: 15px;
`;
const ErrorContainer = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.red};
  margin-bottom: -10px;
`;
interface IStateProps {
  /**
   * Show Create Run modal
   */
  showCreateRunModal: boolean;
  /**
   * Initial Selected account for modal
   */
  selectedAccount: string;
  /**
   * Initial Run Name Text
   */
  runNameText: string;
  /**
   * Enable or Disable Button in the Modal
   */
  enableCreateButton: boolean;
  /**
   * [optional] show hide error message
   */
  showSearchTextErrorMsg: boolean;
}

type IProps = IStateProps & IDispatchProp;

const CreateRunModal: React.SFC<IProps> = props => {
  const closeFn = () => {
    props.dispatch(showOrHideCreateRunModal());
  };
  const confirmCreateRunFn = () => {
    props.dispatch(createRun(props.runNameText));
  };

  const renderModalHeader = (title: string) => (
    <HeaderContainer>
      <Fonts.Display32 color={colors.grey6}>{title}</Fonts.Display32>
    </HeaderContainer>
  );

  const renderModalFooter: IFooterConfigMap = {
    closeFn: () => closeFn(),
    backFn: null,
    confirmFn: () => confirmCreateRunFn(),
    disableConfirmBtn: !props.enableCreateButton,
    confirmBtnText: 'Create',
    showBackBtn: false,
  };

  const updateOnInputTextChange = (searchText: string) => {
    props.dispatch(updateCreateRunNameText(searchText));
  };

  const toggleSearchTextErrorMsg = () => {
    return props.showSearchTextErrorMsg ? (
      <ErrorContainer> {validationMsgFn()} </ErrorContainer>
    ) : null;
  };

  const renderInputText = () => {
    return (
      <>
        <Fonts.Body12>Run Name*</Fonts.Body12>
        <Fonts.Body16>
          <InputField
            type="text"
            placeholder="Enter a Run name"
            maxLength={20}
            autoFocus={true}
            saveOnKeyStroke={true}
            saveValue={updateOnInputTextChange}
            styleAsError={props.showSearchTextErrorMsg}
          />
        </Fonts.Body16>
        {toggleSearchTextErrorMsg()}
        <StyledRequireContainer>
          <Fonts.Body11Macro>* REQUIRED FIELDS</Fonts.Body11Macro>
        </StyledRequireContainer>
      </>
    );
  };
  const updateSelectedAccount = (changedAccount: string) => {
    props.dispatch(updateSelectedNewRunAccount(changedAccount));
  };

  const renderSearchAndAccountSelection = () => {
    return (
      <ConnectedSearchAndSelectActiveAccount
        selectedAccount={props.selectedAccount}
        updateAction={updateSelectedAccount}
      />
    );
  };
  return props.showCreateRunModal ? (
    <Modal
      width={684}
      height={635}
      customHeader={renderModalHeader('Create New Run')}
      footer={renderModalFooter}
      isOpen={true}
      contentLabel="Create Run"
    >
      {renderInputText()}
      {renderSearchAndAccountSelection()}
    </Modal>
  ) : null;
};

// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    showCreateRunModal: state.physicalInventory.inventoryRuns.showCreateRunModal,
    runNameText: state.physicalInventory.inventoryRuns.runNameText,
    selectedAccount: getSelectedAccount(state),
    enableCreateButton: state.physicalInventory.inventoryRuns.enableCreateButton,
    showSearchTextErrorMsg: state.physicalInventory.inventoryRuns.toggleErrorMessage,
  };
};

/** export Create Runs Modal Component */
export const ConnectedCreateRunModal = connect<IStateProps, IDispatchProp, {}>(
  mapStateToProps,
)(CreateRunModal);
