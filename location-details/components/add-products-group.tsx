import {
  BlueFramedButton,
  Fonts,
  FormTextInput,
  NumberSpinner,
} from 'hss_components';
import { debounce } from 'lodash';
import {
  toggleAddEntryErrorMessage,
  updateProductQuantity,
} from 'modules/physical-inventory/location-details/act.inventory-location-details';
import { addProductByTenKeyThunk } from 'modules/physical-inventory/location-details/thunk-inventory-location-details';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';

interface IStateProps {
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

  isMinimized: boolean;
}
const AddProductGroupSection = styled.div`
  display: flex;
`;
const LowerHeaderContainer = styled.div`
  padding: 5px 10px 0px 10px;
  width: auto;
`;
const AddProductLowerHeaderContainer = styled.div`
  padding: 10px 10px 0px 10px;
  width: auto;
`;
const LowerHeaderLabel = styled(Fonts.Body12)`
  color: ${props => props.theme.colors.grey5};
  margin-bottom: 0px;
  margin-top: 3px;
`;
const StyledFormTextInput = styled(FormTextInput)`
  input {
    -moz-appearance: textfield;
    box-shadow: none;
  }
  font-size: 14px;
  line-height: 16px;
`;
const ErrorContainer = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.red};
  margin-top: -20px;
  margin-bottom: -10px;
  padding-left: 10px;
`;
const StyledQuantitySelector = styled(NumberSpinner)`
  height: 33px;
  font-size: 14px;
  input {
    width: 43px;
  }
  background-color: ${props => props.theme.colors.white};
  margin-top: 30%;
`;
const StyledButtonFrame = styled.div`
  border-right: 1px solid ${props => props.theme.colors.grey3};
  margin-top: 28%;
  padding-right: 16px;
  :hover {
    color: ${props => props.theme.colors.brandLightBlue};
  }
`;
const StyledFramedButton = styled(BlueFramedButton)`
  margin-top: 1px;
  height: 32px;
  min-width: 25px;

  &:disabled {
    color: ${props => props.theme.colors.white};
  }
`;
const Group = styled.div`
  display: box;
`;
const StyledAddText = styled(Fonts.Body12)`
  margin-top: -3px;
