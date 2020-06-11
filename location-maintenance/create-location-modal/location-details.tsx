import { Fonts, FormTextInput, SingleSelectDropdown } from 'hss_components';
import { isANSIx12CompliantAnyLength } from 'modules/forms/validators';
import { locationValidationMsgFn } from 'modules/physical-inventory/helpers';
import {
  setLocationName,
  setLocationUom,
} from 'modules/physical-inventory/location-maintenance/act.location-maintenance';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { ICreateLocationReq } from 'types/inventory-run-details';

interface IStateProps {
  /**
   * Create/Add/Edit Location details request
   */
  createLocationReq: ICreateLocationReq;
  /**
   * [optional] show hide error message
   */
  showSearchTextErrorMsg: boolean;
}

const StyledLocationNameTextBox = styled(FormTextInput)`
  width: 256px;
`;

const StyledRequireContainer = styled(Fonts.Body11Macro)`
  margin: 16px 0px;
`;

const StyledUomDropdown = styled(SingleSelectDropdown)`
  width: 256px;
  height: 34px;
  margin-top: 4px;
  & button {
    border-radius: 0px;
  }
`;

const InputContainer = styled.div`
  display: flex;
`;

const FlexFiller = styled.div`
  flex-grow: 1;
`;

const ErrorContainer = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.red};
  margin-bottom: -10px;
  padding: 3px 0 0 0;
`;

const uomOptions = ['Base', 'Alternate'];

type IProps = IStateProps & IDispatchProp;

const UnConnectedLocationDetails: React.SFC<IProps> = props => {
  const handleLocationNameUpdate = (locationName: string) => {
    props.dispatch(
      setLocationName(locationName, !isANSIx12CompliantAnyLength(locationName)),
    );
  };

  const toggleSearchTextErrorMsg = () => {
    return props.showSearchTextErrorMsg ? (
      <ErrorContainer> {locationValidationMsgFn()} </ErrorContainer>
    ) : null;
  };

  const onChangeUOM = (e: string) => {
    props.dispatch(setLocationUom(e));
    handleLocationNameUpdate(props.createLocationReq.name);
  };

  const renderNewlocationDetails = () => {
    return (
      <>
        <InputContainer>
          <div>
            <Fonts.Body12>Location Name*</Fonts.Body12>
            <StyledLocationNameTextBox
              type="text"
              placeholder="Enter a Location Name"
              maxLength={40}
              value={props.createLocationReq.name}
              autoFocus
              saveOnKeyStroke
              saveValue={handleLocationNameUpdate}
            />
            {toggleSearchTextErrorMsg()}
          </div>

          <FlexFiller />
          <div>
            <Fonts.Body12>Unit of Measure</Fonts.Body12>
            <StyledUomDropdown
              onChange={(e: string) => onChangeUOM(e)}
              dropdownText={props.createLocationReq.unitOfMeasure}
              options={uomOptions}
            />
          </div>
        </InputContainer>
        <StyledRequireContainer>* REQUIRED FIELDS</StyledRequireContainer>
      </>
    );
  };

  return <>{renderNewlocationDetails()}</>;
};

// Mapping State from Redux store with props
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    createLocationReq: state.physicalInventory.locationMaintenance.createLocationReq,
    showSearchTextErrorMsg:
      state.physicalInventory.locationMaintenance.createLocationReq
        .toggleErrorMessage,
  };
};

/** export Create New Location Modal Modal Component */
export const LocationDetails = connect<IStateProps, IDispatchProp, {}>(
  mapStateToProps,
)(UnConnectedLocationDetails);
