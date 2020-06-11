import { LocationMaintenanceHeader } from 'modules/physical-inventory/location-maintenance/components/header';
import { LocationMaintenanceTable } from 'modules/physical-inventory/location-maintenance/components/locations-table';
import { CreateLocationModal } from 'modules/physical-inventory/location-maintenance/create-location-modal';
import React from 'react';
import Styled from 'styled-components';
import IDefaultProps from 'types/styled-component-props';

const InventoryLocationsContainer = Styled.div`
  width: 1184px;
`;

/** Location Maintenance Page container */
export const LocationMaitenanceContainer: React.SFC<IDefaultProps> = props => {
  return (
    <InventoryLocationsContainer>
      <LocationMaintenanceHeader />
      <LocationMaintenanceTable />
      <CreateLocationModal />
    </InventoryLocationsContainer>
  );
};
