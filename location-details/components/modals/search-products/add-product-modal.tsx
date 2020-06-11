import {
  EmptyStateIcons,
  Fonts,
  LoadingSpinner,
  Modal,
  PageSearch,
} from 'hss_components';
import { ProductRow as AddProductRow } from 'modules/physical-inventory/location-details/components/modals/modal-components/product-row';
import { getSortedAbcAndNonAbcProductDetails } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import { fetchSearchProductsThunk } from 'modules/physical-inventory/location-details/thunk-inventory-location-details';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IProductDetails } from 'types/abc-non-abc-product';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';

interface IOwnProps {
  /** [required] Passthrough function for adding the Non ABC product */
  addProductFn: (
    productId: string,
    quantity: string | number,
    productName: string,
  ) => void;
  /** [required] Function to fire when modal closes */
  closeFn: () => void;
}

interface IStateProps {
  /** List of Non-ABC Products to display */
  productDetails: IProductDetails[];
  /** Acitve b2bUnit for searching products */
  activeB2bUnit: string;
}

interface IState {
  /** Is the modal loading initial products */
  isLoading: boolean;
  /** Search Product text to find */
  searchProductText: string;
}

const initialState: IState = {
  isLoading: true,
  searchProductText: '',
};

const LoadingSpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  margin-top: 215px;
`;

const RenderEmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  margin-top: 135px;
`;

const StyledEmptyStateQuickAdd = styled(EmptyStateIcons.EmptyQuickAdd)`
  margin: auto;
  display: block;
  width: 138.24px;
  height: 138.24px;
  padding-top: 170px;
`;

const NoSearchText = styled(Fonts.Display24)`
  margin-top: 15px;
  text-align: center;
  color: ${props => props.theme.colors.grey5};
`;

/** Products Row container */
export const ProductRowContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 415px;
`;

/** Search schema for Non-ABC Contextual Search */
export const searchSchema = {
  description: 'string',
  productId: 'string', // This is Non-ABC ID
  ndc: 'string',
  customerItemNumber: 'string',
};

const SearchboxContainer = styled.div`
  padding-top: 16px;
`;

const StyledSearchBox = styled(PageSearch)`
  padding: 8px 0px;
  width: 95%;
`;

const EmptyStateIcon = styled(EmptyStateIcons.DataNotFound)`
  height: 140px;
`;

const NoResultsText = styled(Fonts.Display24)`
  margin-top: 15px;
  color: ${props => props.theme.colors.grey5};
  text-align: center;
`;

type IProps = IOwnProps & IStateProps & IDispatchProp;
class UnconnectedAddAbcAndNonAbcProductList extends React.Component<IProps, {}> {
  state = initialState;

  async componentDidMount() {
    this.setState({ isLoading: false });
  }

  renderRow = (productDetails: any) => {
    return productDetails.map((product: any) => {
      return (
        <>
          <AddProductRow
            abcAndNonAbcProduct={product}
            addProductFn={this.props.addProductFn}
            exceptionQty="1"
          />
        </>
      );
    });
  };

  renderSearchBoxContent() {
    const onSearch = (searchProductText: string) => {
      this.setState({ searchProductText });
    };
    const onSubmit = async () => {
      this.setState({ isLoading: true });
      try {
        await this.props.dispatch(
          fetchSearchProductsThunk(
            this.state.searchProductText,
            this.props.activeB2bUnit,
          ),
        );
      } finally {
        this.setState({ isLoading: false });
      }
    };
    return (
      <SearchboxContainer>
        <StyledSearchBox
          searchFn={onSearch}
          searchText={this.state.searchProductText}
          isSearchActive={true}
          autoFocus={false}
          placeholder="Enter product description or number and hit enter"
          onEnterKeyPress={onSubmit}
        />
      </SearchboxContainer>
    );
  }

  renderSearchBox() {
    return this.state.isLoading ? (
      <LoadingSpinnerContainer>
        <LoadingSpinner />
      </LoadingSpinnerContainer>
    ) : (
      this.renderSearchBoxContent()
    );
  }
  renderEmptyState = () => (
    <RenderEmptyStateContainer>
      <EmptyStateIcon />
      <NoResultsText>No Products</NoResultsText>
    </RenderEmptyStateContainer>
  );
  render() {
    const footerConfig = {
      closeFn: this.props.closeFn,
      hideConfirmBtn: true,
    };
    return (
      <Modal
        title="Add Product"
        isOpen={true}
        height={634}
        width={650}
        footer={footerConfig}
      >
        {this.renderSearchBox()}
        {this.props.productDetails &&
          this.props.productDetails.length > 0 &&
          this.state.isLoading === false && (
            <ProductRowContainer>
              {this.renderRow(this.props.productDetails)}
            </ProductRowContainer>
          )}
        {this.props.productDetails &&
          this.props.productDetails.length === 0 &&
          this.state.isLoading === false &&
          this.renderEmptyState()}
        {this.state.isLoading === false && (
          <>
            <StyledEmptyStateQuickAdd />
            <NoSearchText>Search Products</NoSearchText>
          </>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (state: IGlobalState): any => ({
  productDetails: getSortedAbcAndNonAbcProductDetails(state),
  activeB2bUnit: state.entities.inventoryLocationDetails.b2bUnitId,
});

/**
 * Non-ABC Product search, the modal will load Non-ABC products by the active
 * b2b unit, and you can apply contextual search to find the desired product.
 */
export const SearchProductsModal = connect<IStateProps, IDispatchProp, IOwnProps>(
  mapStateToProps,
)(UnconnectedAddAbcAndNonAbcProductList);
