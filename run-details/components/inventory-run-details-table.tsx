import EmptyState, { EmptyStateIcon } from 'components/empty-state';
import { LoadingSpinnerCentered } from 'components/loading-spinner-centered';
import Permissions from 'components/permissions';
import formatCurrency from 'helpers/format-currency';
import {
  ActionTrashButton,
  CopyIconButton,
  Fonts,
  RefreshPriceIconButton,
  SingleSelectDropdown,
  SortType,
  TableElements,
  TableProvider,
  Tooltip,
} from 'hss_components';
import { fetchSelectedLocationDetails } from 'modules/physical-inventory/location-details/thunk-inventory-location-details';
import { openCreateLocationModalAndAddRun } from 'modules/physical-inventory/location-maintenance/thunk.location-maintenance';
import { getInventoryRunDetails } from 'modules/physical-inventory/run-details/inventory-run-details.selectors';
import {
  changeUoMForLocation,
  confirmDeleteLocation,
  confirmLocationRefreshAcquisitionCost,
  fetchInventoryLocations,
  hideShowCopyLocationModal,
  navigateLocationDetails,
  showChangeLocationAccountModal,
} from 'modules/physical-inventory/run-details/thunk.inventory-run-details';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import {
  IChangeLocationAccount,
  IInventoryRunDetails,
  ILocations,
} from 'types/inventory-run-details';
import { IPermissionActions, Permission } from 'types/permissions';
import IDefaultProps from 'types/styled-component-props';

interface IToolTipStateProps {
  /** [required] Unique Tool tip Id */
  toolTipId: string;
  /** [required] Tool tip offset */
  offset: any;
  /** [required] Tool tip message */
  message: string;
}
const ToolTip: React.SFC<IToolTipStateProps> = props => {
  return (
    <Tooltip.TooltipRegular id={props.toolTipId} offset={props.offset}>
      <StyledTooltip>{props.message}</StyledTooltip>
    </Tooltip.TooltipRegular>
  );
};

/** Render Tooltip */
export const RenderToolTip = connect<{}, {}, {}>(null)(ToolTip);

const StyledNameCellWithoutLink = styled(Fonts.Body14)`
  padding-left: 16px;
  color: ${props => props.theme.colors.brandBlue};
  text-align: left;
`;
const StyledNameCell = styled(Fonts.Link14)`
  padding-left: 16px;
  color: ${props => props.theme.colors.brandBlue};
  text-align: left;
`;
const StyledAccountNameLink = styled(Fonts.Body12)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  width: 240px;
  padding-left: 10px;
`;
interface ILocationNameStateProps {
  /** [required] Location Data */
  locationData: ILocations;
}

type ILocationNameProps = ILocationNameStateProps & IDispatchProp;

const RenderLocationName: React.SFC<ILocationNameProps> = props => {
  const getLocationDetails = (runCode: string, locationCode: string) => {
    props.dispatch(navigateLocationDetails(runCode, locationCode));
  };
  const renderLocationName = (
    enabled: boolean,
    disabled: boolean,
    locationData: ILocations,
  ) => {
    return disabled ? (
      <StyledNameCellWithoutLink>
        <Fonts.Bold14>{locationData.name}</Fonts.Bold14>
      </StyledNameCellWithoutLink>
    ) : (
      <StyledNameCell>
        <Fonts.Bold14
          onClick={() => getLocationDetails(locationData.runCode, locationData.code)}
        >
          {locationData.name}
        </Fonts.Bold14>
      </StyledNameCell>
    );
  };
  return (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_LOCATION_LINK]}>
      {({
        [Permission.PI_RUN_DETAIL_LOCATION_LINK]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        renderLocationName(enabled, disabled, props.locationData)
      }
    </Permissions>
  );
};

/** Render With Permissions Location Name */
export const RenderWithPermissionsLocationName = connect<{}, IDispatchProp, {}>(
  null,
)(RenderLocationName);

const StyledAccountCell = styled(Fonts.Link12)`
  color: ${props => props.theme.colors.brandBlue};
  text-align: center;
  max-width: 260px;
`;
const StyledAccountCellWithoutLink = styled(Fonts.Body12)`
  color: ${props => props.theme.colors.black};
  text-align: center;
  max-width: 260px;
