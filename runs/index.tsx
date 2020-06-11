import { InventoryRunsHeader } from 'modules/physical-inventory/runs/components/header';
import { runsTable as InventoryRunsTable } from 'modules/physical-inventory/runs/components/inventory-runs-table';
import React from 'react';
import IDefaultProps from 'types/styled-component-props';

import { InventoryRunModalContainer } from 'modules/physical-inventory/runs/components/modals/inventory-run-modal-container';

/** Inventory Runs Page container */
const InventoryRunsContainer: React.SFC<IDefaultProps> = props => {
  return (
    <>
      <InventoryRunsHeader />
      <InventoryRunsTable />
      <InventoryRunModalContainer />
    </>
  );
};

/** export InventoryRuns Container */
export { InventoryRunsContainer };
