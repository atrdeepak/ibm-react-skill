import { BackNavChevron } from 'components/navigation/breadcrumb/back-chevron-icon';
import Permissions from 'components/permissions';
import Toggleable from 'components/toggleable';
import {
  AddLocationButton,
  EditableText,
  ExpandingRoundActionButtonGroup,
  Fonts,
  GenerateReportIconButton,
  LocationButton,
  Tooltip,
} from 'hss_components';
import { isANSIx12CompliantAnyLength } from 'modules/forms/validators';
import { setPageFilterSelectedAccount } from 'modules/page-filters/act.page-filters';
import { PageSelectActiveAccount } from 'modules/page-filters/filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { PageFilters } from 'modules/page-filters/page-filter-provider';
import { generateReportRunDetailsModal } from 'modules/physical-inventory/generate-report-modal/thunk.run-details-report-modal';
import { validationMsgFn } from 'modules/physical-inventory/helpers';
import { navigateToInventoryRunsPage } from 'modules/physical-inventory/helpers.ts';
import { openCreateLocationModalAndAddRun } from 'modules/physical-inventory/location-maintenance/thunk.location-maintenance';
import { getInventoryRunDetails } from 'modules/physical-inventory/run-details/inventory-run-details.selectors';
import {
  fetchInventoryLocations,
  setRunNameThunk,
} from 'modules/physical-inventory/run-details/thunk.inventory-run-details';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IInventoryRunDetails } from 'types/inventory-run-details';
import { IPermissionActions, Permission } from 'types/permissions';

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

interface IStateProps {
  /**
   * [required] selected inventory run details
   */
  selectedInventoryRunDetails: IInventoryRunDetails;

  /**
   *  For enable and disable the generate  report icon
   */
  isFileDownloading: boolean;
}

const StyledAccount = styled(Fonts.Display32)`
  color: ${props => props.theme.colors.grey6};
  padding-top: 6px;
`;

const FlexRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const HeaderContainer = styled.div`
  display: flex;
  padding: 40px 0 25px 0;
  margin-left: -20px;
  width: 1204px;
  position: relative;
`;

/** styling for back button */
const BackButton = styled(BackNavChevron)`
  cursor: pointer;
  margin-top: 23px;
  height: 32px;
  width: 32px;
`;

const PlusiconContainer = styled.div``;

const StyledAddCreateLocationButton = styled(ExpandingRoundActionButtonGroup)`
  margin-left: 18px;
  height: 48px;
  width: 48px;
  top: 7px;
  svg:nth-child {
    z-index: 11;
  }
`;

const StyledRunPageFilters = styled(PageFilters)`
  justify-content: space-between;
  padding-left: 16px;
  width: 100%;
  align-items: flex-end;
`;
const StyledPageSelectActiveAccount = styled.div`
  padding-bottom: 2px;
  display: flex;
`;

const ReportIconContainer = styled.div`
  padding: 12px 0 0 0;
`;

const StyledTooltip = styled.div`
  max-width: 120px;
  font-size: 11px;
  text-align: center;
  color: ${props => props.theme.colors.grey6};
`;

const GenReportIconContainer = styled.div``;

const StyledGenReportIcon = styled(GenerateReportIconButton)`
  height: 24px;
  width: 24px;
  border: 1px solid ${props => props.theme.colors.grey5};
  padding: 4px;
  border-radius: 17px;
  :hover {
    border: 1px solid
      ${props =>
        props.isDisabled
          ? props.theme.colors.grey5
          : props.theme.colors.brandLightBlue};
  }
`;

const StyledIconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  position: absolute;
  right: 0;
`;

const DetailsHeaderLabel = styled(Fonts.Body12)`
  color: ${props => props.theme.colors.grey5};
  margin-bottom: 8px;
  padding-left: 15px;
`;

const RunCodeHeaderContainer = styled.div`
  width: auto;
`;

const RunCodeHeaderLabel = styled(DetailsHeaderLabel)`
  color: ${props => props.theme.colors.grey5};
  margin-bottom: 8px;
  padding-left: 15px;
`;

const RunCodeData = styled(Fonts.Body16)`
  white-space: nowrap;
  color: ${props => props.theme.colors.grey6};
  padding: 5px 16px 0 16px;
  border-right: 1px solid ${props => props.theme.colors.grey3};
  height: 30px;
  border-left: 1px solid ${props => props.theme.colors.grey3};