`;

interface IChangeLocationAccountStateProps {
  /** [required] Location Data */
  locationData: ILocations;
}
type IChangeLocationAccountProps = IChangeLocationAccountStateProps & IDispatchProp;
const RenderChangeLocationAccount: React.SFC<IChangeLocationAccountProps> = props => {
  const changeLocationAccount = (d: ILocations) => {
    const locationData: IChangeLocationAccount = {
      runCode: d.runCode,
      code: d.code,
      b2bUnitId: d.b2bUnitId,
      changedAccount: '',
    };
    props.dispatch(showChangeLocationAccountModal(locationData));
  };
  const renderChangeAccountLinkForLocation = (
    enabled: boolean,
    disabled: boolean,
    d: ILocations,
  ) => {
    const b2bUnitName = d.b2bUnit.accountNickname
      ? d.b2bUnit.accountNickname
      : d.b2bUnit.name;
    const StyledAccount = disabled
      ? StyledAccountCellWithoutLink
      : StyledAccountCell;
    return (
      <StyledAccount onClick={() => !disabled && changeLocationAccount(d)}>
        <StyledAccountNameLink data-tip data-for={`${d.code}-location-account-Name`}>
          {b2bUnitName}
        </StyledAccountNameLink>
        <StyledAccountNameLink>{d.b2bUnitId}</StyledAccountNameLink>
        <RenderToolTip
          toolTipId={`${d.code}-location-account-Name`}
          offset={{ top: 4, left: 0 }}
          message={b2bUnitName}
        />
      </StyledAccount>
    );
  };

  return (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_ACCOUNT_LINK]}>
      {({
        [Permission.PI_RUN_DETAIL_ACCOUNT_LINK]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        renderChangeAccountLinkForLocation(enabled, disabled, props.locationData)
      }
    </Permissions>
  );
};

/** Render With Permissions Change Location Account */
export const RenderWithPermissionsChangeLocationAccount = connect<
  {},
  IDispatchProp,
  {}
>(null)(RenderChangeLocationAccount);

const StyledUomDropdown = styled(SingleSelectDropdown)`
  width: 140px;
  height: 44px;
`;

interface IChangeUOMStateProps {
  /** [required] Location Data */
  locationData: ILocations;
}
type IChangeUOMProps = IChangeUOMStateProps & IDispatchProp;
const RenderChangeLocationUOM: React.SFC<IChangeUOMProps> = props => {
  const uomOptions = ['Base', 'Alternate'];
  const onDropwownValueChanged = (changedString: string, d: ILocations) => {
    props.dispatch(changeUoMForLocation(d, changedString));
  };
  const renderChangeUOM = (enabled: boolean, disabled: boolean, d: ILocations) => {
    return (
      <StyledUomDropdown
        disabled={disabled}
        onChange={e => onDropwownValueChanged(e, d)}
        dropdownText={d.unitOfMeasure}
        options={uomOptions}
      />
    );
  };
  return (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_UOM_SELECTION]}>
      {({
        [Permission.PI_RUN_DETAIL_UOM_SELECTION]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        renderChangeUOM(enabled, disabled, props.locationData)
      }
    </Permissions>
  );
};

/** Render With Permissions Change Location UOM */
export const RenderWithPermissionsChangeLocationUOM = connect<{}, IDispatchProp, {}>(
  null,
)(RenderChangeLocationUOM);

const StyledRefreshIcon = styled(RefreshPriceIconButton)`
  height: 20px;
  width: 20px;
  padding: 0px;
`;

interface IRefreshAcqIconProps {
  /** [required] Location Data */
  locationData: ILocations;
}
type IRefreshProps = IRefreshAcqIconProps & IDispatchProp;
const RenderRefreshAcqCostIcon: React.SFC<IRefreshProps> = props => {
  const handleRefreshAcquisitionCost = (locationData: ILocations) => {
    props.dispatch(confirmLocationRefreshAcquisitionCost(locationData));
  };
  const renderRefreshAcquisitionCostIcon = (
    enabled: boolean,
    disabled: boolean,
    locationData: ILocations,
  ) => {
    return (
      <>
        <StyledRefreshIcon
          isDisabled={disabled}
          useHoverEffects={true}
          onClick={() => handleRefreshAcquisitionCost(locationData)}
        />
        <RenderToolTip
          toolTipId={`${props.locationData.code}location-refresh-acquisition-tooltip`}
          offset={{ top: 4, left: 0 }}
          message={'Refresh Acquisition Cost'}
        />
      </>
    );
  };
  return (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_REFRESH_ACQ_COST]}>
      {({
        [Permission.PI_RUN_DETAIL_REFRESH_ACQ_COST]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        renderRefreshAcquisitionCostIcon(enabled, disabled, props.locationData)
      }
    </Permissions>
  );
};

/** Render With Permissions Change Refresh Acq Cost Icon */
export const RenderWithPermissionsRefreshAcqCostIcon = connect<
  {},
  IDispatchProp,
  {}
>(null)(RenderRefreshAcqCostIcon);

const StyledCopyIcon = styled(CopyIconButton)`
  border-radius: 0px;
  height: 20px;
  width: 20px;
  padding: 0px;
