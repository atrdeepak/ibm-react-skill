import EmptyState, { EmptyStateIcon } from 'components/empty-state';
import {
  Buttons,
  CheckboxWithLabel,
  colors,
  Fonts,
  FramelessButton,
  Modal,
  ModalFooter,
  RadioButton,
} from 'hss_components';
import { setPageFilterSearchTerm } from 'modules/page-filters/act.page-filters';
import { PageSearchFilter } from 'modules/page-filters/filters';
import { PageFilters } from 'modules/page-filters/page-filter-provider';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';

const ScrollableDiv = styled.div`
  overflow-y: auto;
  height: 400px;
  margin-right: -15px;
`;

const StyledTh = styled.th`
  border-bottom: solid 1px ${props => props.theme.colors.grey3};
  border-top: solid 1px ${props => props.theme.colors.grey3};
  padding: 10px 0;
  width: 50%;
  box-sizing: border-box;
  text-align: left;
`;

const StyledTr = styled.tr`
  &:first-child td {
    padding: 16px 0 8px 0;
  }
  &:hover {
    background-color: ${props => props.theme.colors.grey2};
  }
`;

const StyledTd = styled.td`
  padding: 8px 0;
  width: 50%;
  box-sizing: border-box;
`;

const StyledTable = styled.table`
  width: 98%;
  border-collapse: collapse;
`;

const CenteredRadioButton = styled(RadioButton)`
  align-items: center;
`;

const StyledPageFilter = styled(PageFilters)`
  display: block;
  margin: 0 0 15px 0;

  div[class*='page-search'] > div {
    width: 100% !important;
  }
`;

const StyledEmptyState = styled(EmptyState)`
  margin-left: 50%;
  width: 100%;
  margin-top: 25%;
`;

const StyledDiv = styled.div`
  padding-left: 30px;
`;

/** Style for create run modal header */
const HeaderContainer = styled.div`
  display: flex;
  padding: 24px 29px 8px 24px;
`;

/** Input field for create runs modal */
const SubHeading = styled.div`
  padding: 0 0 15px 0;
`;

const CheckBoxContainer = styled.div`
  width: 60%;
  margin-top: 9px;
  div[class*='with-label__CheckBoxText'] {
    margin-left: 0px;
  }
`;

const StyledCheckboxLabel = styled(Fonts.Body14)`
  margin-top: 2px;
`;
const FooterWrapper = styled(ModalFooter)`
  display: flex;
`;
const ButtonContainer = styled.div`
  display: flex;
`;

const CancelCopyButton = styled(FramelessButton)`
  margin-right: 37px;
`;
interface IStateProps {
  /**
   * Show modal
   */
  showModal: boolean;
  /**
   * modal header title
   */
  headerTitle: string;
  /**
   * Show modal
   */
  isDeleteLocation: boolean;
  /**
   * destination Location Code to copy products to
   */
  destinationLocationCode: string;
  /**
   * Location list
   */
  locationList: string[];
  /**
   * Selected Location code
   */
  selectedLocationCode: string;
  /**
   * destination location code to be copied
   */
  selectedDestinationCode: string;
  /**
   * close modal
   */
  closeModal: () => void;
  /**
   * copy location method
   */
  copyLocation: () => void;
  /**
   * delete After Copy method
   */
  deleteAfterCopyCheck: () => void;
  /**
   * update location selection
   */
  updateSelectedLocation: (updatedLocationCode: string) => void;
  /**
   * page key for search
   */
  pageKey: string;
}

type IProps = IStateProps & IDispatchProp;
class CopyLocationModal extends React.Component<IProps> {
  deleteAfterCopyCheckFn = () => {
    this.props.deleteAfterCopyCheck();
  };

  closeModalFn = () => {
    this.props.closeModal();
    this.props.dispatch(setPageFilterSearchTerm(this.props.pageKey, ''));
  };

  copyLocationFn = () => {
    this.props.copyLocation();
  };

  renderModalHeader = (title: string) => (
    <HeaderContainer>
      <Fonts.Display32 color={colors.grey6}>{title}</Fonts.Display32>
    </HeaderContainer>
  );

  updateSelectedLocationFn = (updatedLocationCode: string) => {
    this.props.updateSelectedLocation(updatedLocationCode);
  };

  renderRows = () => {
    {
      return this.props.locationList.length > 0 ? (
        <>
          {this.props.locationList.map((location: any, key) => {
            return this.props.selectedLocationCode !== location.code ? (
              <StyledTr key={key}>
                <StyledTd>
                  <CenteredRadioButton
                    name={`locationCodeRadio`}
                    value={location.code}
                    checked={
                      this.props.selectedDestinationCode === location.code
                        ? true
                        : false
                    }
                    onChange={() => this.updateSelectedLocationFn(location.code)}
                  >
                    <div>
                      <Fonts.Body16>{location.name}</Fonts.Body16>
                    </div>
                  </CenteredRadioButton>
                </StyledTd>

                <StyledTd>
                  {location.b2bUnit.name} | {location.b2bUnit.uid}
                </StyledTd>
              </StyledTr>
            ) : (
              ''
            );
          })}
        </>
      ) : (
        <StyledEmptyState
          mainText="No Locations"
          type={EmptyStateIcon.NO_SEARCH_RESULTS}
        />
      );
    }
  };

  renderSearchAndAccountSelection = () => {
    return (
      <div>
        <StyledPageFilter pageKey={this.props.pageKey}>
          <PageSearchFilter isSearchActive={true} placeholder="Search Locations" />
        </StyledPageFilter>

        <ScrollableDiv>
          <StyledTable>
            <thead>
              <tr>
                <StyledTh>
                  <StyledDiv>
                    <Fonts.Body12>Location</Fonts.Body12>
                  </StyledDiv>
                </StyledTh>
                <StyledTh>
                  <Fonts.Body12>Account</Fonts.Body12>
                </StyledTh>
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </StyledTable>
        </ScrollableDiv>
      </div>
    );
  };

  rendercustomFooter = () => {
    return (
      <FooterWrapper>
        <CheckBoxContainer>
          <CheckboxWithLabel
            onChange={this.deleteAfterCopyCheckFn}
            checked={this.props.isDeleteLocation}
          >
            <StyledCheckboxLabel>Delete after copy</StyledCheckboxLabel>
          </CheckboxWithLabel>
        </CheckBoxContainer>
        <ButtonContainer>
          <CancelCopyButton onClick={this.closeModalFn}>
            <Fonts.Bold14>Cancel</Fonts.Bold14>
          </CancelCopyButton>
          <Buttons.Primary
            disabled={this.props.destinationLocationCode ? false : true}
            onClick={this.copyLocationFn}
          >
            Copy
          </Buttons.Primary>
        </ButtonContainer>
      </FooterWrapper>
    );
  };

  render() {
    return this.props.showModal ? (
      <Modal
        width={684}
        height={635}
        customHeader={this.renderModalHeader(this.props.headerTitle)}
        customFooter={this.rendercustomFooter()}
        isOpen={true}
        contentLabel="Copy Products to a Location"
      >
        <SubHeading>
          Select which location you would like to copy products to.
        </SubHeading>
        {this.renderSearchAndAccountSelection()}
      </Modal>
    ) : (
      <></>
    );
  }
}

/** export Create Runs Modal Component */
export const ConnectedCopyLocationModal = connect<{}, {}, IProps, {}>(null)(
  CopyLocationModal,
);
