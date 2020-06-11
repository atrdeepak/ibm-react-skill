import EmptyState, { EmptyStateIcon } from 'components/empty-state';
import TableLoadingSpinner from 'components/sortable-table/custom-tables/plain-table/table-loading-spinner';
import Timestamp from 'components/timestamp';
import {
  ActionTrashButton,
  Fonts,
  PencilButton,
  SortType,
  TableElements,
  TableProvider,
  Tooltip,
} from 'hss_components';
import { getFilteredInventoryLocations } from 'modules/physical-inventory/location-maintenance/location-maintenance.selectors';
import {
  confirmDeleteInventoryLocation,
  openCreateLocationModal,
} from 'modules/physical-inventory/location-maintenance/thunk.location-maintenance';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { ILocations } from 'types/inventory-run-details';
import IDefaultProps from 'types/styled-component-props';

interface IStateProps {
  /**
   * Inventory Locations maintenance data
   */
  locations: ILocations[];
  /**
   * whether inventory locations data is loaded
   */
  isLoading?: boolean;
}

const StyledTableProvider = styled(TableProvider)`
  width: 100%;
`;

const StyledHeadCell = styled(TableElements.HeadCell)`
  position: relative;
`;

const StyledLocationHeadCell = styled(TableElements.HeadCell)`
  position: relative;
  padding-left: 16px;
`;

const StyledTableRow = styled(TableElements.Row)`
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.grey2};
  border-radius: 3px;
  height: 68px;
`;

const StyledSpinner = styled(TableLoadingSpinner)`
  margin-top: 150px;
`;

const StyledEmptyState = styled(EmptyState)`
  padding-top: 100px;
`;

const StyledTableCell = styled(TableElements.Cell)`
  padding: 0px;
`;

const StyledLocationName = styled(Fonts.Bold14)`
  border-right: 1px solid ${props => props.theme.colors.grey3};
  height: 30px;
  display: flex;
  align-items: center;
  padding-left: 15px;
`;

const StyledTimeStamp = styled(Fonts.Body12)`
  border-right: 1px solid ${props => props.theme.colors.grey3};
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledLocationCode = styled(Fonts.Body12)`
  border-right: 1px solid ${props => props.theme.colors.grey3};
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledPencilIcon = styled(PencilButton)`
  svg {
    height: 21px;
    width: 21px;
  }
`;

const StyledDeleteButton = styled(ActionTrashButton)`
  border-radius: 0px;
  padding: 0px 6px 0px 0px;
  &:hover {
    path {
      stroke: ${props =>
        props.isDisabled
          ? props.theme.colors.grey5
          : props.theme.colors.brandLightBlueHighlight};
    }
  }
  opacity: ${props => (props.isDisabled ? '0.3' : '')};
`;

const StyledTooltip = styled.div`
  max-width: 120px;
  font-size: 11px;
  color: ${props => props.theme.colors.grey6};
`;

const SpacerHeadCell = styled.div`
  display: flex;
  flex: 1 1 auto;
  height: 17px;
`;

const sortSchema = {
  name: SortType.STRING,
  creationTime: SortType.DATE,
  unitOfMeasure: SortType.STRING,
};

const sortedColumns = [{ id: 'name', desc: false }];

type IProps = IDefaultProps & IStateProps & IDispatchProp;

class UnconnectedLocationMaintenanceTable extends React.Component<IProps> {
  renderLoadingSpinner = () => <StyledSpinner />;

  renderEmptyState = () => {
    const handleCreateNewLocation = () =>
      this.props.dispatch(openCreateLocationModal());
    return (
      <StyledEmptyState type={EmptyStateIcon.NO_LOCATIONS} mainText="No Locations">
        <Fonts.Link14 onClick={handleCreateNewLocation}>
          Create a New Location
        </Fonts.Link14>
      </StyledEmptyState>
    );
  };

