import UnstyledCheckedActionButtons from 'components/delete-options';
import Permissions from 'components/permissions';
import {
  ButtonGroup,
  Fonts,
  GenerateReportIconButton,
  IButtonProps,
  lozengeColor,
  Tooltip,
} from 'hss_components';
import { PageSearchFilter } from 'modules/page-filters/filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { PageFilters } from 'modules/page-filters/page-filter-provider';
import { generateReportLocationDetailsModal } from 'modules/physical-inventory/generate-report-modal/thunk.location-details-report-modal';
import {
  setSelectedItemIds,
  toggleExcetionView,
  toggleSearchBar,
} from 'modules/physical-inventory/location-details/act.inventory-location-details';
import {
  getExceptionEntries,
  getInventoryLocationDetails,
  getSelectedProductDetails,
  getSelectedProductItemIds,
} from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import { hideShowCopyLocationModal } from 'modules/physical-inventory/run-details/thunk.inventory-run-details';
import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import {
  IInventoryLocationDetails,
  ILocationEntry,
  IProductsDetail,
} from 'types/inventory-location-details';
import { IPermissionActions, Permission } from 'types/permissions';
import {
  confirmDeleteProducts,
  confirmProductsRefreshAcquisitionCost,
} from '../../thunk-inventory-location-details';

interface IStateProps {
  /**
   * [required] selected inventory Location details
   */
  selectedInventoryLocationDetails: IInventoryLocationDetails;

  /**
   * [required] Search Toggle
   */
  isSearchToggled: boolean;

  /**
   * [required] Exceptions View
   */
  isExceptionsView: boolean;

  /**
   * [required] Checked Products Ids
   */
  checkedProductIds: any;

  /**
   * [required] sticky header Minimized
   */
  exceptionEntries: ILocationEntry[];

  /**
   * [required] Product details (for selected products)
   */
  productsDetail: IProductsDetail;

  /**
   *  For enable and disable the generate  report icon
   */
  isFileDownloading: boolean;
}
type IProps = IStateProps & IDispatchProp;
const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  right: 0;
  width: auto;
  margin-left: auto;
`;
const GenReportIconContainer = styled.div``;
const StyledTooltip = styled.div`
  max-width: 120px;
  font-size: 11px;
  text-align: center;
  color: ${props => props.theme.colors.grey6};
