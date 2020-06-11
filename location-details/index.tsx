import { LearnBarcodeFlow } from 'modules/learn-barcode/components/learn-barcode-flow';
import { ConnectedSharedCopyLocationModal } from 'modules/physical-inventory/run-details/components/modals/shared-copy-location-modal';
import React from 'react';
import styled from 'styled-components';
import IDefaultProps from 'types/styled-component-props';
import { ConnectedGenerateReportModal } from '../generate-report-modal/generate-report-modal';
import { InventoryLocationDetailsHeader } from './components/header/location-details-header';
import { ConnectedMultiProductModal } from './components/modals/multiple-product-modal';
import { InventoryLocationDetailsSubHeader } from './components/sub-header/location-details-subheader';
import { LocationDetailsTableHeader } from './components/table/header/index';
import { LocationDetailsTable } from './components/table/inv-location-details-table';

const HeaderContainer = styled.div`
  padding: 40px 0 25px 0;
  margin-left: -20px;
  width: 1216px;
  position: relative;
`;
const GreyLine = styled.hr`
  border-top: 1px solid ${props => props.theme.colors.grey3};
  width: 100%;
  margin-left: 35px;
  margin-top: -2px;
`;

const InventoryLocationDetailsContainer: React.SFC<IDefaultProps> = props => {
  return (
    <>
      <HeaderContainer>
        <InventoryLocationDetailsHeader />
        <ConnectedGenerateReportModal />
        <ConnectedSharedCopyLocationModal />
        <GreyLine />
        <InventoryLocationDetailsSubHeader />
      </HeaderContainer>
      <LocationDetailsTableHeader />
      <LocationDetailsTable />
      <ConnectedMultiProductModal />
      <LearnBarcodeFlow />
    </>
  );
};

/** export InventoryRun Container */
export { InventoryLocationDetailsContainer };
