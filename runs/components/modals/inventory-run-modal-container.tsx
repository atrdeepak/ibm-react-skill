import { ConnectedGenerateReportModal } from 'modules/physical-inventory/generate-report-modal/generate-report-modal';
import { ConnectedCreateRunModal } from 'modules/physical-inventory/runs/components/modals/inventory-create-run-modal';
import InventoryRunImportModal from 'modules/physical-inventory/runs/components/modals/inventory-run-import-modal';
import React from 'react';
import { connect } from 'react-redux';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';

interface IStateProps {
  /**
   * is Generate Report Modal open
   */
  showGenerateReportModal?: boolean;
  /**
   * is create run Modal open
   */
  showCreateRunModal?: boolean;
  /**
   * is Import run Modal open
   */
  showImportRunModal?: boolean;
}

type IProps = IStateProps & IDispatchProp;

/** Unconnected Inventory Run Modal Container */
const UnconnectedInventoryRunModalContainer: React.SFC<IProps> = props => {
  return (
    <>
      {props.showImportRunModal && <InventoryRunImportModal />}
      {props.showCreateRunModal && <ConnectedCreateRunModal />}
      {props.showGenerateReportModal && <ConnectedGenerateReportModal />}
    </>
  );
};

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    showGenerateReportModal: state.physicalInventory.generateReportModal.isOpen,
    showCreateRunModal: state.physicalInventory.inventoryRuns.showCreateRunModal,
    showImportRunModal: state.physicalInventory.inventoryRuns.isImportModalOpen,
  };
};

/** Inventory Run Modal Index */
export const InventoryRunModalContainer = connect<IStateProps, IDispatchProp, {}>(
  mapStateToProps,
)(UnconnectedInventoryRunModalContainer);