`;
const CheckedActionButtons = styled(UnstyledCheckedActionButtons)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex: 1 1 auto;
`;
const ReportIconContainer = styled.div`
  padding: 20px 0 0 5px;
`;
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
const SearchFilterContainer = styled.div`
  margin-right: -10px;
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex: 1 1 auto;
`;
const StyledButtonGroup = styled(ButtonGroup)`
  padding: 0px 10px 0px 10px;
  min-width: 165px;
`;
class HeaderIconContainer extends React.Component<IProps> {
  buttonValues: IButtonProps[] = [
    { id: 'all', value: 'All' },
    {
      id: 'exceptions',
      value: 'Exceptions',
      numberLozengeBackgroundColor: lozengeColor.red,
      numberDisplay: 0,
    },
  ];
  toggleSearch = () => {
    this.props.dispatch(toggleSearchBar());
  };
  toggleExcetionView = () => {
    this.props.dispatch(toggleExcetionView());
  };
  generateRunLocationDetailsReport = (
    selectedLocationCode: string,
    runCode: string,
  ) => {
    this.props.dispatch(
      generateReportLocationDetailsModal(selectedLocationCode, runCode),
    );
  };
  handleRefreshItemsModal = () => {
    this.props.dispatch(
      confirmProductsRefreshAcquisitionCost(
        this.props.checkedProductIds,
        this.props.selectedInventoryLocationDetails.code,
      ),
    );
  };
  renderGenerateReportIcon = (
    enabled: boolean,
    disabled: boolean,
    selectedLocationCode: string,
    runCode: string,
  ) => {
    return (
      <>
        <StyledGenReportIcon
          isDisabled={this.props.isFileDownloading}
          useHoverEffects
          onClick={() =>
            this.generateRunLocationDetailsReport(selectedLocationCode, runCode)
          }
        />
        <Tooltip.TooltipRegular
          id={`generate-report-tooltip`}
          offset={{ top: 4, left: 0 }}
        >
          <StyledTooltip>
            {this.props.isFileDownloading
              ? 'Report is currently being generated'
              : 'Generate Report'}
          </StyledTooltip>
        </Tooltip.TooltipRegular>
      </>
    );
  };
  renderWithPermissionsGenerateReportIcon = (
    selectedLocationCode: string,
    runCode: string,
  ) => {
    return (
      <Permissions hasPermissions={[Permission.PI_LOCATION_DETAIL_GENERATE_BUTTON]}>
        {({
          [Permission.PI_LOCATION_DETAIL_GENERATE_BUTTON]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) &&
          this.renderGenerateReportIcon(
            enabled,
            disabled,
            selectedLocationCode,
            runCode,
          )
        }
      </Permissions>
    );
  };
  renderGenerateReportModal = (selectedLocationCode: string, runCode: string) => {
    return (
      <GenReportIconContainer data-tip data-for={`generate-report-tooltip`}>
        {this.renderWithPermissionsGenerateReportIcon(selectedLocationCode, runCode)}
      </GenReportIconContainer>
    );
  };
  handleCopyItemsModal = () => {
    this.props.dispatch(
      hideShowCopyLocationModal(this.props.selectedInventoryLocationDetails.code),
    );
  };

  handleClearSelection = () => {
    this.props.dispatch(setSelectedItemIds([]));
  };
  handleDeleteItemsModal = () => {
    const productsDetail = this.props.productsDetail;
    const count = productsDetail.entries.length;
    let message: ReactElement;
    const StyledBody = styled(Fonts.Bold16)`
      display: inline;
    `;

    if (count === 1) {
      const { name, scannedBarcode } = productsDetail.entries[0];
      message =
        name === 'unknown' ? (
          <div>
            Are you sure you want to delete{' '}
            <StyledBody>Unknown Product {scannedBarcode}</StyledBody> from this
            location?
          </div>
        ) : (
          <div>
            Are you sure you want to delete <StyledBody>{name}</StyledBody> from this
            location?
          </div>
        );
    } else {
      message = (
        <div>
          Are you sure you want to delete <StyledBody>{count} products</StyledBody>{' '}
          from this location?
        </div>
      );
    }

    this.props.dispatch(confirmDeleteProducts(productsDetail, message));
  };
  renderCheckedActionButtons = (hidden: boolean) => {
    return hidden ? (
      <CheckedActionButtons
        onDeleteSelect={this.handleDeleteItemsModal}
        onCopySelect={this.handleCopyItemsModal}
        copyButtonTooltip="Copy Products"
        numberDisplay={this.props.checkedProductIds.length}
        isCsosSignaturePending={false}
        isPendingApprovalViewOnly={false}
        showClearSelectionLink
        onClearSelection={this.handleClearSelection}
        productsDetail={this.props.productsDetail}
        handleDeleteItemsModal={this.handleDeleteItemsModal}
      />
    ) : (
      <CheckedActionButtons
        onRefreshSelect={this.handleRefreshItemsModal}
        showRefreshButton={true}
        onDeleteSelect={this.handleDeleteItemsModal}
        onCopySelect={this.handleCopyItemsModal}
        copyButtonTooltip="Copy Products"
        numberDisplay={this.props.checkedProductIds.length}
        isCsosSignaturePending={false}
        isPendingApprovalViewOnly={false}
        showClearSelectionLink
        onClearSelection={this.handleClearSelection}
        productsDetail={this.props.productsDetail}
        handleDeleteItemsModal={this.handleDeleteItemsModal}
      />
    );
  };
  renderWithPermissionsCheckedActionButtons = () => {
    return (
      <Permissions hasPermissions={[Permission.PI_LOCATION_DETAIL_REFRESH_ACQ_COST]}>
        {({
          [Permission.PI_LOCATION_DETAIL_REFRESH_ACQ_COST]: { hidden },
        }: IPermissionActions) => this.renderCheckedActionButtons(hidden)}
      </Permissions>
    );
  };
  render() {
    const viewSelected = this.props.isExceptionsView
      ? this.buttonValues[1].id
      : this.buttonValues[0].id;
    this.buttonValues[1].numberDisplay = Object.keys(
      this.props.exceptionEntries,
    ).length;
    return (
      <StyledIconContainer>
        {this.props.checkedProductIds.length === 0 ? (
          <>
            <SearchFilterContainer>
              <PageFilters pageKey={PageKey.INVENTORY_LOCATION_DETAILS}>
                <PageSearchFilter
                  placeholder="Search Products ..."
                  toggleSearch={this.toggleSearch}
                  isSearchActive={this.props.isSearchToggled}
                  customWidth={235}
                />
              </PageFilters>
            </SearchFilterContainer>
            <StyledButtonGroup
              buttons={this.buttonValues}
              label="Show"
              onOptionSelect={this.toggleExcetionView}
              currentSelected={viewSelected}
            />
            <ReportIconContainer>
              {this.renderGenerateReportModal(
                this.props.selectedInventoryLocationDetails.code,
                this.props.selectedInventoryLocationDetails.runCode,
              )}
            </ReportIconContainer>
          </>
        ) : (
          this.renderWithPermissionsCheckedActionButtons()
        )}
      </StyledIconContainer>
    );
  }
}
const mapStateToProps = (state: IGlobalState): IStateProps => {
  const selectedInventoryLocationDetails = getInventoryLocationDetails(state);
  return {
    selectedInventoryLocationDetails,
    isSearchToggled:
      state.physicalInventory.inventoryLocationDetails.isSearchToggled,
    isExceptionsView:
      state.physicalInventory.inventoryLocationDetails.isExceptionsView,
    checkedProductIds: getSelectedProductItemIds(state),
    exceptionEntries: getExceptionEntries(state),
    productsDetail: getSelectedProductDetails(state),
    isFileDownloading:
      state.physicalInventory.generateReportModal.isReportGenerating,
  };
};
const HeaderIconContainerTag = connect<IStateProps, IDispatchProp>(mapStateToProps)(
  HeaderIconContainer,
);
/** export physical incventory Locations header */
export { HeaderIconContainerTag };
