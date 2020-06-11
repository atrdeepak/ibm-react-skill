import {
  HEADER_USER_BAR_HEIGHT,
  NAVIGATION_BAR_HEIGHT,
  NAVIGATION_BAR_HEIGHT_MINIMIZED,
} from 'components/global-nav';
import { BackNavChevron } from 'components/navigation/breadcrumb/back-chevron-icon';
import Permissions from 'components/permissions';
import {
  AccountTypeLozenge,
  EditableText,
  Fonts,
  FramedButton,
  PlusButton,
} from 'hss_components';
import { getAccountByUid } from 'modules/entities/selectors/accounts.selectors';
import { isANSIx12CompliantAnyLength } from 'modules/forms/validators';
import { setResetFiltersOnNavigationForPageKey } from 'modules/page-filters/act.page-filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import {
  locationValidationMsgFn,
  navigateToRunDetailsPage,
} from 'modules/physical-inventory/helpers';
import {
  closeProductsSearchModal,
  openProductsSearchModal,
} from 'modules/physical-inventory/location-details/act.inventory-location-details';
import { AddProductsGroup } from 'modules/physical-inventory/location-details/components/add-products-group';
import { HeaderIconContainerTag } from 'modules/physical-inventory/location-details/components/header/header-icon-container';
import { SearchProductsModal } from 'modules/physical-inventory/location-details/components/modals/search-products/add-product-modal';
import {
  getInventoryLocationDetails,
  getSelectedProductItemIds,
} from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import {
  addProductsSearchModalThunk,
  setLocationNameThunk,
} from 'modules/physical-inventory/location-details/thunk-inventory-location-details';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IAccount from 'types/account';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IInventoryLocationDetails } from 'types/inventory-location-details';
import { IPermissionActions, Permission } from 'types/permissions';

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
   * [required] Checked Products Ids
   */
  checkedProductIds: any;
  /**
   * [required] sticky header Minimized
   */
  isMinizedStickyHeaderView: boolean;
  /**
   * [required] is global Navigation Minimized
   */
  isGlobalNavMinimized: boolean;
  /**
   * [required] Account Details
   */
  accountDetails: IAccount;
  /**
   * [required] To Open Search Products Modal
   */
  isProductsSearchModalOpen: boolean;
}
const LocationCodeHeaderContainer = styled.div`
  width: auto;
`;
/** styling for back button */
const BackButton = styled(BackNavChevron)`
  cursor: pointer;
  margin-top: 35px;
  height: 32px;
  width: 32px;
`;
const MinifiedHeaderBackButton = styled(BackNavChevron)`
  cursor: pointer;
  margin-top: 16px;
  height: 32px;
  width: 32px;
`;
const DetailsHeaderLabel = styled(Fonts.Body12)`
  color: ${props => props.theme.colors.grey5};
  margin-bottom: 8px;
  padding-left: 15px;
`;
const LocationCodeHeaderLabel = styled(DetailsHeaderLabel)`
  color: ${props => props.theme.colors.grey5};
  margin-bottom: 1px;
  padding-left: 15px;
`;
const StyledAccount = styled(Fonts.Display20)`
  color: ${props => props.theme.colors.grey6};
  padding: 6px 10px 0px 0px;
  font-size: 14px;
  line-height: 19px;
  height: 30px;
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
const StyledAccountTypeLozenge = styled(AccountTypeLozenge)`
  justify-content: space-between;
  height: 12px;
  margin-top: 7px;
`;
const StyledPageSelectActiveAccount = styled.div`
  padding-bottom: 2px;
  border-left: 1px solid ${props => props.theme.colors.grey3};
  display: flex;
  padding: 0px 15px 0px 15px;
