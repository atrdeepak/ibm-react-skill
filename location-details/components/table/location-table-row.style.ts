import { PlainIndicator } from 'components/indicators/components';
import { ImageContainer } from 'components/product-badge';
import productImage from 'components/product-image';
import { SimpleProductBadge } from 'components/simple-product-badge';
import {
  blues,
  Checkbox,
  Fonts,
  FormTextInput,
  greys,
  misc,
  NumberSpinner,
  PrimaryIcons,
  TableElements,
} from 'hss_components';
import styled from 'styled-components';

const colors = { ...greys, ...misc, ...blues };

/** Style Table Row */
export const StyledTableRow = styled(TableElements.Row)`
  width: 1216px;
  background-color: ${props => colors.white};
  border: 1px solid ${props => colors.grey2};
  border-radius: 3px;
  height: 100px;
  display: flex;
  flex-flow: row nowrap;
  margin-left: 15px;
`;
/** Style Table cell */
export const StyledTableCell = styled(TableElements.Cell)`
  display: flex;
  text-align: center;
  width: 30px;
`;
/** Style Product Data cell */
export const StyledProductDataCell = styled(StyledTableCell)`
  width: 150px;
  align-items: center;
  vertical-align: middle;
  position: relative;
`;
/** Style cell container */
export const StyledCellContainer = styled.div`
  text-align: center;
  display: inline-block;
  width: 90%;
`;
/** ADD COMMENT */
export const StyledCheckbox = styled(Checkbox)`
  margin-left: 4px;
  border: none;
`;
/** ADD COMMENT */
export const StyledQuantityRowSelector = styled(NumberSpinner)`
  height: 30px;
  font-size: 14px;
  margin-left: 15px;
  input {
    width: 50px;
    padding-left: 10px;
  }
`;
/** ADD COMMENT */
export const StyledInput = styled(FormTextInput)`
  margin-left: 10px;
  div[class*='text-input'] {
    input {
      width: 60px;
      -moz-appearance: textfield;
      height: 30px !important;
      text-align: center;
      padding: 0px 0px 0px 0px;
    }
  }
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  font-size: 14px;
`;
/** ADD COMMENT */
export const ViewLinkContainer = styled.div`
  display: flex;
  white-space: nowrap;
  margin-left: 15px;
  height: 40px;
  width: 1216px;
  border: 1px solid #efefef;
  opacity: 0.88;
  border-radius: 0 0 3px 3px;
  background-color: ${props => colors.grey2};
  align-items: center;
`;
/** ADD COMMENT */
export const StyledPlainIndicator = styled(PlainIndicator)`
  padding-right: 10px;
`;
/** ADD COMMENT */
export const StyledSeqNumberCell = styled(StyledTableCell)`
  width: 100px;
  align-items: center;
  vertical-align: middle;
  input {
    width: 23px;
  }
`;
/** ADD COMMENT */
export const StyledProductNameCell = styled(TableElements.Cell)`
  display: flex;
  flex-flow: row nowrap;
  width: 350px;
  margin-left: -10px;
`;
/** ADD COMMENT */
export const ImageWrapper = styled(ImageContainer)`
  width: 90px;
  height: 100%;
  margin: auto 0;
  margin-right: 8px;
`;
/** ADD COMMENT */
export const StyledProductImage = styled(productImage)`
  flex: 1 0 76px;
  margin: 4px 0px 0px 5px;
  align-self: flex-start;
`;
/** ADD COMMENT */

export const StyledProductBadge = styled(SimpleProductBadge)`
  align-self: flex-start;
  margin-top: 4px;
  div[class*='Supplier'] {
    max-width: 100%;
  }
`;
/** ADD COMMENT */
export const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  width: 365px;
  background-color: ${props => colors.white};
  padding-left: 5px;
`;
/** ADD COMMENT */
export const PillImageWrapper = styled(ImageContainer)`
  width: 75px;
  margin: auto 0;
  background-color: ${props => colors.grey2};
`;
/** ADD COMMENT */
export const Pill = styled(PrimaryIcons.PillSingle)`
  height: 76px;
  width: 76px;
  flex: 1 0 76px;
  align-self: flex-start;
  opacity: 0.5;
`;
/** ADD COMMENT */
export const StyledBodyBlack = Fonts.makeBold(styled(Fonts.Body14)`
  padding-left: 15px;
  margin: 10px 5px 0 0;
  width: 180px;
`);
/** ADD COMMENT */
export const AcqToolTipWrapper = styled.div``;
/** ADD COMMENT */
export const StyledTooltip = styled.div`
  max-width: 120px;
  font-size: 11px;
  color: ${props => colors.grey6};
`;
/** ADD COMMENT */
export const StyledAcqCostInput = styled(FormTextInput)`
  input {
    margin-left: 5px;
    padding-left: 5px;
    padding-right: 10px;
    -moz-appearance: textfield;
    height: 30px !important;
    text-align: center;
  }
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  font-size: 14px;
  margin-left: 4px;
`;
/** ADD COMMENT */
export const StyledLink = styled(Fonts.Body12)`
  color: ${props => colors.brandBlue};
  padding-right: 5px;
  padding-left: 5px;
  cursor: pointer;
  :hover {
    color: ${props => colors.brandLightBlue};
    text-decoration: underline;
  }
`;
/** ADD COMMENT */
export const StyledLinkContainer = styled(Fonts.Body12)`
  display: flex;
`;
/** ADD COMMENT */
export const StyledMultipleBodyBlack = styled(Fonts.Body12)`
  padding-left: 15px;
  padding-top: 5px;
  max-width: 183px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
/** ADD COMMENT */
export const StyledWrapper = styled.div`
  flex-direction: column;
`;
