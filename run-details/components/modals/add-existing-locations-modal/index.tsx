import EmptyState, { EmptyStateIcon } from 'components/empty-state';
import CheckboxHeaderCell from 'components/sortable-table/custom-tables/plain-table/checkbox-header-cell';
import TableLoadingSpinner from 'components/sortable-table/custom-tables/plain-table/table-loading-spinner';
import { Checkbox, Modal, TableElements, TableProvider } from 'hss_components';
import { setPageFilterSearchTerm } from 'modules/page-filters/act.page-filters';
import { PageSearchFilter } from 'modules/page-filters/filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { PageFilters } from 'modules/page-filters/page-filter-provider';
import { toggleAddExistingLocationsModal } from 'modules/physical-inventory/run-details/act.inventory-run-details';
import { IFooterConfigMap } from 'modules/physical-inventory/run-details/components/modals/shared';
import { getSearchedInventoryLocations } from 'modules/physical-inventory/run-details/inventory-run-details.selectors';
import {
  addExistingLocationsToRun,
  selectAllLocationsCheckbox,
  updateSelectedLocations,
} from 'modules/physical-inventory/run-details/thunk.inventory-run-details';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { ILocations } from 'types/inventory-run-details';

interface IStateProps {
  /**
   * Show and Hide the Add Existing locations Modal
   */
  isAddExistingLocationsModalOpen: boolean;
  /**
   * Filtered and serached locations
   */
  locations: ILocations[];
  /**
   * whether locations inside the modal are loading
   */
  isLoading: boolean;
  /**
   * selected Locations in Modal
   */
  selectedLocationIds: string[];
  /**
   * Whether all Locations Selected
   */
  selectAllCheckboxChecked: boolean;
}

type IProps = IStateProps & IDispatchProp;

const SubHeading = styled.div`
  padding: 0 0 21px 0;
`;
const ModalBodyContainer = styled.div``;
const StyledTableRowGroup = styled(TableElements.RowGroup)`
  display: block;
  overflow-y: auto;
  height: 340px;
  width: 100%;
`;
const StyledTableProvider = styled(TableProvider)`
  width: 100%;
`;
const StyledTableHead = styled(TableElements.Head)`
  display: block;
  width: 100%;
  height: 39px;
  margin: 16px 0 7px 0;
  border-top: 1px solid ${props => props.theme.colors.grey3};
  border-bottom: 1px solid ${props => props.theme.colors.grey3};
`;
const StyledHeadCells = styled(TableElements.HeadCell)`
  display: inline-block;
  div[class*='cell__Spacer'] {
    display: none;
  }
  padding-right: 6px;
`;
const StyledTableRow = styled(TableElements.Row)`
  width: 100%;
`;
const StyledRowCells = styled(TableElements.Cell)`
  font-size: 16px;
  padding-right: 0;
`;
const StyledCheckbox = styled(Checkbox)``;
const StyledPageFilter = styled(PageFilters)`
  display: block;
  margin: 0;
  div[class*='page-search'] > div {
    width: 100% !important;
  }
`;
const StyledEmptyState = styled(EmptyState)`
  width: 100%;
  margin-top: 15%;
`;
const StyledSpinner = styled(TableLoadingSpinner)`
  margin-top: 150px;
`;

class AddExistingLocationsModal extends React.Component<IProps> {
  renderLoadingSpinner = () => <StyledSpinner />;

  renderEmptyState = () => {
    return (
      <StyledEmptyState
        mainText="No Locations"
        type={EmptyStateIcon.NO_SEARCH_RESULTS}
      />
    );
  };

  closeFn = () => {
    this.props.dispatch(setPageFilterSearchTerm(PageKey.INVENTORY_RUN_DETAILS, ''));
    this.props.dispatch(toggleAddExistingLocationsModal());
  };

  handleAddButton = () => {
    this.props.dispatch(addExistingLocationsToRun());
  };