`;

interface ICopyLocationProps {
  /** [required] Location Data */
  locationData: ILocations;
}
type ICopyProps = ICopyLocationProps & IDispatchProp;
const RenderCopyLocationIcon: React.SFC<ICopyProps> = props => {
  const handleCopyLocation = async (
    locationCode: string,
    runCode: string,
    b2bUnitId: string,
  ) => {
    await props.dispatch(
      fetchSelectedLocationDetails(locationCode, runCode, b2bUnitId),
    );
    props.dispatch(hideShowCopyLocationModal(locationCode));
  };
  const renderCopyLocationIcon = (
    enabled: boolean,
    disabled: boolean,
    d: ILocations,
  ) => {
    return (
      <>
        <StyledCopyIcon
          isDisabled={disabled}
          useHoverEffects={true}
          onClick={() => handleCopyLocation(d.code, d.runCode, d.b2bUnitId)}
        />
        <RenderToolTip
          toolTipId={`${props.locationData.code}copy-location-tooltip`}
          offset={{ top: 4, left: 0 }}
          message={'Copy Products'}
        />
      </>
    );
  };
  return (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_COPY_PRODUCT]}>
      {({
        [Permission.PI_RUN_DETAIL_COPY_PRODUCT]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        renderCopyLocationIcon(enabled, disabled, props.locationData)
      }
    </Permissions>
  );
};

/** Render With Permissions Copy Location Icon */
export const RenderWithPermissionsCopyLocationIcon = connect<{}, IDispatchProp, {}>(
  null,
)(RenderCopyLocationIcon);

const StyledDeleteIcon = styled(ActionTrashButton)`
  border-radius: 0px;
  padding: 0px 6px 0px 0px;
  /* height: 21px;
  width: 21px; */
  &:hover {
    cursor: pointer;
    path {
      stroke: ${props => props.theme.colors.brandLightBlue};
    }
  }
`;
interface IDeleteLocationProps {
  /** [required] Location Data */
  locationData: ILocations;
}
type IDeleteProps = IDeleteLocationProps & IDispatchProp;
const RenderDeleteLocationIcon: React.SFC<IDeleteProps> = props => {
  const handleDeleteLocation = (locationData: ILocations) => {
    props.dispatch(confirmDeleteLocation(locationData));
  };
  const renderDeleteLocationIcon = (
    enabled: boolean,
    disabled: boolean,
    locationData: ILocations,
  ) => {
    return (
      <>
        <StyledDeleteIcon
          useHoverEffects
          onClick={() => handleDeleteLocation(locationData)}
          isDisabled={disabled}
        />
        <RenderToolTip
          toolTipId={`${props.locationData.code}delete-location-tooltip`}
          offset={{ top: 4, left: 0 }}
          message={'Delete Location'}
        />
      </>
    );
  };
  return (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_DELETE_LOC]}>
      {({
        [Permission.PI_RUN_DETAIL_DELETE_LOC]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        renderDeleteLocationIcon(enabled, disabled, props.locationData)
      }
    </Permissions>
  );
};

/** Render With Permissions Delete Location Icon */
export const RenderWithPermissionsDeleteLocationIcon = connect<
  {},
  IDispatchProp,
  {}
>(null)(RenderDeleteLocationIcon);

const StyledNewLocationLink = styled(Fonts.Link14)`
  font-weight: 500;
  text-align: center;
`;

const RenderCreateNewLocationLink: React.SFC<IDispatchProp> = props => {
  const renderEmptyStateCreateNewLocationLink = (
    enabled: boolean,
    disabled: boolean,
  ) => {
    return disabled ? (
      <>
        <StyledFontBold>or</StyledFontBold>
        <Fonts.Body14>{'Create a New Location'}</Fonts.Body14>
      </>
    ) : (
      <>
        <StyledFontBold>or</StyledFontBold>
        <StyledNewLocationLink
          onClick={() => props.dispatch(openCreateLocationModalAndAddRun())}
        >
          Create a New Location
        </StyledNewLocationLink>
      </>
    );
  };
  return (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_ADD_NEW_LOC_LINK]}>
      {({
        [Permission.PI_RUN_DETAIL_ADD_NEW_LOC_LINK]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        renderEmptyStateCreateNewLocationLink(enabled, disabled)
      }
    </Permissions>
  );
};

/** Render With Permissions Create New Location Link */
export const RenderWithPermissionsCreateNewLocationLink = connect<
  {},
  IDispatchProp,
  {}
>(null)(RenderCreateNewLocationLink);

const StyledExistingLocationLink = styled(Fonts.Link14)`
  font-weight: 500;
  text-align: center;
  display: inline-block;