  render() {
    const renderEditLocation = (d: ILocations) => {
      const toolTipId = `${d.code}-edit-location-tooltip`;
      const handleEditLocation = () =>
        this.props.dispatch(openCreateLocationModal(d));
      return (
        <div data-tip data-for={toolTipId}>
          <StyledPencilIcon onClick={handleEditLocation} />
          <Tooltip.TooltipRegular id={toolTipId} offset={{ top: 5, left: -4 }}>
            <StyledTooltip>Edit Location</StyledTooltip>
          </Tooltip.TooltipRegular>
        </div>
      );
    };

    const renderDeleteLocation = (d: ILocations) => {
      const isDisabled = d.runs && d.runs.length > 0;
      const toolTipId = `${d.code}-delete-location-tooltip`;
      const toolTipMessage = isDisabled
        ? 'Cannot delete this location because it is associated with an Inventory Run'
        : 'Delete Location';
      const handleDeleteLocation = () =>
        this.props.dispatch(confirmDeleteInventoryLocation(d));
      return (
        <div data-tip data-for={toolTipId}>
          <StyledDeleteButton
            useHoverEffects
            onClick={handleDeleteLocation}
            isDisabled={isDisabled}
          />
          <Tooltip.TooltipRegular id={toolTipId} offset={{ top: 6, left: 2 }}>
            <StyledTooltip>{toolTipMessage}</StyledTooltip>
          </Tooltip.TooltipRegular>
        </div>
      );
    };
    const getRow = (d: ILocations, index: number) => (
      <StyledTableRow key={d.code}>
        <StyledTableCell>
          <StyledLocationName>{d.name}</StyledLocationName>
        </StyledTableCell>
        <StyledTableCell textAlign="center">
          <StyledTimeStamp>
            <Timestamp timestamp={d.creationTime} dateFormat="MM/DD/YYYY" />
          </StyledTimeStamp>
        </StyledTableCell>
        <StyledTableCell textAlign="center">
          <StyledLocationCode>{d.code}</StyledLocationCode>
        </StyledTableCell>
        <StyledTableCell textAlign="center">{d.unitOfMeasure}</StyledTableCell>
        <StyledTableCell textAlign="center">{renderEditLocation(d)}</StyledTableCell>
        <StyledTableCell textAlign="center" width={20}>
          {renderDeleteLocation(d)}
        </StyledTableCell>
      </StyledTableRow>
    );

    const renderTable = () => (
      <>
        <StyledTableProvider
          data={this.props.locations}
          sortedColumns={sortedColumns}
          sortSchema={sortSchema}
          highlightSelected
        >
          <TableElements.Head backgroundColor="grey1">
            <StyledLocationHeadCell id="name" width={281}>
              Location Name
            </StyledLocationHeadCell>
            <StyledHeadCell id="creationTime" width={281} textAlign="center">
              Date Created
            </StyledHeadCell>
            <StyledHeadCell id="" width={281} textAlign="center">
              Location Code
            </StyledHeadCell>
            <StyledHeadCell id="unitOfMeasure" width={281} textAlign="center">
              UoM
            </StyledHeadCell>
            <StyledHeadCell width={20}>
              <SpacerHeadCell />
            </StyledHeadCell>
            <StyledHeadCell width={20}>
              <SpacerHeadCell />
            </StyledHeadCell>
          </TableElements.Head>
          <TableElements.RowGroup>
            {({ sortedData }: { sortedData: ILocations[] }) =>
              sortedData.map((d, index) => getRow(d, index))
            }
          </TableElements.RowGroup>
        </StyledTableProvider>
        {this.props.isLoading
          ? this.renderLoadingSpinner()
          : this.props.locations.length === 0
          ? this.renderEmptyState()
          : null}
      </>
    );
    return renderTable();
  }
}

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    isLoading: state.physicalInventory.locationMaintenance.isLoading,
    locations: getFilteredInventoryLocations(state),
  };
};

/** Inventory Locations Table Component */
export const LocationMaintenanceTable = connect<IStateProps, IDispatchProp>(
  mapStateToProps,
)(UnconnectedLocationMaintenanceTable);
