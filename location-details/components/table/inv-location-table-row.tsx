import { RedBang } from 'components/icon-indicator/indicators/exclamation-point';
import Permissions from 'components/permissions';
import { Tooltip } from 'hss_components';
import {
  acqCostValidator,
  checkAndRemoveDollarSign,
  getExceptionName,
  getFormCodeDesc,
  getImageUrl,
  sequenceValidator,
} from 'modules/physical-inventory/helpers';
import { toggleSingleProductItem } from 'modules/physical-inventory/location-details/act.inventory-location-details';
import {
  AcqToolTipWrapper,
  BadgeWrapper,
  ImageWrapper,
  LocationContainer,
  Pill,
  PillImageWrapper,
  RowContainer,
  StyledAcqCostInput,
  StyledBodyBlack,
  StyledCellContainer,
  StyledCheckbox,
  StyledCheckBoxContainer,
  StyledInput,
  StyledLink,
  StyledLinkContainer,
  StyledMultipleBodyBlack,
  StyledPlainIndicator,
  StyledProductBadge,
  StyledProductImage,
  StyledProductNameCell,
  StyledQuantityRowSelector,
  StyledSeqNumberCell,
  StyledTooltip,
  StyledWrapper,
  ViewLinkContainer,
} from 'modules/physical-inventory/location-details/components/table/inv-location-table-row.styles';
import { getSelectedProductItemIds } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import {
  confirmDeleteLocationEntry,
  handleLearnBarCodeClick,
  openMultiProductModalThunk,
  saveEntryNumber,
  updateProductDetails,
} from 'modules/physical-inventory/location-details/thunk-inventory-location-details';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { ILocationEntry } from 'types/inventory-location-details';
import { IPermissionActions, Permission } from 'types/permissions';
import IDefaultProps from 'types/styled-component-props';

interface IOwnProps {
  /** Location Entry to display the Location Row */
  entry: ILocationEntry;
}
interface IStateProps extends IDefaultProps {
  /** Location Entry to display the Location Row */
  selectedProductItemIds: any;
}
interface ILocalState {
  /** Entry Quantity */
  quantity?: string | number;
}
type IProps = IOwnProps & IStateProps & IDispatchProp & ILocalState;

/** Location Entry Row Component */
class LocationTableRowComponent extends React.Component<IProps> {
  state: ILocalState = {
    quantity: Number(this.props.entry.quantity)
      .toFixed(3)
      .toString(),
  };
  quantitySelectorInput: HTMLInputElement;
  UNSAFE_componentWillReceiveProps(nextProps: IOwnProps) {
    this.setState({
      quantity: Number(nextProps.entry.quantity)
        .toFixed(3)
        .toString(),
    });
  }
  saveSeqNumber = (e: any, entry: ILocationEntry) => {
    if (e && e !== '0') {
      this.props.dispatch(saveEntryNumber(e, entry));
    }
  };
  getUnknownProductBadge = (entry: ILocationEntry) => {
    return (
      <BadgeWrapper>
        <PillImageWrapper>
          <Pill />
        </PillImageWrapper>
        <StyledBodyBlack>Unknown product for "{entry.codeText}"</StyledBodyBlack>
      </BadgeWrapper>
    );
  };
  getMultipleProductBadge = (entry: ILocationEntry) => {
    return (
      <BadgeWrapper>
        <PillImageWrapper>
          <Pill />
        </PillImageWrapper>
        <StyledWrapper>
          <StyledBodyBlack>
            Multiple Products matched for "{entry.codeText}"
          </StyledBodyBlack>
          <StyledMultipleBodyBlack>
            {entry.multipleProductCodes}
          </StyledMultipleBodyBlack>
        </StyledWrapper>
      </BadgeWrapper>
    );
  };
  getProductBadge = (entry: ILocationEntry) => {
    switch (entry.reasonCode && entry.reasonCode.code) {
      case 'NONE':
        return this.getUnknownProductBadge(entry);
      case 'MULTIPLE':
        return this.getMultipleProductBadge(entry);
      default:
        const isNonAbc = entry.pharmacyProduct ? false : true;
        const product = !isNonAbc ? entry.pharmacyProduct : entry.nonABCProduct;
        const images = !isNonAbc ? getImageUrl(entry) : [];
        return (
          <StyledProductNameCell>
            <ImageWrapper>
              <StyledProductImage
                size="small"
                productImages={images}
                isNonAbc={isNonAbc}
              />
            </ImageWrapper>
            {product && (
              <StyledProductBadge
                product={product}
                disableLink={true}
                noSupplierTooltip={true}
              />
            )}
          </StyledProductNameCell>
        );
    }
  };