`;

const RenderAddExistingLocationLink: React.SFC<IDispatchProp> = props => {
  const addExistingLocations = () => {
    props.dispatch(fetchInventoryLocations());
  };
  const renderEmptyStateAddExistingLocationLink = (
    enabled: boolean,
    disabled: boolean,
  ) => {
    return disabled ? (
      <Fonts.Body14>{'Add Existing Location(s)'}</Fonts.Body14>
    ) : (
      <StyledExistingLocationLink onClick={addExistingLocations}>
        {'Add Existing Location(s)'}
      </StyledExistingLocationLink>
    );
  };
  return (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_ADD_EXISTING_LOC_LINK]}>
      {({
        [Permission.PI_RUN_DETAIL_ADD_EXISTING_LOC_LINK]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        renderEmptyStateAddExistingLocationLink(enabled, disabled)
      }
    </Permissions>
  );
};

/** Render With Permissions Add Existing Location Link */
export const RenderWithPermissionsAddExistingLocationLink = connect<
  {},
  IDispatchProp,
  {}
>(null)(RenderAddExistingLocationLink);

const StyledEmptyState = styled(EmptyState)`
  padding-top: 60px;
  ${Fonts.Link14} {
    font-weight: 500;
  }
`;

const StyledFontBold = styled(Fonts.Bold14)`
  display: inline-block;
  padding-left: 5px;
`;

const DeleteLocationContainer = styled.div`
  align-self: flex-end;
  height: 29px;
  width: 25px;
  margin-top: 6px;
`;

const StyledTooltip = styled.div`
  max-width: 120px;
  font-size: 11px;
  color: ${props => props.theme.colors.grey6};
`;

const RunsContainer = styled(Fonts.Body14)`
  width: 100%;
`;

const StyledTableProvider = styled(TableProvider)`
  width: 1184px;
`;

const StyledTableHead = styled(TableElements.Head)`
  width: 100%;
`;

const StyledHeadCells = styled(TableElements.HeadCell)`
  text-align: center;
  position: relative;
`;

const StyledTableRow = styled(TableElements.Row)`
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.grey2};
  border-radius: 3px;
  height: 68px;
`;

const StyledTableCell = styled(TableElements.Cell)`
  text-align: center;
  padding: 0;
`;

const StyledTableCellIcons = styled(TableElements.Cell)`
  padding-left: 5px;
  text-align: center;
`;

const StyledLocationNameHeader = styled(TableElements.HeadCell)`
  text-align: left;
  padding-left: 16px;
  position: relative;
`;

const StyledBorderedContainer = styled.div`
  border-left: 1px solid ${props => props.theme.colors.grey3};
  text-overflow: ellipsis;
  overflow: hidden;
  height: 44px;
  vertical-align: middle;
  display: table-cell;
  padding: 0;
  width: 260px;
`;

const RefreshAcquisitionCostContainer = styled.div`
  height: 29px;
  width: 25px;
  margin-top: 6px;
`;

const UomContainer = styled.div`
  border-left: 1px solid ${props => props.theme.colors.grey3};
  padding-left: 30px;
`;

const CopyLocationContainer = styled.div`
  align-self: flex-end;
  height: 29px;
  width: 25px;
  margin-top: 6px;
