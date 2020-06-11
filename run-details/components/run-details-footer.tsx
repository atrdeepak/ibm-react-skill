import formatCurrency from 'helpers/format-currency';
import { Fonts } from 'hss_components';
import { getTotalCountAndValueOfLocations } from 'modules/physical-inventory/run-details/inventory-run-details.selectors';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IGlobalState from 'types/global-state';
import { IInventoryRunDetailsTotalCountAndValue } from 'types/inventory-run-details';
import IDefaultProps from 'types/styled-component-props';

interface IFlexProps extends IDefaultProps {
  /**
   * [required] metadata used to populate the fields
   */
  layout?: any;
  /**
   * [required] metadata used to populate the fields
   */
  border?: any;
}

const FlexBoxContainer: React.SFC<IFlexProps> = ({
  className,
  children,
  ...props
}) => {
  return <div className={className}>{children}</div>;
};

const SummaryBannerContainer = styled.div`
  display: flex;
  padding: 10px 48px;
`;

const SummaryContainer = styled.div`
  display: flex;
`;

const FlexBoxColumn = styled(FlexBoxContainer)`
  display: flex;
  flex-direction: column;
  ${props =>
    props.border
      ? `
    border-right: 1px solid ${props.theme.colors.grey3};
    padding-right: 25px;
    margin-right: 25px;`
      : `border-right: '';
    padding-right: 0px;
    margin-rignt: 0px;
  `};
`;

const StyledLabel = styled(Fonts.Body12)`
  color: ${props => props.theme.colors.grey3};
`;

const StyledH2 = styled(Fonts.Display24)`
  color: ${props => props.theme.colors.white};
`;

interface IStateProps {
  /**
   * [required] Total Value and Count Of Locations
   */
  totalCountAndValueOfLocations: IInventoryRunDetailsTotalCountAndValue;
}

type IProps = IStateProps;

/** Inventory Runs Footer Component */
class RunDetailsFooter extends React.Component<IProps> {
  render() {
    return (
      <SummaryBannerContainer>
        <SummaryContainer className="">
          <FlexBoxColumn border={true}>
            <StyledLabel>TOTAL LOCATIONS</StyledLabel>
            <StyledH2>
              {this.props.totalCountAndValueOfLocations.totalCount}
            </StyledH2>
          </FlexBoxColumn>
          <FlexBoxColumn border={false}>
            <StyledLabel>TOTAL COST</StyledLabel>
            <StyledH2>
              $
              {formatCurrency(
                Number(this.props.totalCountAndValueOfLocations.totalValue),
                5,
              )}
            </StyledH2>
          </FlexBoxColumn>
        </SummaryContainer>
      </SummaryBannerContainer>
    );
  }
}

// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState) => {
  return {
    totalCountAndValueOfLocations: getTotalCountAndValueOfLocations(state),
  };
};

const InventoryRunDetailsFooter = connect(mapStateToProps)(RunDetailsFooter);

/** export physical inentory Runs Details Footer */
export { InventoryRunDetailsFooter };