  handleLocationSelectCheckbox = (selectedLocCode: string) =>
    this.props.dispatch(updateSelectedLocations(selectedLocCode));

  handleSelectAllLocationCheckbox = () =>
    this.props.dispatch(selectAllLocationsCheckbox());

  getRow = (d: ILocations, index: number) => {
    const checkedState = !!this.props.selectedLocationIds.find(id => id === d.code);
    return (
      <StyledTableRow key={index}>
        <StyledRowCells width={15}>
          <StyledCheckbox
            checked={checkedState}
            onChange={() => this.handleLocationSelectCheckbox(d.code)}
            id={d.code}
          />
        </StyledRowCells>
        <StyledRowCells width={200}>{d.name}</StyledRowCells>
        <StyledRowCells width={200}>{d.unitOfMeasure}</StyledRowCells>
      </StyledTableRow>
    );
  };

  renderModalBody = () => {
    return (
      <ModalBodyContainer>
        <StyledPageFilter pageKey={PageKey.INVENTORY_RUN_DETAILS}>
          <PageSearchFilter isSearchActive={true} placeholder="Search Locations" />
        </StyledPageFilter>
        <StyledTableProvider
          data={this.props.locations || []}
          sortedColumns={[]}
          sortSchema={{}}
          highlightSelected={true}
        >
          <StyledTableHead>
            <StyledHeadCells width={15} id="locationCheckbox" hideSortCarat>
              <CheckboxHeaderCell
                headerCheckBoxisChecked={this.props.selectAllCheckboxChecked}
                selectAllCheck={() => this.handleSelectAllLocationCheckbox()}
              />
            </StyledHeadCells>
            <StyledHeadCells width={200} id="location" hideSortCarat>
              Location
            </StyledHeadCells>
            <StyledHeadCells width={200} id="uom" hideSortCarat>
              Unit of Measure
            </StyledHeadCells>
          </StyledTableHead>
          {this.props.isLoading ? (
            this.renderLoadingSpinner()
          ) : this.props.locations.length > 0 ? (
            <StyledTableRowGroup>
              {({ sortedData }: { sortedData: ILocations[] }) =>
                sortedData.map((d, index) => this.getRow(d, index))
              }
            </StyledTableRowGroup>
          ) : (
            this.renderEmptyState()
          )}
        </StyledTableProvider>
      </ModalBodyContainer>
    );
  };
  render() {
    const disableAddBtn = () => {
      return this.props.selectedLocationIds && this.props.selectedLocationIds.length
        ? false
        : true;
    };
    const addExistingLocsFooterConfig: IFooterConfigMap = {
      closeFn: () => this.closeFn(),
      backFn: null,
      confirmFn: () => this.handleAddButton(),
      disableConfirmBtn: disableAddBtn(),
      confirmBtnText: 'Add',
      showBackBtn: false,
    };
    return (
      this.props.isAddExistingLocationsModalOpen && (
        <Modal
          width={584}
          height={634}
          isOpen={this.props.isAddExistingLocationsModalOpen}
          title={'Add Existing Locations'}
          footer={addExistingLocsFooterConfig}
        >
          <SubHeading>
            Select which existing location(s) you want to add to your Run.
          </SubHeading>
          {this.renderModalBody()}
        </Modal>
      )
    );
  }
}

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    isAddExistingLocationsModalOpen:
      state.physicalInventory.inventoryRunDetails.isAddExistingLocationsModalOpen,
    locations: getSearchedInventoryLocations(state),
    isLoading: state.physicalInventory.inventoryRunDetails.isLoading,
    selectedLocationIds:
      state.physicalInventory.inventoryRunDetails.selectedLocations,
    selectAllCheckboxChecked:
      state.physicalInventory.inventoryRunDetails.selectAllCheckboxChecked,
  };
};

/** export Add Existing Locations Modal Component */
export const ConnectedAddExistingLocationsModal = connect<
  IStateProps,
  IDispatchProp,
  {}
>(mapStateToProps)(AddExistingLocationsModal);