`;

// Interfaces
interface IStateProps {
  /**
   * [required] indicates if loading spinner is on the page
   */
  isLoading?: boolean;
  /**
   * [required] selected inventory run details
   */
  selectedInventoryRunDetails: IInventoryRunDetails;
}
type IProps = IDefaultProps & IStateProps & IDispatchProp;

const formatCurrencyValue = (data: number) => {
  return `$${formatCurrency(data, 5)}`;
};
class RunsTableComponent extends React.Component<IProps> {
  sortSchema = {
    name: SortType.STRING,
    displayCode: SortType.STRING,
    total: SortType.NUMBER,
  };

  renderEmptyState = () => {
    return (
      <>
        <StyledEmptyState
          type={EmptyStateIcon.NO_RESULTS}
          mainText="This run is empty"
        >
          <RenderWithPermissionsAddExistingLocationLink />
          <RenderWithPermissionsCreateNewLocationLink />
        </StyledEmptyState>
      </>
    );
  };

  refreshAcquisitionCost = (locationData: ILocations) => {
    return (
      <RefreshAcquisitionCostContainer
        data-tip
        data-for={`${locationData.code}location-refresh-acquisition-tooltip`}
      >
        <RenderWithPermissionsRefreshAcqCostIcon locationData={locationData} />
      </RefreshAcquisitionCostContainer>
    );
  };

  copyLocation = (d: ILocations) => {
    return (
      <CopyLocationContainer data-tip data-for={`${d.code}copy-location-tooltip`}>
        <RenderWithPermissionsCopyLocationIcon locationData={d} />
      </CopyLocationContainer>
    );
  };

  deleteLocation = (locationData: ILocations) => {
    return (
      <DeleteLocationContainer
        data-tip
        data-for={`${locationData.code}delete-location-tooltip`}
      >
        <RenderWithPermissionsDeleteLocationIcon locationData={locationData} />
      </DeleteLocationContainer>
    );
  };

  getRow = (d: ILocations, index: number) => (
    <StyledTableRow key={d.code}>
      <StyledTableCell>
        <RenderWithPermissionsLocationName locationData={d} />
      </StyledTableCell>
      <StyledTableCell>
        <StyledBorderedContainer>
          <Fonts.Body12>{d.displayCode}</Fonts.Body12>
        </StyledBorderedContainer>
      </StyledTableCell>
      <StyledTableCell>
        <StyledBorderedContainer>
          <RenderWithPermissionsChangeLocationAccount locationData={d} />
        </StyledBorderedContainer>
      </StyledTableCell>
      <StyledTableCell>
        <UomContainer>
          <RenderWithPermissionsChangeLocationUOM locationData={d} />
        </UomContainer>
      </StyledTableCell>
      <StyledTableCell>
        <StyledBorderedContainer>
          <Fonts.Body12>{formatCurrencyValue(d.total)}</Fonts.Body12>
        </StyledBorderedContainer>
      </StyledTableCell>
      <StyledTableCellIcons>
        <Fonts.Body12>{this.refreshAcquisitionCost(d)}</Fonts.Body12>
      </StyledTableCellIcons>
      <StyledTableCellIcons>
        <Fonts.Body12>{this.copyLocation(d)}</Fonts.Body12>
      </StyledTableCellIcons>
      <StyledTableCellIcons>
        <Fonts.Body14>{this.deleteLocation(d)}</Fonts.Body14>
      </StyledTableCellIcons>
    </StyledTableRow>
  );
  renderTable = () => (
    <StyledTableProvider
      data={this.props.selectedInventoryRunDetails.locations || []}
      sortedColumns={[{ id: 'name', desc: false }]}
      sortSchema={this.sortSchema}
      highlightSelected={true}
    >
      <StyledTableHead>
        <StyledLocationNameHeader width={281} id="name">
          Location Name
        </StyledLocationNameHeader>
        <StyledHeadCells width={281} id="code">
          Code
        </StyledHeadCells>
        <StyledHeadCells width={281} id="account">
          Account
        </StyledHeadCells>
        <StyledHeadCells width={200} id="uom">
          UoM
        </StyledHeadCells>
        <StyledHeadCells width={281} id="total">
          Total
        </StyledHeadCells>
        <StyledHeadCells width={20} id="locatoinStatus" />
        <StyledHeadCells width={20} id="downloadLocation" />
        <StyledHeadCells width={20} id="deleteLocation" />
      </StyledTableHead>
      <TableElements.RowGroup>
        {this.props.selectedInventoryRunDetails.locations &&
        this.props.selectedInventoryRunDetails.locations.length
          ? ({ sortedData }: { sortedData: ILocations[] }) =>
              sortedData.map((d, index) => this.getRow(d, index))
          : null}
      </TableElements.RowGroup>
    </StyledTableProvider>
  );
  render() {
    return this.props.isLoading ? (
      <LoadingSpinnerCentered />
    ) : (
      <div>
        <RunsContainer>{this.renderTable()}</RunsContainer>
        {this.props.selectedInventoryRunDetails.locations &&
        this.props.selectedInventoryRunDetails.locations.length === 0
          ? this.renderEmptyState()
          : null}
      </div>
    );
  }
}

// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    isLoading: state.physicalInventory.inventoryRunDetails.isLoading,
    selectedInventoryRunDetails: getInventoryRunDetails(state),
  };
};

const runDetailsTable = connect<IStateProps, IDispatchProp>(mapStateToProps)(
  RunsTableComponent,
);

/** export Runs Table Component */
export { runDetailsTable };
// tslint:disable-next-line:max-file-line-count
