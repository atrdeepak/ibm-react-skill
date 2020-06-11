import { StyledQuantitySelector } from 'components/simple-product-badge/shared-styles';
import { getFormattedCurrencyWithDollarSignRightTrim } from 'helpers/format-currency';
import { Buttons, Fonts, Lozenge, Tooltip } from 'hss_components';
import React from 'react';
import styled from 'styled-components';
import { IProductDetails } from 'types/abc-non-abc-product';
import IDefaultProps from 'types/styled-component-props';

interface IOwnProps extends IDefaultProps {
  /**
   * [required] ABC and Non-ABC Product for this row
   * We fetch the entire ABC and Non-ABC product in order to use the Contextual Search
   * component, so that product is passed into this component to render
   */
  abcAndNonAbcProduct: IProductDetails;
  /** [required] Function to call when adding this Non-ABC product */
  addProductFn: (
    productId: string,
    quantity: string | number,
    productName: string,
    productType?: string,
  ) => void;

  exceptionQty: string | number;
}
interface IState {
  quantity: number | string;
}

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 12px;
  margin-right: 12px;
  border: 1px solid ${props => props.theme.colors.grey2};
  border-radius: 3px;
  box-sizing: border-box;
`;

const ProductInfo = styled(Fonts.Body12)`
  width: 40%;
`;
const ProductName = styled(Fonts.Bold14)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 275px;
`;
const ItemTypeContainer = styled.div`
  padding-left: 10px;
`;
const ProductNameItemTypeContainer = styled.div`
  display: flex;
`;
const ProductNumber = styled(Fonts.Bold12)``;
const AddContainer = styled(Fonts.Body12)`
  display: flex;
  height: 100%;
  margin-left: auto;
`;
const SupplierName = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 250px;
`;
const PriceContainer = styled.div`
  padding: 20px 10px 0 15px;
`;
const StyledAddButton = styled(Buttons.Primary)`
  margin-left: 12px;
  height: 30px;
  min-width: 82px;
  margin-top: 12px;
`;
const ItemTypeLozenge = styled(Lozenge)`
  margin-right: 4px;
  text-transform: uppercase;
`;

const QuantitySpinner = styled(StyledQuantitySelector)`
  input {
    width: 44px;
  }
`;
const ProductNameToolTipWrapper = styled.div``;
const StyledTooltip = styled.div`
  max-width: 250px;
  font-size: 11px;
  color: ${props => props.theme.colors.grey6};
`;
const StyledRow = styled(Row)`
  height: 80px;
  width: 580px;
  display: flex;
  margin-right: 5px;
`;
/** Row component for Add Product Modal */
export class ProductRow extends React.Component<IOwnProps, IState> {
  state: IState = {
    quantity: Number(this.props.exceptionQty).toFixed(3),
  };
  updateQuantity = (code: string, quantity: number) => {
    this.setState({ quantity });
  };
  updateQuantityOnBlur = (code: string, quantity: number) => {
    const newQty = Number(quantity).toFixed(3);
    this.setState({ quantity: newQty });
  };
  keyDownQty = (event: any) => {
    if (event.key.toLowerCase() === 'enter' || event.key.toLowerCase() === 'tab') {
      event.preventDefault();
      event.target.blur();
    }
  };
  render() {
    const product = this.props.abcAndNonAbcProduct;
    return (
      <StyledRow>
        <ProductInfo>
          <ProductNameItemTypeContainer>
            <ProductNameToolTipWrapper
              data-tip
              data-for={`${product.code}-productName-tooltip`}
            >
              <ProductName>{product.name}</ProductName>
              {product.name && product.name.length > 30 && (
                <Tooltip.TooltipRegular
                  id={`${product.code}-productName-tooltip`}
                  offset={{ top: 4, left: 0 }}
                >
                  <StyledTooltip>{product.name}</StyledTooltip>
                </Tooltip.TooltipRegular>
              )}
            </ProductNameToolTipWrapper>
            <ItemTypeContainer>
              {product.itemType === 'NONABC' && (
                <ItemTypeLozenge>NON-ABC</ItemTypeLozenge>
              )}
            </ItemTypeContainer>
          </ProductNameItemTypeContainer>
          <ProductNumber>
            {product.itemType === 'NONABC'
              ? product.customerItemNumber || product.code
              : product.code}
          </ProductNumber>
          <div>{product.ndc}</div>
          <ProductNameToolTipWrapper
            data-tip
            data-for={`${product.code}-SupplierName-tooltip`}
          >
            <SupplierName>{product.supplierName}</SupplierName>
            {product.supplierName && product.supplierName.length > 30 && (
              <Tooltip.TooltipRegular
                id={`${product.code}-SupplierName-tooltip`}
                offset={{ top: 4, left: 0 }}
              >
                <StyledTooltip>{product.supplierName}</StyledTooltip>
              </Tooltip.TooltipRegular>
            )}
          </ProductNameToolTipWrapper>
        </ProductInfo>
        <AddContainer>
          <PriceContainer>
            {product.acquistionCost &&
              getFormattedCurrencyWithDollarSignRightTrim(
                Number(product.acquistionCost),
                5,
                5,
              )}
          </PriceContainer>
          <QuantitySpinner
            id={`productQuantitySelector`}
            value={
              this.state.quantity === 1
                ? this.state.quantity.toFixed(3)
                : this.state.quantity
            }
            minValue={0.0}
            defaultValue={1.0}
            maxValue={999999999}
            allowedDecimals={3}
            integerOnly={false}
            onQuantityChange={this.updateQuantity}
            onBlur={this.updateQuantityOnBlur}
            onKeyDown={this.keyDownQty}
          />
          <StyledAddButton
            onClick={() =>
              this.props.addProductFn(
                product.code,
                this.state.quantity,
                product.name,
                product.itemType,
              )
            }
          >
            Add
          </StyledAddButton>
        </AddContainer>
      </StyledRow>
    );
  }
}