`;
const UpperFlexRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 1252px;
  padding: 0px 0px 14px 0px;
  flex: 1 1 auto;
`;
const StickyHeader = styled(UpperFlexRow)`
  position: fixed;
  z-index: 14;
  width: 1253px;
  padding-top: 30px;
  padding-bottom: 31px;
  top: ${() => `${NAVIGATION_BAR_HEIGHT + HEADER_USER_BAR_HEIGHT}px`};
  background: ${props => props.theme.colors.grey1};
  transition: width 2s, height 4s;
`;
const StyledRefinedStickyHeader = styled(StickyHeader)`
  top: ${() => `${NAVIGATION_BAR_HEIGHT_MINIMIZED}px`};
`;
const BasicDisabledTextFeild = styled(EditableText)`
  color: ${props => props.theme.colors.black};
  border-right: ${props => (props.showIcon ? '0px' : '1px')} solid
    ${props => props.theme.colors.grey3};
  padding: ${props => (props.showIcon ? '11px 6px 0 0' : '28px 6px 0 0')};
  font-size: 32px;
  max-width: ${props => (props.showIcon ? '320px' : '220px')};
  a {
    white-space: nowrap;
    font-size: 32px;
    line-height: 36px;
    max-width: ${props => (props.showIcon ? '320px' : '220px')};
    text-overflow: ellipsis;
    overflow: hidden;
    color: ${props => props.theme.colors.grey6};
    :hover {
      color: ${props => props.theme.colors.grey6};
    }
  }
`;
const LocationNameTextBox = styled(BasicDisabledTextFeild)`
  a {
    :hover {
      color: ${props => props.theme.colors.brandLightBlue};
    }
  }
  textarea {
    height: 38px;
    font-size: 26px;
    line-height: 28px;
    width: 350px;
    box-sizing: border-box;
    margin-top: 5px;
    :hover {
      color: ${props => props.theme.colors.brandLightBLue};
    }
  }
  svg {
    padding-bottom: 2px;
  }
`;
const LocationCodeData = styled(Fonts.Body16)`
  white-space: nowrap;
  color: ${props => props.theme.colors.grey6};
  padding: 5px 16px 0 16px;
  height: 30px;
  border-left: 1px solid ${props => props.theme.colors.grey3};
`;
const LowerHeaderContainer = styled.div`
  padding: 5px 10px 15px 10px;
`;
const StyledSearchButton = styled(FramedButton)`
  font-family: Work Sans;
  font-size: 12px;
  height: 32px;
  margin-top: 26px;
  margin-left: -3px;
`;
type IProps = IStateProps & IDispatchProp;
class LocationDetailsHeader extends React.Component<IProps> {
  onBackButtonClick = (runCode: string) => {
    navigateToRunDetailsPage(runCode);
  };
  renderCreateNewLocationButton = () => {
    return (
      <PlusButton
        fill
        floating
        onClick={null}
        showTooltip
        tooltipOffset={{ top: 0 }}
      />
    );
  };
  renderAdditionalUpperHeaderFields = () => {
    return (
      <>
        <LocationCodeHeaderContainer>
          <LocationCodeHeaderLabel>{'Account'}</LocationCodeHeaderLabel>
          {this.props.accountDetails && (
            <StyledPageSelectActiveAccount>
              <StyledAccount>
                {this.props.accountDetails.accountNickname
                  ? this.props.accountDetails.accountNickname
                  : this.props.accountDetails.name}
              </StyledAccount>
              <StyledAccount>{`| ${this.props.accountDetails.uid}`}</StyledAccount>
              <StyledAccountTypeLozenge
                children={this.props.accountDetails.accountType}
              />
            </StyledPageSelectActiveAccount>
          )}
        </LocationCodeHeaderContainer>
        {!this.props.isSearchToggled && (
          <LocationCodeHeaderContainer>
            <LocationCodeHeaderLabel>{'Unit of Measure'}</LocationCodeHeaderLabel>
            <LocationCodeData>
              {this.props.selectedInventoryLocationDetails.unitOfMeasure}
            </LocationCodeData>
          </LocationCodeHeaderContainer>
        )}
        <HeaderIconContainerTag />
      </>
    );
  };
  setLocationName = (e: string, location: IInventoryLocationDetails) => {
    isANSIx12CompliantAnyLength(e) &&
      this.props.dispatch(setLocationNameThunk(e, location));
  };
  getBackButton = () => {
    return (
      <BackButton
        onClick={() =>
          this.onBackButtonClick(this.props.selectedInventoryLocationDetails.runCode)
        }
      />
    );
  };
  getMinifiedBackButton = () => {
    return (
      <MinifiedHeaderBackButton
        onClick={() =>
          this.onBackButtonClick(this.props.selectedInventoryLocationDetails.runCode)
        }
      />
    );
  };
  renderLocationName = (enabled: boolean, disabled: boolean, TextBox: any) => {
    return (
      <TextBox
        value={this.props.selectedInventoryLocationDetails.name}
        saveValue={(e: string) =>
          this.setLocationName(e, this.props.selectedInventoryLocationDetails)
        }
        placeholderText="Location Name Required"
        showErrorUnderline
        showIcon={!this.props.isMinizedStickyHeaderView}
        allowInputOnError
        selectTextOnEdit
        maxLength={42}
        disabled={this.props.isMinizedStickyHeaderView || disabled}
        validationFn={isANSIx12CompliantAnyLength}
        validationMsgFn={locationValidationMsgFn}
      />
    );
  };
  renderWithPermissionsLocationName = (TextBox: any) => {
    return (
      <Permissions
        hasPermissions={[Permission.PI_LOCATION_DETAIL_LOCATION_NAME_EDIT]}
      >
        {({
          [Permission.PI_LOCATION_DETAIL_LOCATION_NAME_EDIT]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) &&
          this.renderLocationName(enabled, disabled, TextBox)
        }
      </Permissions>
    );
  };
  getlocationNameEditableBox = () => {
    const TextBox = this.props.isMinizedStickyHeaderView
      ? BasicDisabledTextFeild
      : LocationNameTextBox;
    return this.renderWithPermissionsLocationName(TextBox);
  };
  getNormalHeader = () => {
    return (
      <UpperFlexRow>
        {this.getMinifiedBackButton()}
        {this.getlocationNameEditableBox()}
        {this.renderAdditionalUpperHeaderFields()}
      </UpperFlexRow>
    );
  };
  dispatchOpenProductsSearchModal = () => {
    this.props.dispatch(openProductsSearchModal());
  };
  dispatchAddProductsSearchModal = (
    productId: string,
    quantity: string | number,
    productName: string,
  ) => {
    this.props.dispatch(
      addProductsSearchModalThunk(
        productId,
        quantity,
        this.props.selectedInventoryLocationDetails.b2bUnitId,
        this.props.selectedInventoryLocationDetails.code,
        productName,
      ),
    );
  };
  dispatchCloseProductsSearchModal = () => {
    this.props.dispatch(closeProductsSearchModal());
  };
  getProductsSearchModal = () => {
    return (
      this.props.isProductsSearchModalOpen && (
        <SearchProductsModal
          addProductFn={this.dispatchAddProductsSearchModal}
          closeFn={this.dispatchCloseProductsSearchModal}
        />
      )
    );
  };
  getStickyHeaderView = () => {
    const StyledHeader = this.props.isGlobalNavMinimized
      ? StyledRefinedStickyHeader
      : StickyHeader;
    return (
      <StyledHeader>
        {this.getBackButton()}
        {this.getlocationNameEditableBox()}
        {this.props.checkedProductIds.length === 0 ? (
          <>
            <AddProductsGroup />
            <LowerHeaderContainer>
              {!this.props.isSearchToggled && (
                <StyledSearchButton
                  small={true}
                  onClick={this.dispatchOpenProductsSearchModal}
                >
                  Search for a Product
                </StyledSearchButton>
              )}
            </LowerHeaderContainer>
            {this.getProductsSearchModal()}
          </>
        ) : (
          <></>
        )}
        <HeaderIconContainerTag />
      </StyledHeader>
    );
  };
  render() {
    return this.props.isMinizedStickyHeaderView
      ? this.getStickyHeaderView()
      : this.getNormalHeader();
  }
  componentDidMount() {
    this.props.dispatch(
      setResetFiltersOnNavigationForPageKey(
        PageKey.INVENTORY_LOCATION_DETAILS,
        true,
      ),
    );
  }
}
const mapStateToProps = (state: IGlobalState): IStateProps => {
  const selectedInventoryLocationDetails = getInventoryLocationDetails(state);
  return {
    selectedInventoryLocationDetails,
    isSearchToggled:
      state.physicalInventory.inventoryLocationDetails.isSearchToggled,
    checkedProductIds: getSelectedProductItemIds(state),
    isMinizedStickyHeaderView:
      state.physicalInventory.inventoryLocationDetails.isMinimized,
    isGlobalNavMinimized: state.globalNav.isMinimized,
    accountDetails: getAccountByUid(
      state,
      selectedInventoryLocationDetails.b2bUnitId,
    ),
    isProductsSearchModalOpen:
      state.physicalInventory.inventoryLocationDetails.isProductsSearchModalOpen,
  };
};
const InventoryLocationDetailsHeader = connect<IStateProps, IDispatchProp>(
  mapStateToProps,
)(LocationDetailsHeader);
/** export physical incventory Locations header */
export { InventoryLocationDetailsHeader };
