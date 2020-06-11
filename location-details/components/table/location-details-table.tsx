import EmptyState, { EmptyStateIcon } from 'components/empty-state';
import {
  HEADER_USER_BAR_HEIGHT,
  NAVIGATION_BAR_HEIGHT,
} from 'components/global-nav';
import { LoadingSpinnerCentered } from 'components/loading-spinner-centered';
import CheckboxHeaderCell from 'components/sortable-table/custom-tables/plain-table/checkbox-header-cell';
import { Fonts, SortType, TableElements, TableProvider } from 'hss_components';
import { toggleSelectAllProduct } from 'modules/physical-inventory/location-details/act.inventory-location-details';
import {
  getExceptionEntries,
  getInventoryLocationDetails,
  getSelectedProductItemIds,
  getSortedInitialProducts,
} from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import {
  IInventoryLocationDetails,
  ILocationEntry,
} from 'types/inventory-location-details';
import IDefaultProps from 'types/styled-component-props';
import { LocationTableRow } from './location-table-row';
interface IStateProps {
  /**
   *  indicates if loading spinner is on the page
   */
  isLoading?: boolean;
  /**
   * [required] selected inventory location details
   */
  selectedInventoryLocationDetails: IInventoryLocationDetails;

  /**
   * [required] filtered exception Entries
   */
  exceptionInventoryEntries: any[];

  /**
   * [required] View type to toggle the exceptions
   */
  isExceptionsView: boolean;
  allproductSelected: boolean;

  /**
   * [required] all Location Entries
   */
  allLocationEntries: any[];

