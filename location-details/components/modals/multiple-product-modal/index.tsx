import { LoadingSpinnerCentered } from 'components/loading-spinner-centered';
import { Fonts, Modal, ModalFooter } from 'hss_components';
import { closeMultiProductModal } from 'modules/physical-inventory/location-details/act.inventory-location-details';
import { ProductRow } from 'modules/physical-inventory/location-details/components/modals/modal-components/product-row';
import { getSortedAbcAndNonAbcProductDetails } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import { addABCProductEntryThunk } from 'modules/physical-inventory/location-details/thunk-inventory-location-details';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IProductDetails } from 'types/abc-non-abc-product';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { ProductRowContainer } from '../search-products/add-product-modal';

interface IStateProps {
  /**
   * Show and Hide multi Product modal
   */
  isMultiProductModalOpen: boolean;

  /**
   * Selected Entry to resolve
   */
  searchQuery: string;

  /**
   * Selected Quantity to resolve
   */
  quantity: string | number;

  /**
   * Show or Hide Spinner
   */
  isLoading: boolean;

  /**
   * Product Data
   */
  productDetails: IProductDetails[];
}

const SubHeading = styled.div`
  padding: 0 0 21px 0;
`;

const Footer = styled(ModalFooter)`
  height: 60px;
`;

const Container = styled.div`
  align-self: flex-end;
  margin-left: auto;
`;

const CancelButton = styled(Fonts.Bold14)`
  cursor: pointer;
  color: ${props => props.theme.colors.brandBlue};
  :hover {
    color: ${props => props.theme.colors.brandLightBlue};
    text-decoration: underline;
  }
`;

type IProps = IStateProps & IDispatchProp;

class MultipleProductsModal extends React.Component<IProps> {
  closeFn = () => {
    this.props.dispatch(closeMultiProductModal());
  };
  subHeading = () => {
    const entryDetails = this.props.searchQuery;
    const text = `There are multiple products associated with the number that you entered - ${entryDetails}. Add the desired product below.`;
    return <SubHeading>{text}</SubHeading>;
  };
  addProducts = (productId: string, qty: number, name: string, type: string) => {
    this.props.dispatch(addABCProductEntryThunk(productId, qty, type));
  };
  renderProductRows = () => {
    return (
      this.props.productDetails &&
      this.props.productDetails.length > 0 &&
      this.props.productDetails.map((product: IProductDetails) => {
        return (
          <>
            <ProductRow
              abcAndNonAbcProduct={product}
              addProductFn={this.addProducts}
              exceptionQty={this.props.quantity}
            />
          </>
        );
      })
    );
  };
  renderModalBody = () => {
    return this.props.isLoading ? (
      <LoadingSpinnerCentered />
    ) : (
      <ProductRowContainer>{this.renderProductRows()}</ProductRowContainer>
    );
  };
  multiProductFooter = () => {
    return (
      <Footer>
        <Container>
          <CancelButton onClick={this.closeFn}>Cancel</CancelButton>
        </Container>
      </Footer>
    );
  };
  render() {
    return (
      this.props.isMultiProductModalOpen &&
      this.props.searchQuery && (
        <Modal
          width={650}
          height={634}
          isOpen={this.props.isMultiProductModalOpen}
          title="Multiple Products"
          customFooter={this.multiProductFooter()}
        >
          {this.subHeading()}
          {this.renderModalBody()}
        </Modal>
      )
    );
  }
}
const mapStateToProps = (state: IGlobalState): IStateProps => {
  const locationDetailsState = state.physicalInventory.inventoryLocationDetails;
  return {
    isMultiProductModalOpen: locationDetailsState.isMultiProductModal,
    productDetails: getSortedAbcAndNonAbcProductDetails(state),
    searchQuery: locationDetailsState.searchQuery,
    isLoading: locationDetailsState.isMultiModalLoading,
    quantity: locationDetailsState.unresolvedQuantity,
  };
};
/** export Multi Product Modal Component */
export const ConnectedMultiProductModal = connect<IStateProps, IDispatchProp, {}>(
  mapStateToProps,
)(MultipleProductsModal);