`;

const RunNameTextBox = styled(EditableText)`
  color: ${props => props.theme.colors.black};
  padding: 18px 6px 0 0;
  font-size: 32px;
  width: 412px;
  a {
    white-space: nowrap;
    font-size: 32px;
    line-height: 36px;
    max-width: 372px;
    text-overflow: ellipsis;
    overflow: hidden;
    :hover {
      color: ${props => props.theme.colors.brandLightBlue};
    }
  }
  textarea {
    font-size: 32px;
    background-color: ${props => props.theme.colors.grey1};
  }
  svg {
    padding-bottom: 2px;
  }
`;
const DisabledRunNameTextBox = styled(Fonts.Body14)`
  color: ${props => props.theme.colors.black};
  padding: 27px 6px 0 0;
  font-size: 32px;
`;

const StyledAddLocationButton = styled(AddLocationButton)`
  &:hover {
    circle {
      stroke: ${props => props.theme.colors.brandLightBlue};
    }
  }
`;

type IProps = IStateProps & IDispatchProp;

/** Inventory Runs Header Component */
class RunDetailsHeader extends React.Component<IProps> {
  renderWithPermissionsPageSelectActiveAccount = (
    <Permissions
      hasPermissions={[Permission.PI_RUN_DETAIL_INV_RUN_ACCOUNT_SELECTOR]}
    >
      {({
        [Permission.PI_RUN_DETAIL_INV_RUN_ACCOUNT_SELECTOR]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) &&
        this.renderPageSelectActiveAccount(enabled, disabled)
      }
    </Permissions>
  );

  renderWithPermissionsRunNameText = (
    <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_EDIT_RUN_NAME]}>
      {({
        [Permission.PI_RUN_DETAIL_EDIT_RUN_NAME]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) && this.renderRunNameText(enabled, disabled)
      }
    </Permissions>
  );
  onBackButtonClick = () => {
    this.props.dispatch(
      setPageFilterSelectedAccount(
        PageKey.INVENTORY_RUN,
        this.props.selectedInventoryRunDetails.b2bUnitId,
      ),
    );
    navigateToInventoryRunsPage();
  };

  generateRunLocationsReport = (runCode: string) => {
    this.props.dispatch(generateReportRunDetailsModal(runCode));
  };

  renderGenerateReportIcon = (
    enabled: boolean,
    disabled: boolean,
    runCode: string,
  ) => {
    return (
      <>
        <StyledGenReportIcon
          isDisabled={this.props.isFileDownloading ? true : disabled}
          useHoverEffects
          onClick={() => this.generateRunLocationsReport(runCode)}
        />
        <RenderToolTip
          toolTipId={`generate-report-tooltip`}
          offset={{ top: 4, left: 0 }}
          message={
            this.props.isFileDownloading
              ? 'Report is currently being generated'
              : 'Generate Report'
          }
        />
      </>
    );
  };
  renderWithPermissionsGenerateReportIcon = (runCode: string) => {
    return (
      <Permissions hasPermissions={[Permission.PI_RUN_ACQ_COST_BUTTON]}>
        {({
          [Permission.PI_RUN_ACQ_COST_BUTTON]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) &&
          this.renderGenerateReportIcon(enabled, disabled, runCode)
        }
      </Permissions>
    );
  };

  renderGenerateReportModal = (runCode: string) => {
    return (
      <GenReportIconContainer data-tip data-for={`generate-report-tooltip`}>
        {this.renderWithPermissionsGenerateReportIcon(runCode)}
      </GenReportIconContainer>
    );
  };

  renderExpandingButton = () => {
    const addExistingLocations = () => {
      this.props.dispatch(fetchInventoryLocations());
    };

    const handleCreateNewLocation = () => {
      this.props.dispatch(openCreateLocationModalAndAddRun());
    };
    const renderAddExistingLocationIcon = (enabled: boolean, disabled: boolean) => {
      return (
        <>
          <LocationButton
            className="btn-fab-icon-1"
            isDisabled={disabled}
            data-tip
            data-for="add-location-button-tooltip"
            border
            onClick={addExistingLocations}
            useHoverEffects
          />
        </>
      );
    };
    const renderWithPermissionsAddExistingLocationIcon = (
      <Permissions
        hasPermissions={[Permission.PI_RUN_DETAIL_ADD_EXISTING_LOC_BUTTON]}
      >
        {({
          [Permission.PI_RUN_DETAIL_ADD_EXISTING_LOC_BUTTON]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) && renderAddExistingLocationIcon(enabled, disabled)
        }
      </Permissions>
    );
    const renderCreateNewLocationIcon = (enabled: boolean, disabled: boolean) => {
      return (
        <StyledAddLocationButton
          className="btn-fab-icon-2"
          isDisabled={disabled}
          data-tip
          data-for="create-new-location-button-tooltip"
          border
          onClick={handleCreateNewLocation}
          useHoverEffects
        />
      );
    };
    const renderWithPermissionsCreateNewLocationIcon = (
      <Permissions hasPermissions={[Permission.PI_RUN_DETAIL_CREATE_NEW_LOCATION]}>
        {({
          [Permission.PI_RUN_DETAIL_CREATE_NEW_LOCATION]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) && renderCreateNewLocationIcon(enabled, disabled)
        }
      </Permissions>
    );

    return (
      <Toggleable>
        {({ on, toggle }) => (
          <StyledAddCreateLocationButton isOpen={on} onClick={toggle}>
            {renderWithPermissionsAddExistingLocationIcon}
            {renderWithPermissionsCreateNewLocationIcon}
            <Tooltip.TooltipRegular
              className="fab-icon-tooltip"
              hideTail={true}
              id="add-location-button-tooltip"
              placement="left"
            >
              Add Existing Location(s)
            </Tooltip.TooltipRegular>
            <Tooltip.TooltipRegular
              className="fab-icon-tooltip"
              hideTail={true}
              id="create-new-location-button-tooltip"
              placement="left"
            >
              Create New Location
            </Tooltip.TooltipRegular>
          </StyledAddCreateLocationButton>
        )}
      </Toggleable>
    );
  };

  renderPageSelectActiveAccount = (enabled: boolean, disabled: boolean) => {
    return (
      <PageSelectActiveAccount
        disable={disabled}
        title={'Select an account to associate with this run.'}
      />
    );
  };

  renderAdditionalHeaderFields = () => (
    <>
      <RunCodeHeaderContainer>
        <RunCodeHeaderLabel>{'Account'}</RunCodeHeaderLabel>
        <StyledAccount>
          <StyledRunPageFilters pageKey={PageKey.INVENTORY_RUN_DETAILS}>
            <StyledPageSelectActiveAccount>
              {this.renderWithPermissionsPageSelectActiveAccount}
            </StyledPageSelectActiveAccount>
          </StyledRunPageFilters>
        </StyledAccount>
      </RunCodeHeaderContainer>
      <StyledIconContainer>
        <ReportIconContainer>
          {this.renderGenerateReportModal(
            this.props.selectedInventoryRunDetails.code,
          )}
        </ReportIconContainer>
        <PlusiconContainer>{this.renderExpandingButton()}</PlusiconContainer>
      </StyledIconContainer>
    </>
  );

  setRunName = (e: any, runCode: string) => {
    isANSIx12CompliantAnyLength(e) &&
      this.props.dispatch(setRunNameThunk(e, runCode));
  };
  renderRunNameText = (enabled: boolean, disabled: boolean) => {
    return disabled ? (
      <DisabledRunNameTextBox>
        {this.props.selectedInventoryRunDetails.name}
      </DisabledRunNameTextBox>
    ) : (
      <RunNameTextBox
        value={this.props.selectedInventoryRunDetails.name || ''}
        saveValue={e =>
          this.setRunName(e, this.props.selectedInventoryRunDetails.code)
        }
        placeholderText="Run Name Required"
        validationFn={isANSIx12CompliantAnyLength}
        validationMsgFn={validationMsgFn}
        showErrorUnderline
        showIcon
        allowInputOnError
        selectTextOnEdit
      />
    );
  };

  render() {
    return (
      <HeaderContainer>
        <FlexRow>
          <BackButton onClick={this.onBackButtonClick} />
          {this.renderWithPermissionsRunNameText}
          <RunCodeHeaderContainer>
            <RunCodeHeaderLabel>{'Run Code'}</RunCodeHeaderLabel>
            <RunCodeData>{this.props.selectedInventoryRunDetails.code}</RunCodeData>
          </RunCodeHeaderContainer>
          {this.renderAdditionalHeaderFields()}
        </FlexRow>
      </HeaderContainer>
    );
  }
}

// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    selectedInventoryRunDetails: getInventoryRunDetails(state),
    isFileDownloading:
      state.physicalInventory.generateReportModal.isReportGenerating,
  };
};

const InventoryRunDetailsHeader = connect<IStateProps, IDispatchProp>(
  mapStateToProps,
)(RunDetailsHeader);

/** export physical incventory Runs header */
export { InventoryRunDetailsHeader };