  /**
   * [required] Sticky Header View
   */
  isMinizedStickyHeaderView: boolean;
}
type IProps = IDefaultProps & IStateProps & IDispatchProp;
const LocationEntriesContainer = styled(Fonts.Body14)`
  width: 100%;
`;
const StyledEmptyState = styled(EmptyState)`
  padding-top: 60px;
  ${Fonts.Link14} {
    font-weight: 500;
  }
`;
const StyledTableProvider = styled(TableProvider)`
  width: 1216px;
`;
const StyledTableHead = styled(TableElements.Head)`
  width: 1218px;
  display: flex;
  margin-left: 15px;
`;
const StyledStickyTableHead = styled(StyledTableHead)`
  position: fixed;
  z-index: 14;
  margin-top: 25px;
  transition: width 2s, height 4s;
  top: ${() => `${NAVIGATION_BAR_HEIGHT + HEADER_USER_BAR_HEIGHT + 15}px`};
  background: ${props => props.theme.colors.grey1};
`;
const StyledHeadCells = styled(TableElements.HeadCell)`
  text-align: center;
  position: relative;
`;
const StyledHeaderCheckBoxContainer = styled.div`
  margin-top: -5px;
  height: 22px;
  margin-left: 6px;
`;
class LocationTableComponent extends React.Component<IProps> {
  sortSchema = {
    entryNumber: SortType.NUMBER,
    name: SortType.STRING,
    abcFormCodeDesc: SortType.STRING,
    abcSellingSize: SortType.PRODUCT_UNITSIZE,
    price: SortType.NUMBER,
    total: SortType.NUMBER,
    quantity: SortType.NUMBER,
  };
  setQuantitySelectorInputRef = () => {
    // TODO Add Functionality when it is needed.
  };
  renderEmptyState = () => {
    return (
      <>
        <StyledEmptyState
          type={EmptyStateIcon.NO_PRODUCTS}
          mainText={
            this.props.selectedInventoryLocationDetails.entries &&
            this.props.selectedInventoryLocationDetails.entries.length
              ? this.props.isExceptionsView
                ? 'No Exceptions'
                : 'No Products'
              : 'This Location is Empty'
          }
          children={
            this.props.selectedInventoryLocationDetails.entries &&
            this.props.selectedInventoryLocationDetails.entries.length
              ? null
              : 'Add products manually above'
          }
        />
      </>
    );
  };
  getFilteredEntries = () => {
    return this.props.isExceptionsView
      ? this.props.exceptionInventoryEntries
      : this.props.allLocationEntries;
  };
  getHeaderViewStyle = () => {
    return !!this.props.isMinizedStickyHeaderView
      ? StyledStickyTableHead
      : StyledTableHead;
  };
  getTablehead = () => {
    const CurrentHeader = this.getHeaderViewStyle();
    return (
      <CurrentHeader>
        <StyledHeadCells width={30}>
          <StyledHeaderCheckBoxContainer>
            <CheckboxHeaderCell
              headerCheckBoxisChecked={this.props.allproductSelected}
              selectAllCheck={this.onChangeProductsSelectAll}
            />
          </StyledHeaderCheckBoxContainer>
        </StyledHeadCells>
        <StyledHeadCells width={100} id="entryNumber">
          Seq.
        </StyledHeadCells>
        <StyledHeadCells width={350} id="name">
          Description
        </StyledHeadCells>
        <StyledHeadCells width={150} id="abcFormCodeDesc">
          Form
        </StyledHeadCells>
        <StyledHeadCells width={150} id="abcSellingSize">
          Unit Size
        </StyledHeadCells>
        <StyledHeadCells width={150} id="price">
          Acq. Cost
        </StyledHeadCells>
        <StyledHeadCells width={150} id="total">
          Ext. Cost
        </StyledHeadCells>
        <StyledHeadCells width={150} id="quantity">
          Quantity
        </StyledHeadCells>
      </CurrentHeader>
    );
  };
  onChangeProductsSelectAll = () => {
    this.props.dispatch(toggleSelectAllProduct());
  };
  renderTable = () => {
    const entries = this.getFilteredEntries();
    return (
      <>
        <StyledTableProvider
          data={entries || []}
          sortedColumns={[{ id: 'entryNumber', desc: false }]}
          sortSchema={this.sortSchema}
          highlightSelected={true}
        >
          {this.getTablehead()}
          <TableElements.RowGroup>
            {entries && entries.length
              ? ({ sortedData }: { sortedData: ILocationEntry[] }) =>
                  sortedData.map((entry, index) => this.getRow(entry))
              : null}
          </TableElements.RowGroup>
        </StyledTableProvider>
      </>
    );
  };

  getRow = (entry: ILocationEntry) => {
    return <LocationTableRow entry={entry} />;
  };
  render() {
    return this.props.isLoading ? (
      <LoadingSpinnerCentered />
    ) : (
      <div>
        <LocationEntriesContainer>
          {this.getFilteredEntries() && this.getFilteredEntries().length === 0
            ? this.renderEmptyState()
            : this.renderTable()}
        </LocationEntriesContainer>
      </div>
    );
  }
}
const mapStateToProps = (state: IGlobalState): IStateProps => {
  const selectedInventoryLocationDetails = getInventoryLocationDetails(state);
  const allproductSelected =
    selectedInventoryLocationDetails.entries &&
    selectedInventoryLocationDetails.entries.length !== 0 &&
    selectedInventoryLocationDetails.entries.length ===
      getSelectedProductItemIds(state).length;
  return {
    isLoading: state.physicalInventory.inventoryLocationDetails.isLoading,
    selectedInventoryLocationDetails,
    exceptionInventoryEntries: getExceptionEntries(state),
    isExceptionsView:
      state.physicalInventory.inventoryLocationDetails.isExceptionsView,
    allproductSelected,
    allLocationEntries: getSortedInitialProducts(state),
    isMinizedStickyHeaderView:
      state.physicalInventory.inventoryLocationDetails.isMinimized,
  };
};
const LocationDetailsTable = connect<IStateProps, IDispatchProp>(mapStateToProps)(
  LocationTableComponent,
);

/** export location Details Table Component */
export { LocationDetailsTable };
