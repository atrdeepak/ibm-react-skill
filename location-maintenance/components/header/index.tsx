import { Fonts, PlusButton } from 'hss_components';
import {
  PageSearchFilter,
  PageSelectActiveAccount,
} from 'modules/page-filters/filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { PageFilters } from 'modules/page-filters/page-filter-provider';
import { openCreateLocationModal } from 'modules/physical-inventory/location-maintenance/thunk.location-maintenance';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 40px 0 25px 0;
`;

const TabName = styled(Fonts.Display32)`
  padding-right: 16px;
  border-right: 1px solid ${props => props.theme.colors.grey3};
`;

const StyledPageFilter = styled(PageFilters)`
  justify-content: space-between;
  flex: 1 1 auto;
  margin-left: 16px;
`;

type IProps = IDispatchProp;

/** Inventory Location Maintenance Header  */
const UnconnectedLocationMaintenanceHeader: React.SFC<IProps> = props => {
  const renderPageFilters = () => {
    return (
      <StyledPageFilter pageKey={PageKey.LOCATION_MAINTENANCE}>
        <PageSelectActiveAccount title="Select account to view associated Locations." />
        <PageSearchFilter placeholder="Search Locations..." />
      </StyledPageFilter>
    );
  };
  const handleCreateNewLocation = () => {
    props.dispatch(openCreateLocationModal());
  };

  const renderActions = () => {
    return (
      <PlusButton
        fill
        floating
        onClick={handleCreateNewLocation}
        tooltipText="Create Location"
        showTooltip
        tooltipOffset={{ top: 0 }}
      />
    );
  };
  return (
    <HeaderContainer>
      <TabName>Location Maintenance</TabName>
      {renderPageFilters()}
      {renderActions()}
    </HeaderContainer>
  );
};

/** Export Inventory Locations Maintenance Header  */
export const LocationMaintenanceHeader = connect<{}, IDispatchProp, {}>(null)(
  UnconnectedLocationMaintenanceHeader,
);
