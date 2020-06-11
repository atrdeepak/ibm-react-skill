import { ConnectedSearchAndSelectActiveAccount } from 'components/select-active-account-button-and-modal/search-and-select-active-account';
import { setlocationB2bUnitId } from 'modules/physical-inventory/location-maintenance/act.location-maintenance';
import React from 'react';
import { connect } from 'react-redux';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';

interface IStateProps {
  /**
   * Selected account for modal
   */
  selectedB2bUnitId: string;
}

type IProps = IStateProps & IDispatchProp;

const UnConnectedAccountDetails: React.SFC<IProps> = props => {
  const updateSelectedAccount = (changedAccount: string) => {
    props.dispatch(setlocationB2bUnitId(changedAccount));
  };

  return (
    <ConnectedSearchAndSelectActiveAccount
      selectedAccount={props.selectedB2bUnitId}
      updateAction={updateSelectedAccount}
    />
  );
};

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    selectedB2bUnitId:
      state.physicalInventory.locationMaintenance.createLocationReq.b2bUnitId,
  };
};

/** export Connected Search And Select Active Account Component */
export const SearchAndSelectAccount = connect<IStateProps, IDispatchProp, {}>(
  mapStateToProps,
)(UnConnectedAccountDetails);