  onChangeAcqCost = (e: any, entry: ILocationEntry) => {
    const acqCostValue = checkAndRemoveDollarSign(e);
    this.props.dispatch(updateProductDetails(entry, acqCostValue, entry.quantity));
  };
  onChangeQuantity = (qty: any, entry: ILocationEntry) => {
    this.props.dispatch(updateProductDetails(entry, entry.price.toString(), qty));
  };
  renderAcqCost = (enabled: boolean, disabled: boolean, entry: ILocationEntry) => {
    return (
      <>
        <StyledAcqCostInput
          disabled={disabled}
          value={`$${entry.price.toFixed(5)}`}
          id={`acqCost${entry.code}`}
          saveOnKeyStroke={false}
          width={84}
          validationFn={acqCostValidator}
          saveValue={e => this.onChangeAcqCost(e, entry)}
          onKeyDown={this.blurOnEnterOrTab}
        />
        <Tooltip.TooltipRegular
          id={`${entry.code}-acqcost-tooltip`}
          offset={{ top: 4, left: 0 }}
        >
          <StyledTooltip>{`$${entry.price.toFixed(5)}`}</StyledTooltip>
        </Tooltip.TooltipRegular>
      </>
    );
  };
  renderWithPermissionsAcqCost = (entry: ILocationEntry) => {
    return (
      <Permissions
        hasPermissions={[Permission.PI_LOCATION_DETAIL_ACQ_COST_TEXT_FIELD]}
      >
        {({
          [Permission.PI_LOCATION_DETAIL_ACQ_COST_TEXT_FIELD]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) && this.renderAcqCost(enabled, disabled, entry)
        }
      </Permissions>
    );
  };
  getAcqCostElement = (entry: ILocationEntry) => {
    return (
      <AcqToolTipWrapper data-tip data-for={`${entry.code}-acqcost-tooltip`}>
        {this.renderWithPermissionsAcqCost(entry)}
      </AcqToolTipWrapper>
    );
  };
  toggleResolveMultipleProducts = () => {
    this.props.dispatch(
      openMultiProductModalThunk(
        this.props.entry.codeText,
        this.props.entry.code,
        this.props.entry.exceptionQty,
      ),
    );
  };
  learnBarCodeClickHandler = () =>
    this.props.dispatch(handleLearnBarCodeClick(this.props.entry));

  getLinkElements = (props: IProps) => {
    if (props.entry.reasonCode.code === 'MULTIPLE') {
      return (
        <StyledLinkContainer>
          <StyledLink onClick={this.toggleResolveMultipleProducts}>
            Resolve
          </StyledLink>
        </StyledLinkContainer>
      );
    }
    return (
      <StyledLinkContainer>
        <StyledLink onClick={this.learnBarCodeClickHandler}>
          Learn barcode
        </StyledLink>
        or
        <StyledLink onClick={this.onClickDeleteFromLocation}>
          Delete from Location
        </StyledLink>
        {/* {props.entry.scannedBarcode === props.activeBarcode && <LearnBarcodeFlow />} */}
      </StyledLinkContainer>
    );
  };
  setQuantitySelectorInputRef = (ref: HTMLInputElement) => {
    this.quantitySelectorInput = ReactDOM.findDOMNode(ref) as HTMLInputElement;
  };
  onClickDeleteFromLocation = () => {
    this.props.dispatch(confirmDeleteLocationEntry(this.props.entry));
  };
  onChangeProductSelect = (checkedProduct: string) => {
    this.props.dispatch(toggleSingleProductItem(checkedProduct));
  };
  getCheckedProductStatus = () =>
    this.props.selectedProductItemIds.includes(this.props.entry.code);

  updateQtyOnBlur = (id: string, qty: string | number) => {
    const newQty = Number(qty).toFixed(3);
    this.updateProductToBeAddedQty(id, newQty);
    this.onChangeQuantity(newQty, this.props.entry);
  };
  blurOnEnterOrTab = (event: any) => {
    if (event.key.toLowerCase() === 'enter' || event.key.toLowerCase() === 'tab') {
      event.preventDefault();
      event.target.blur();
    }
  };
  updateProductToBeAddedQty = (id: string, qty: string | number) => {
    this.setState({ quantity: qty });
  };
  renderProductQty = (enabled: boolean, disabled: boolean) => {
    return (
      <StyledQuantityRowSelector
        disabled={disabled}
        inputRef={this.setQuantitySelectorInputRef}
        id={`QuantitySelector${this.props.entry.code}`}
        value={this.state.quantity}
        minValue={0.0}
        defaultValue={1}
        maxValue={99999}
        integerOnly={false}
        onQuantityChange={this.updateProductToBeAddedQty}
        onBlur={this.updateQtyOnBlur}
        onKeyDown={this.blurOnEnterOrTab}
        allowedDecimals={3}
      />
    );
  };
  renderWithPermissionsProductQty = () => {
    return (
      <Permissions hasPermissions={[Permission.PI_LOCATION_DETAIL_QTY_SWITCHER]}>
        {({
          [Permission.PI_LOCATION_DETAIL_QTY_SWITCHER]: { enabled, disabled },
        }: IPermissionActions) =>
          (enabled || disabled) && this.renderProductQty(enabled, disabled)
        }
      </Permissions>
    );
  };
  render() {
    const checked = this.getCheckedProductStatus();
    return (
      <RowContainer>
        <LocationContainer>
          <StyledCheckBoxContainer>
            <StyledCheckbox
              checked={checked}
              onChange={e => this.onChangeProductSelect(e)}
              value={this.props.entry.code}
            />
          </StyledCheckBoxContainer>

          <StyledSeqNumberCell>
            <StyledInput
              maxLength={9}
              value={this.props.entry.entryNumber.toString()}
              id={`entryNumber${this.props.entry.code}`}
              saveOnKeyStroke={false}
              validationFn={sequenceValidator}
              saveValue={e => this.saveSeqNumber(e, this.props.entry)}
            />
          </StyledSeqNumberCell>

          {this.getProductBadge(this.props.entry)}

          <StyledCellContainer>
            {getFormCodeDesc(this.props.entry)}
          </StyledCellContainer>

          <StyledCellContainer>
            {this.props.entry.abcSellingSize}
          </StyledCellContainer>

          <StyledCellContainer>
            {this.getAcqCostElement(this.props.entry)}
          </StyledCellContainer>

          <StyledCellContainer>
            {`$${this.props.entry.total.toFixed(5)}`}
          </StyledCellContainer>

          <StyledCellContainer>
            {(this.props.entry.pharmacyProduct || this.props.entry.nonABCProduct) &&
              this.renderWithPermissionsProductQty()}
          </StyledCellContainer>
        </LocationContainer>

        {this.props.entry.reasonCode && (
          <ViewLinkContainer>
            <StyledPlainIndicator
              icon={<RedBang />}
              primaryText={getExceptionName(this.props.entry.reasonCode.code)}
            />
            {this.getLinkElements(this.props)}
          </ViewLinkContainer>
        )}
      </RowContainer>
    );
  }
}

const mapStateToProps = (state: IGlobalState): IStateProps => {
  const selectedProductItemIds = getSelectedProductItemIds(state);
  return {
    selectedProductItemIds,
  };
};
/** Location Entry Row Export */
export const LocationTableRow = connect<IStateProps, IDispatchProp>(mapStateToProps)(
  LocationTableRowComponent,
);
