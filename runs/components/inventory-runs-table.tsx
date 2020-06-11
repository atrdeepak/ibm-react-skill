import EmptyState, { EmptyStateIcon } from 'components/empty-state';
import { LoadingSpinnerCentered } from 'components/loading-spinner-centered';
import Permissions from 'components/permissions';
import { format } from 'date-fns';
import formatCurrency from 'helpers/format-currency';
import {
  ActionTrashButton,
  Fonts,
  GenerateReportIconButton,
  RefreshPriceIconButton,
  SingleDatePicker,
  SortType,
  TableElements,
  TableProvider,
  Tooltip,
} from 'hss_components';
import {
  lastDatePossible,
  startDatePossible,
} from 'modules/physical-inventory/helpers';
import {
  confirmRunGenerateReportModal,
  redirectToRunDetailsPage,
  setRunsDateThunk,
  showOrHideCreateRunModal,
} from 'modules/physical-inventory/runs/thunk.inventory-runs';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IInventoryRuns } from 'types/inventory-runs';
import { IPermissionActions, Permission } from 'types/permissions';
import IDefaultProps from 'types/styled-component-props';
import { getInventoryRuns } from '../inventory-runs.selectors';
import {
  confirmDeleteRun,
  confirmRunRefreshAcquisitionCost,
} from '../thunk.inventory-runs';

// Interfaces
interface IStateProps {
  /**
   * [required] indicates if loading spinner is on the page
   */
  isLoading?: boolean;
  /**
   * [required] list of runs item for the default selected account
   */
  runs: IInventoryRuns[];
  /**
   *  For enable and disable the generate report  icon
   */

  isFileDownloading: boolean;
  /**
   *  For enable and disable the generate report  icon based on Runcode
   */

  selectedRunCode: string;
}
type IProps = IDefaultProps & IStateProps & IDispatchProp;

// Styles for EmptyState
const StyledEmptyState = styled(EmptyState)`
  padding-top: 60px;
  ${Fonts.Link14} {
    font-weight: 500;
  }
`;

const DeleteRunContainer = styled.div`
  align-self: flex-end;
  height: 29px;
  width: 25px;
  margin-top: 6px;
`;
const RefreshAcquisitionCostContainer = styled.div`
  height: 29px;
  width: 25px;
  margin-top: 6px;
`;

const GenReportIconContainer = styled.div``;

const StyledTooltip = styled.div`
  max-width: 120px;
  font-size: 11px;
  color: ${props => props.theme.colors.grey6};
`;

// Styles for Runs table
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
  &:first-child {
    text-align: left;
  }
`;
const StyledTableRow = styled(TableElements.Row)`
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.grey2};
  border-radius: 3px;
  height: 68px;
`;
const StyledTableCell = styled(TableElements.Cell)`
  padding: 0 0 0 0;
  text-align: center;
`;
const StyledTableCellIcons = styled(TableElements.Cell)`
  padding: 0 0 0 5;
  text-align: center;
`;
const StyledNameCell = styled(Fonts.Link14)`
  padding-left: 16px;
  color: ${props => props.theme.colors.brandBlue};
  text-align: left;
`;
const StyledNameCellWithoutLink = styled(Fonts.Body14)`
  padding-left: 16px;
  color: ${props => props.theme.colors.brandBlue};
  text-align: left;
`;
const StyledRunNameHeader = styled(TableElements.HeadCell)`
  text-align: center;
  padding-left: 16px;
  position: relative;
  &:first-child {
    text-align: left;
  }
`;
const StyledBorderedContainer = styled.div`
  border-left: 1px solid ${props => props.theme.colors.grey3};
  text-overflow: ellipsis;
  overflow: hidden;
  height: 44px;
  vertical-align: middle;
  display: table-cell;
  width: 260px;
`;

/** Styles for All the Action Icons */
const StyledRefreshIcon = styled(RefreshPriceIconButton)`
  height: 20px;
  width: 20px;
  padding: 0px;
