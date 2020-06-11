import { FramedButton } from 'hss_components';
import {
  closeProductsSearchModal,
  openProductsSearchModal,
} from 'modules/physical-inventory/location-details/act.inventory-location-details';
import { AddProductsGroup } from 'modules/physical-inventory/location-details/components/add-products-group';
import { SearchProductsModal } from 'modules/physical-inventory/location-details/components/modals/search-products/add-product-modal';
import { getInventoryLocationDetails } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import { addProductsSearchModalThunk } from 'modules/physical-inventory/location-details/thunk-inventory-location-details';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IInventoryLocationDetails } from 'types/inventory-location-details';

interface IStateProps {
  /**
   * [required] selected inventory Location details
   */
  selectedInventoryLocationDetails: IInventoryLocationDetails;
  /**
   * [optional] seach text
   */
  searchText: string;
  /**
   * [required] Quantity for product associated with number spinner
   */
  quantity: string | number;
  /**
   * [optional] show hide error message
   */
  showSearchTextErrorMsg: boolean;
  isMinizedStickyHeaderView: boolean;
  /**
   * [required] To Open Search Products Modal
   */
  isProductsSearchModalOpen: boolean;
}

const LowerFlexRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 8px 0px 0px 0px;
  margin-left: 25px;
`;
const EmptyFlexRow = styled(LowerFlexRow)`
  height: 80px;
`;
const StyledSearchButton = styled(FramedButton)`
  font-family: Work Sans;
  font-size: 12px;
  height: 32px;
  margin-top: 26px;
  margin-left: -3px;
`;
const LowerHeaderContainer = styled.div`
  padding: 5px 10px 0px 10px;
`;

type IProps = IStateProps & IDispatchProp;

class LocationDetailsSubHeader extends React.Component<IProps> {
  dispatchCloseProductsSearchModal = () => {
    this.props.dispatch(closeProductsSearchModal());
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

  getHeaderBody = () => {
    return (
      <>
        <AddProductsGroup />
        <LowerHeaderContainer>
          <StyledSearchButton
            small={true}
            onClick={this.dispatchOpenProductsSearchModal}
          >
            Search for a Product
          </StyledSearchButton>
        </LowerHeaderContainer>
        {this.getProductsSearchModal()}
      </>
    );
  };

  render() {
    const HeaderRow = this.props.isMinizedStickyHeaderView
      ? EmptyFlexRow
      : LowerFlexRow;
    return (
      <>
        <HeaderRow>
          {!this.props.isMinizedStickyHeaderView && this.getHeaderBody()}
        </HeaderRow>
      </>
    );
  }
}
// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    selectedInventoryLocationDetails: getInventoryLocationDetails(state),
    searchText: state.physicalInventory.inventoryLocationDetails.tenKeySearchText,
    showSearchTextErrorMsg:
      state.physicalInventory.inventoryLocationDetails.toggleErrorMessage,
    quantity: state.physicalInventory.inventoryLocationDetails.quantity,
    isMinizedStickyHeaderView:
      state.physicalInventory.inventoryLocationDetails.isMinimized,
    isProductsSearchModalOpen:
      state.physicalInventory.inventoryLocationDetails.isProductsSearchModalOpen,
  };
};

const InventoryLocationDetailsSubHeader = connect<IStateProps, IDispatchProp>(
  mapStateToProps,
)(LocationDetailsSubHeader);

/** export physical incventory Locations header */
export { InventoryLocationDetailsSubHeader };
