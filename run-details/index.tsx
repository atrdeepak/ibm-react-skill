import { ConnectedGenerateReportModal } from 'modules/physical-inventory/generate-report-modal/generate-report-modal';
import { CreateLocationModal } from 'modules/physical-inventory/location-maintenance/create-location-modal';
import { runDetailsTable as InventoryRunDetailsTable } from 'modules/physical-inventory/run-details/components/inventory-run-details-table';
import { InventoryRunDetailsHeader } from 'modules/physical-inventory/run-details/components/run-details-header';
import React from 'react';
import IDefaultProps from 'types/styled-component-props';
import { ConnectedAddExistingLocationsModal } from './components/modals/add-existing-locations-modal';
import { ConnectedChangeLocationAccountModal } from './components/modals/change-account-modal';
import { ConnectedSharedCopyLocationModal } from './components/modals/shared-copy-location-modal';

/** Inventory Run Details Page container */
const InventoryRunDetailsContainer: React.SFC<IDefaultProps> = props => {
  return (
    <>
      <InventoryRunDetailsHeader />
      <InventoryRunDetailsTable />
      <ConnectedSharedCopyLocationModal />
      <ConnectedGenerateReportModal />
      <ConnectedChangeLocationAccountModal />
      <ConnectedAddExistingLocationsModal />
      <CreateLocationModal addNewLocationToRun />
    </>
  );
};

/** export InventoryRun Container */
export { InventoryRunDetailsContainer };