`;
const StyledGenReportIcon = styled(GenerateReportIconButton)`
  height: 24px;
  width: 24px;
  padding: 0px;
`;
const StyledDeleteIcon = styled(ActionTrashButton)`
  border-radius: 0px;
  padding: 0px;
`;
const dateFormatMMDDYYYY = 'MM/DD/YYYY';
const formatCurrencyValue = (data: number) => {
  return `$${formatCurrency(data, 5)}`;
};

const StyledSingleDatePickerContainer = styled.div`
  > div {
    width: 95px;
  }
  div[class*='date-picker-wrapper'] {
    margin-right: -186px;
    margin-top: 2px;
  }
  div[class*='error-text stateless-text-input__ErrorText'] {
    margin-left: -58px;
  }
  div[class*='single-date-picker__StyledDatePickerDropdown'] {
    border: 1px solid ${props => props.theme.colors.grey3};
    display: inline-flex;
  }
  div[class*='calendar-icon'] {
    display: none;
  }
`;
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

class RunsTableComponent extends React.Component<IProps> {
  sortSchema = {
    name: SortType.STRING,
    code: SortType.STRING,
    date: SortType.DATE,
    totalValue: SortType.NUMBER,
  };
  renderWithPermissionsEmptyStateCreateRunLink = (
    <Permissions hasPermissions={[Permission.PI_RUN_FAB_CREATE_RUN_LINK]}>
      {({
        [Permission.PI_RUN_FAB_CREATE_RUN_LINK]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        this.renderEmptyStateCreateRunLink(enabled, disabled)
      }
    </Permissions>
  );
  openCreateRunModal = () => {
    this.props.dispatch(showOrHideCreateRunModal());
  };
  renderEmptyStateCreateRunLink = (enabled: boolean, disabled: boolean) => {
    return disabled ? (
      <Fonts.Body14>{'Create a new run'}</Fonts.Body14>
    ) : (
      <Fonts.Link14 onClick={this.openCreateRunModal}>
        {'Create a new run'}
      </Fonts.Link14>
    );
  };
  renderEmptyState = () => {
    return (
      <StyledEmptyState
        type={EmptyStateIcon.NO_RESULTS}
        mainText={'No Inventory Runs'}
      >
        {this.renderWithPermissionsEmptyStateCreateRunLink}
      </StyledEmptyState>
    );
  };
  handleRefreshAcquisitionCost = (runData: IInventoryRuns) => {
    this.props.dispatch(confirmRunRefreshAcquisitionCost(runData));
  };
  renderRefreshAcquisitionCostIcon = (
    enabled: boolean,
    disabled: boolean,
    runData: IInventoryRuns,
  ) => {
    return (
      <>
        <StyledRefreshIcon
          isDisabled={disabled}
          useHoverEffects
          onClick={() => this.handleRefreshAcquisitionCost(runData)}
          id={`${runData.code}`}
        />
        <RenderToolTip
          toolTipId={`${runData.code}refresh-acquisition-tooltip`}
          offset={{ top: 4, left: 0 }}
          message={'Refresh Acquisition Cost'}
        />
      </>
    );
  };
  renderWithPermissionsRefreshAcquisitionCostIcon = (runData: IInventoryRuns) => {
    return (
      <Permissions hasPermissions={[Permission.PI_RUN_ACQ_COST_BUTTON]}>
        {({
          [Permission.PI_RUN_ACQ_COST_BUTTON]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) &&
          this.renderRefreshAcquisitionCostIcon(enabled, disabled, runData)
        }
      </Permissions>
    );
  };
  refreshAcquisitionCost = (runData: IInventoryRuns) => {
    return (
      <RefreshAcquisitionCostContainer
        data-tip
        data-for={`${runData.code}refresh-acquisition-tooltip`}
      >
        {this.renderWithPermissionsRefreshAcquisitionCostIcon(runData)}
      </RefreshAcquisitionCostContainer>
    );
  };
  handleGenerateReport = (runData: IInventoryRuns) => {
    this.props.dispatch(confirmRunGenerateReportModal(runData));
  };
  renderGenerateReportIcon = (
    enabled: boolean,
    disabled: boolean,
    d: IInventoryRuns,
  ) => {
    const isCurrentRunReportDownloading = this.props.isFileDownloading
      ? this.props.selectedRunCode === d.code.toString()
      : false;

    return (
      <>
        <StyledGenReportIcon
          isDisabled={isCurrentRunReportDownloading ? true : disabled}
          useHoverEffects
          onClick={() => this.handleGenerateReport(d)}
          id={`${d.code}`}
        />
        <RenderToolTip
          toolTipId={`${d.code}generate-report-tooltip`}
          offset={{ top: 4, left: 0 }}
          message={
            isCurrentRunReportDownloading
              ? 'Report is currently being generated'
              : 'Generate Report'
          }
        />
      </>
    );
  };
  renderWithPermissionsGenerateReportIcon = (d: IInventoryRuns) => {
    return (
      <Permissions hasPermissions={[Permission.PI_RUN_GENERATE_REPORT]}>
        {({
          [Permission.PI_RUN_GENERATE_REPORT]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) &&
          this.renderGenerateReportIcon(enabled, disabled, d)
        }
      </Permissions>
    );
  };
  renderGenerateReportModal = (d: IInventoryRuns) => {
    return (
      <GenReportIconContainer data-tip data-for={`${d.code}generate-report-tooltip`}>
        {this.renderWithPermissionsGenerateReportIcon(d)}
      </GenReportIconContainer>
    );
  };
  handleDeleteRun = (runData: IInventoryRuns) => {
    this.props.dispatch(confirmDeleteRun(runData));
  };
  renderDeleteRunIcon = (
    enabled: boolean,
    disabled: boolean,
    runData: IInventoryRuns,
  ) => {
    return (
      <>
        <StyledDeleteIcon
          isDisabled={disabled}
          useHoverEffects
          onClick={() => this.handleDeleteRun(runData)}
        />
        <RenderToolTip
          toolTipId={`${runData.code}delete-run-tooltip`}
          offset={{ top: 4, left: 0 }}
          message={'Delete Run'}
        />
      </>
    );
  };
  renderWithPermissionsDeleteRunIcon = (runData: IInventoryRuns) => {
    return (
      <Permissions hasPermissions={[Permission.PI_RUN_DELETE_BUTTON]}>
        {({
          [Permission.PI_RUN_DELETE_BUTTON]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) &&
          this.renderDeleteRunIcon(enabled, disabled, runData)
        }
      </Permissions>
    );
  };
  deleteRun = (runData: IInventoryRuns) => {
    return (
      <DeleteRunContainer data-tip data-for={`${runData.code}delete-run-tooltip`}>
        {this.renderWithPermissionsDeleteRunIcon(runData)}
      </DeleteRunContainer>
    );
  };
  setRunsDate = (e: any, runCode: string) => {
    this.props.dispatch(setRunsDateThunk(e, runCode));
  };
  updateSelectedRunCode = (runCode: string) => {
    this.props.dispatch(redirectToRunDetailsPage(runCode));
  };
  renderRunName = (enabled: boolean, disabled: boolean, d: IInventoryRuns) => {
    return disabled ? (
      <StyledNameCellWithoutLink>
        <Fonts.Bold14>{d.name}</Fonts.Bold14>
      </StyledNameCellWithoutLink>
    ) : (
      <StyledNameCell>
        <Fonts.Bold14 onClick={() => this.updateSelectedRunCode(d.code)}>
          {d.name}
        </Fonts.Bold14>
      </StyledNameCell>
    );
  };
  renderWithPermissionsRunName = (d: IInventoryRuns) => {
    return (
      <Permissions hasPermissions={[Permission.PI_RUN_NAME_LINK]}>
        {({
          [Permission.PI_RUN_NAME_LINK]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) && this.renderRunName(enabled, disabled, d)
        }
      </Permissions>
    );
  };
  renderChangeRunDate = (enabled: boolean, disabled: boolean, d: IInventoryRuns) => {
    return (
      <StyledSingleDatePickerContainer>
        <SingleDatePicker
          isDisabled={disabled}
          title={format(d.date, dateFormatMMDDYYYY)}
          hardFromDate={startDatePossible}
          hardToDate={lastDatePossible}
          defaultDate={new Date(format(d.date, dateFormatMMDDYYYY))}
          setDate={e => this.setRunsDate(e, d.code)}
        />
      </StyledSingleDatePickerContainer>
    );
  };
  renderWithPermissionsChangeRunDate = (d: IInventoryRuns) => {
    return (
      <Permissions hasPermissions={[Permission.PI_RUN_DATE_TEXTBOX]}>
        {({
          [Permission.PI_RUN_DATE_TEXTBOX]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) && this.renderChangeRunDate(enabled, disabled, d)
        }
      </Permissions>
    );
  };
  getRow = (d: IInventoryRuns, index: number) => (
    <StyledTableRow key={d.code}>
      <StyledTableCell>{this.renderWithPermissionsRunName(d)}</StyledTableCell>
      <StyledTableCell>{this.renderWithPermissionsChangeRunDate(d)}</StyledTableCell>
      <StyledTableCell>
        <StyledBorderedContainer>
          <Fonts.Body12>{d.code}</Fonts.Body12>
        </StyledBorderedContainer>
      </StyledTableCell>
      <StyledTableCell>
        <StyledBorderedContainer>
          <Fonts.Body12>{formatCurrencyValue(d.totalValue)}</Fonts.Body12>
        </StyledBorderedContainer>
      </StyledTableCell>
      <StyledTableCellIcons>{this.refreshAcquisitionCost(d)}</StyledTableCellIcons>
      <StyledTableCellIcons>
        <Fonts.Body14>{this.renderGenerateReportModal(d)}</Fonts.Body14>
      </StyledTableCellIcons>
      <StyledTableCellIcons>
        <Fonts.Body14>{this.deleteRun(d)}</Fonts.Body14>
      </StyledTableCellIcons>
    </StyledTableRow>
  );
  renderTable = () => (
    <StyledTableProvider
      data={this.props.runs}
      sortedColumns={[{ id: 'date', desc: true }]}
      sortSchema={this.sortSchema}
      highlightSelected={true}
    >
      <StyledTableHead className="runs-header">
        <StyledRunNameHeader width={281} id="name" className="runs-header">
          Run Name
        </StyledRunNameHeader>
        <StyledHeadCells width={281} id="date" className="runs-header">
          Run Date
        </StyledHeadCells>
        <StyledHeadCells width={281} id="code" className="runs-header">
          Run Code
        </StyledHeadCells>
        <StyledHeadCells width={281} id="totalValue" className="runs-header">
          Run Total
        </StyledHeadCells>
        <StyledHeadCells width={20} id="runStatus" className="runs-header" />
        <StyledHeadCells width={20} id="downloadRun" className="runs-header" />
        <StyledHeadCells width={20} id="deleteRun" className="runs-header" />
      </StyledTableHead>
      <TableElements.RowGroup>
        {!!this.props.runs.length
          ? ({ sortedData }: { sortedData: IInventoryRuns[] }) =>
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
        {this.props.runs.length === 0 ? this.renderEmptyState() : null}
      </div>
    );
  }
}
// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    isFileDownloading:
      state.physicalInventory.generateReportModal.isReportGenerating,
    selectedRunCode: state.physicalInventory.generateReportModal.selectedRunCode,
    isLoading: state.physicalInventory.inventoryRuns.isLoading,
    runs: getInventoryRuns(state),
  };
};
const runsTable = connect<IStateProps, IDispatchProp>(mapStateToProps)(
  RunsTableComponent,
);
/** export Runs Table Component */
export { runsTable };
// tslint:disable-next-line:max-file-line-count
