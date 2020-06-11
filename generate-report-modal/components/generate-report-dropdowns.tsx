import {
  Fonts,
  MultiSelectCheckboxDropdown,
  SingleSelectDropdown,
} from 'hss_components';
import { updateSelectedLocations } from 'modules/physical-inventory/generate-report-modal/act.generate-report-modal';
import {
  getComparisonRunDropdownData,
  getComparisonRunDropdownOptions,
  getLocationListDropdownOptions,
  getLocationsDropdownData,
} from 'modules/physical-inventory/generate-report-modal/generate-report-modal.selectors';
import { isLocationDetailsPage } from 'modules/physical-inventory/helpers';
import { getInventoryLocationDetails } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IInventoryLocationDetails } from 'types/inventory-location-details';
import { ILocations } from 'types/inventory-run-details';
import { IInventoryRuns } from 'types/inventory-runs';

interface IOwnProps {
  /** selected Report Type */
  selectedReportType: string;
  /** selected target run from select run dropdown */
  selectedTargetRun: string;
  /** Fun to set the target run state */
  setTargetRun: (selectedDropdownValue: string) => void;
  /** Func to toggle the disable state of download report btn */

  disableDownloadBtn: (isDisable: boolean) => void;
  /** Fun to set the target run code */
  setTargetRunCode: (selectedTargetRunCode: string) => void;
}
interface IStateProps {
  /** It will get the comparison Run dropdown options */
  comparisonRunDropdownOptions: string[];
  /** It will get the all Details for Target runs in dropdown */
  comparisonRunDropDownDetails: IInventoryRuns[];
  /** It will show All the Locations Names as dropdown options */
  AllLocationsForDropdown: string[];
  /** list of selected locations for dropdown */
  selectedLocationsForDropdown: string[];
  /** It will get the Location details */
  locationDetails: IInventoryLocationDetails;
  /** locations data for generate Report modal */
  locationsDropdownData: ILocations[];
}

type IProps = IStateProps & IDispatchProp & IOwnProps;

const ModalBodyRowContent = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  padding-top: 16px;
`;
const ModalBodyRowHeader = styled(Fonts.Display20)`
  color: ${props => props.theme.colors.grey6};
`;

const StyledMultiSelectDropdown = styled(MultiSelectCheckboxDropdown)`
  width: 259px;
  flex: none;
  & div[class*='drop-down__OptionsWrapper'] {
    min-height: 30px;
    max-height: 200px;
    overflow-y: auto;
    -ms-overflow-style: auto;
  }
  & div[class*='with-label__CheckBoxText'] {
    margin-left: 3px;
  }
`;
const StyledSingleSelectDropdown = styled(SingleSelectDropdown)`
  width: 259px;
  flex: none;
  & div[class*='drop-down__OptionsWrapper'] {
    min-height: 30px;
    max-height: 200px;
    overflow-y: auto;
    -ms-overflow-style: auto;
  }
`;

const UnConnectedDropDownComponent: React.SFC<IProps> = props => {
  const handleOnSelectRun = (selectedTargetRun: any) => {
    props.setTargetRun(selectedTargetRun);
    const selectedTargetRunDetails = props.comparisonRunDropDownDetails.filter(
      (item: IInventoryRuns) => {
        return item.name === selectedTargetRun;
      },
    );
    props.setTargetRunCode(
      selectedTargetRunDetails &&
        selectedTargetRunDetails.length &&
        selectedTargetRunDetails[0].code,
    );
    props.disableDownloadBtn(false);
  };
  const allLocations = props.AllLocationsForDropdown;
  const selectedLocations = props.selectedLocationsForDropdown;
  const dropdownTextForLocDetailsPage = () => `${props.locationDetails.name}`;
  const isDropdownDisabled =
    !allLocations.length || isLocationDetailsPage() ? true : false;
  const dropdownTextForOthers = () => {
    if (isDropdownDisabled) {
      return `No Locations`;
    }
    if (selectedLocations.length === 0) {
      return `None`;
    } else if (selectedLocations.length === 1) {
      return `${selectedLocations}`;
    } else {
      if (selectedLocations.includes('All') && selectedLocations.length) {
        return `All (${selectedLocations.length - 1})`;
      } else {
        return `Multiple (${selectedLocations.length})`;
      }
    }
  };
  const selectLocationDropdownText = isLocationDetailsPage()
    ? dropdownTextForLocDetailsPage()
    : dropdownTextForOthers();
  const handleOnSelectLocations = (selectedLocCheckboxValue: string) => {
    const areAllSelected = allLocations.length === selectedLocations.length;
    if (selectedLocCheckboxValue === 'All') {
      const allValuesChecked = areAllSelected ? [] : allLocations;
      props.dispatch(updateSelectedLocations(allValuesChecked));
    } else if (selectedLocations.includes(selectedLocCheckboxValue)) {
      // Remove selected option
      const selectedValues = selectedLocations.includes(selectedLocCheckboxValue)
        ? selectedLocations.filter(
            prevValue =>
              prevValue !== selectedLocCheckboxValue && prevValue !== 'All',
          )
        : selectedLocations;
      props.dispatch(updateSelectedLocations(selectedValues));
    } else {
      // Add selected option
      const selectedValues1 =
        allLocations.length - 2 === selectedLocations.length
          ? allLocations
          : selectedLocations.concat(selectedLocCheckboxValue);
      props.dispatch(updateSelectedLocations(selectedValues1));
    }
  };

  return props.selectedReportType === 'Comparison' ? (
    <>
      <ModalBodyRowHeader>Select Comparison Run:</ModalBodyRowHeader>
      <ModalBodyRowContent>
        <StyledSingleSelectDropdown
          dropdownText={props.selectedTargetRun}
          options={props.comparisonRunDropdownOptions}
          onChange={handleOnSelectRun}
        />
      </ModalBodyRowContent>
    </>
  ) : (
    <>
      <ModalBodyRowHeader>Select Locations:</ModalBodyRowHeader>
      <ModalBodyRowContent>
        <StyledMultiSelectDropdown
          dropdownText={selectLocationDropdownText}
          options={props.AllLocationsForDropdown}
          selectedOptions={props.selectedLocationsForDropdown}
          onChange={handleOnSelectLocations}
        />
      </ModalBodyRowContent>
    </>
  );
};

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    comparisonRunDropdownOptions: getComparisonRunDropdownOptions(state),
    comparisonRunDropDownDetails: getComparisonRunDropdownData(state),
    AllLocationsForDropdown: getLocationListDropdownOptions(state),
    locationsDropdownData: getLocationsDropdownData(state),
    locationDetails: getInventoryLocationDetails(state),
    selectedLocationsForDropdown:
      state.physicalInventory.generateReportModal.selectedLocations,
  };
};
/** export Generate Report Modal dropdown component */
export const DropDown = connect<IStateProps, IDispatchProp, {}>(mapStateToProps)(
  UnConnectedDropDownComponent,
);
