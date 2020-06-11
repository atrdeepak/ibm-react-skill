import {
  HEADER_USER_BAR_HEIGHT,
  NAVIGATION_BAR_HEIGHT,
} from 'components/global-nav';
import CheckboxHeaderCell from 'components/sortable-table/custom-tables/plain-table/checkbox-header-cell';
import { Fonts } from 'hss_components';
import {
  setLocationDetailsSortOptions,
  toggleSelectAllProduct,
} from 'modules/physical-inventory/location-details/act.inventory-location-details';
import { ListHeadCell } from 'modules/physical-inventory/location-details/components/table/header/cells/head-cell';
import { areAllProductsSelected } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';

interface IStateProps {
  /**
   * Currently selected option in Sort By dropdown
   */
  sortId: string;

  /**
   * True if Sort items in descending order.
   * This means arranging from the highest value to the lowest (e.g. z-a, 9-0).
   */
  isSortDesc: boolean;

  /**
   * True if all the check boxes are checked
   */
  allproductSelected: boolean;

  /**
   * Sticky Header View
   */
  isMinified: boolean;
}

const TableHeaderContainer = styled.div`
  height: 32px;
  display: flex;
  margin-left: 15px;
  border-top: 1px solid ${props => props.theme.colors.grey3};
  border-bottom: 1px solid ${props => props.theme.colors.grey3};
  position: ${(props: { isMinified: boolean }) => (props.isMinified ? 'fixed' : '')};
  top: ${() => `${NAVIGATION_BAR_HEIGHT + HEADER_USER_BAR_HEIGHT + 67}px`};
  z-index: 1;
  width: 1216px;
`;

const Label = styled(Fonts.Body12)`
  padding-left: 16px;
`;

const StyledHeaderCheckBoxContainer = styled(CheckboxHeaderCell)`
  margin-left: 28px;
`;

type IProps = IStateProps & IDispatchProp;

const InvLocationDetailsTableHeader: React.SFC<IProps> = ({
  sortId,
  isSortDesc,
  ...props
}) => {
  const onTableHeaderClick = (sortIdVal: string, isSortDescVal: boolean) => {
    props.dispatch(setLocationDetailsSortOptions(sortIdVal, isSortDescVal));
  };
  const onChangeProductsSelectAll = () => {
    props.dispatch(toggleSelectAllProduct());
  };
  return (
    <TableHeaderContainer isMinified={props.isMinified}>
      <ListHeadCell width="50" id="selectAllCheckBox">
        <StyledHeaderCheckBoxContainer
          headerCheckBoxisChecked={props.allproductSelected}
          selectAllCheck={onChangeProductsSelectAll}
        />
      </ListHeadCell>
      <ListHeadCell
        width="100"
        id="entryNumber"
        sortId={sortId}
        isSortDesc={isSortDesc}
        onClick={onTableHeaderClick}
      >
        <Label> Seq. </Label>
      </ListHeadCell>
      <ListHeadCell
        width="350"
        id="name"
        sortId={sortId}
        isSortDesc={isSortDesc}
        onClick={onTableHeaderClick}
      >
        <Label> Description </Label>
      </ListHeadCell>
      <ListHeadCell
        width="150"
        id="abcFormCodeDesc"
        sortId={sortId}
        isSortDesc={isSortDesc}
        onClick={onTableHeaderClick}
      >
        <Label> Form </Label>
      </ListHeadCell>
      <ListHeadCell
        width="150"
        id="abcSellingSize"
        sortId={sortId}
        isSortDesc={isSortDesc}
        onClick={onTableHeaderClick}
      >
        <Label> Unit Size </Label>
      </ListHeadCell>
      <ListHeadCell
        width="150"
        id="price"
        sortId={sortId}
        isSortDesc={isSortDesc}
        onClick={onTableHeaderClick}
      >
        <Label> Acq. Cost </Label>
      </ListHeadCell>
      <ListHeadCell
        width="150"
        id="total"
        sortId={sortId}
        isSortDesc={isSortDesc}
        onClick={onTableHeaderClick}
      >
        <Label> Ext. Cost </Label>
      </ListHeadCell>
      <ListHeadCell
        width="150"
        id="quantity"
        sortId={sortId}
        isSortDesc={isSortDesc}
        onClick={onTableHeaderClick}
      >
        <Label> Quantity </Label>
      </ListHeadCell>
    </TableHeaderContainer>
  );
};

const mapStateToProps = (state: IGlobalState): IStateProps => ({
  sortId: state.physicalInventory.inventoryLocationDetails.sortId,
  isSortDesc: state.physicalInventory.inventoryLocationDetails.isSortDesc,
  allproductSelected: areAllProductsSelected(state),
  isMinified: state.physicalInventory.inventoryLocationDetails.isMinimized,
});

/** Table Header with column headings and sort functions  */
export const LocationDetailsTableHeader = connect<IStateProps, IDispatchProp>(
  mapStateToProps,
)(InvLocationDetailsTableHeader);