`;
type IProps = IStateProps & IDispatchProp;
const getDebouncedUpdateQuantity = (fn: any) =>
  fn ? debounce(fn, 100, { leading: true, trailing: false }) : undefined;

class AddProductsGroupComponent extends React.Component<IProps> {
  state = {
    searchText: '',
  };
  searchTextInput: HTMLElement;
  quantitySelectorInput: HTMLElement;
  addButton: HTMLElement;
  debouncedUpdateQty = getDebouncedUpdateQuantity((id: string, quantity: string) =>
    this.props.dispatch(updateProductQuantity(id, quantity)),
  );
  setSearchTextInputRef = (ref: HTMLElement) => {
    this.searchTextInput = ReactDOM.findDOMNode(ref) as HTMLElement;
  };
  setQuantitySelectorInputRef = (ref: HTMLElement) => {
    this.quantitySelectorInput = ReactDOM.findDOMNode(ref) as HTMLElement;
  };
  setButtonRef = (ref: HTMLElement) => {
    this.addButton = ReactDOM.findDOMNode(ref) as HTMLElement;
  };
  updateOnInputTextChange = (searchText: string) => {
    this.setState({ searchText });
  };
  toggleSearchTextErrorMsg = () => {
    return this.props.showSearchTextErrorMsg ? (
      <ErrorContainer>
        Please enter at least two (2) alpha-numeric characters.
      </ErrorContainer>
    ) : null;
  };
  updateQtyOnBlur = (id: string, quantity: string | number) => {
    const newQty = Number(quantity).toFixed(3);
    this.props.dispatch(updateProductQuantity(id, newQty));
  };
  updateProductToBeAddedQty = (id: string, quantity: string | number) => {
    this.debouncedUpdateQty(id, quantity);
  };
  handleAddButtonClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (!this.state.searchText || this.state.searchText.length < 2) {
      // Validations
      this.props.dispatch(toggleAddEntryErrorMessage());
      this.searchTextInput.focus();
    } else {
      this.props.dispatch(
        addProductByTenKeyThunk(this.state.searchText, Number(this.props.quantity)),
      );
      this.setState({ searchText: '' }, () => {
        this.searchTextInput.focus();
      });
    }
  };
  quantitySelectorKeyDownHandler = (event: any) => {
    if (event.key.toLowerCase() === 'enter' || event.key.toLowerCase() === 'tab') {
      event.preventDefault();
      this.addButton.focus();
    }
  };
  searchTextKeyDown = (event: any) => {
    if (event.key.toLowerCase() === 'enter' || event.key.toLowerCase() === 'tab') {
      event.preventDefault();
      if (!this.state.searchText || this.state.searchText.length < 2) {
        // Validations
        this.props.dispatch(toggleAddEntryErrorMessage());
      }
      this.quantitySelectorInput.focus();
    }
  };
  onSearchTextBlur = (event: any) => {
    if (this.props.showSearchTextErrorMsg) {
      this.props.dispatch(toggleAddEntryErrorMessage());
    }
  };
  render() {
    const quantity =
      this.props.quantity !== null && this.props.quantity !== ''
        ? this.props.quantity
        : '';
    const disabled = this.state.searchText === '';
    return (
      <Group>
        <AddProductGroupSection>
          <AddProductLowerHeaderContainer>
            <LowerHeaderLabel>{'Add a Product'}</LowerHeaderLabel>
            <StyledFormTextInput
              inputRef={this.setSearchTextInputRef}
              width={this.props.isMinimized ? 200 : 286}
              height={32}
              placeholder="Enter ABC #, UPC or NDC"
              saveOnKeyStroke={true}
              value={this.state.searchText}
              maxLength={40}
              styleAsError={this.props.showSearchTextErrorMsg}
              saveValue={this.updateOnInputTextChange}
              onKeyDown={this.searchTextKeyDown}
              onBlur={this.onSearchTextBlur}
            />
          </AddProductLowerHeaderContainer>
          <LowerHeaderContainer>
            <StyledQuantitySelector
              id="locationSearchQuantitySelector"
              inputRef={this.setQuantitySelectorInputRef}
              value={quantity === 0 ? quantity.toFixed(3) : quantity}
              minValue={0.0}
              defaultValue={1}
              maxValue={99999}
              integerOnly={false}
              onQuantityChange={this.updateProductToBeAddedQty}
              onBlur={this.updateQtyOnBlur}
              allowedDecimals={3}
              onKeyDown={this.quantitySelectorKeyDownHandler}
            />
          </LowerHeaderContainer>
          <LowerHeaderContainer>
            <StyledButtonFrame>
              <StyledFramedButton
                disabled={disabled}
                onClick={this.handleAddButtonClick}
                buttonRef={this.setButtonRef}
              >
                <StyledAddText>Add </StyledAddText>
              </StyledFramedButton>
            </StyledButtonFrame>
          </LowerHeaderContainer>
        </AddProductGroupSection>
        <br />
        {this.toggleSearchTextErrorMsg()}
      </Group>
    );
  }
}
// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    searchText: state.physicalInventory.inventoryLocationDetails.tenKeySearchText,
    showSearchTextErrorMsg:
      state.physicalInventory.inventoryLocationDetails.toggleErrorMessage,
    quantity: state.physicalInventory.inventoryLocationDetails.quantity,
    isMinimized: state.physicalInventory.inventoryLocationDetails.isMinimized,
  };
};

const AddProductsGroup = connect<IStateProps, IDispatchProp>(mapStateToProps)(
  AddProductsGroupComponent,
);

/** export physical incventory Locations header */
export { AddProductsGroup };
