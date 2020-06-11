import { Fonts, Modal } from 'hss_components';
import { closeGenerateReportModal } from 'modules/physical-inventory/generate-report-modal/act.generate-report-modal';
import { DropDown } from 'modules/physical-inventory/generate-report-modal/components/generate-report-dropdowns';
import FileFormats from 'modules/physical-inventory/generate-report-modal/components/generate-report-file-formats';
import ReportTypes from 'modules/physical-inventory/generate-report-modal/components/generate-report-types';
import {
  getComparisonRunDropdownOptions,
  getLocationsDropdownData,
} from 'modules/physical-inventory/generate-report-modal/generate-report-modal.selectors';
import {
  comparisonGenerateReportThunkAction,
  generateReportThunkAction,
} from 'modules/physical-inventory/generate-report-modal/thunk.runs-landing-report-modal';
import { isLocationDetailsPage } from 'modules/physical-inventory/helpers';
import { getInventoryLocationDetails } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IInventoryLocationDetails } from 'types/inventory-location-details';
import { ILocations } from 'types/inventory-run-details';
interface IStateProps {
  /**
   * [required] locations data for generate Report modal
   */
  locationsDropdownData: ILocations[];
  /**
   * [required] Whether generate report Modal opens
   */
  isOpen: boolean;
  /**
   * [required] list of selected locations for dropdown
   */
  selectedLocationsForDropdown: string[];
  /**
   * [optional] It will get the Location details
   */
  locationDetails: IInventoryLocationDetails;
  /**
   * [required] It will get the runCode for selected run for generating report
   */
  selectedRunCode: string;
  /**
   * [optional] It will get the comparison Run dropdown options
   */
  comparisonRunDropdownOptions: string[];
}

type IProps = IStateProps & IDispatchProp;

const BodyContent = styled.div``;
const StyledModal = styled(Modal)`
  div[class*='modal-body'] {
    overflow: visible;
    -ms-overflow-style: visible;
  }
`;
const ModalBodyRow = styled.div`
  padding-bottom: 24px;
`;
const RowBorder = styled.div`
  height: 1px;
  background-color: ${props => props.theme.colors.grey2};
  margin-bottom: 18px;
`;
const ModalBodyRowContent = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  padding-top: 16px;
`;
const ModalBodyRowHeader = styled(Fonts.Display20)`
  color: ${props => props.theme.colors.grey6};
`;

const GenerateReportModal: React.SFC<IProps> = props => {
  const [reportTypesData] = useState({
    detailed: 'Detailed',
    summary: 'Summary',
    comparison: 'Comparison',
  });
  const [selectedReportType, setReportType] = useState('Detailed');
  const [selectedTargetRun, setTargetRun] = useState('Select Run');
  const [selectedTargetRunCode, setTargetRunCode] = useState('');
  const [fileFormatsData] = useState({ excel: 'Excel', pdf: 'PDF', csv: 'CSV' });
  const [selectedFileFormat, setFileFormat] = useState('Excel');
  const [isDownloadBtnDisable, disableDownloadBtn] = useState(false);

  const changeReportType = (reportType: string) => {
    setReportType(reportType);
    if (reportType === 'Summary' && selectedFileFormat === 'CSV') {
      setFileFormat('Excel');
    }
  };

  const renderModalBody = () => {
    return (
      <BodyContent>
        <ModalBodyRow>
          <ModalBodyRowHeader>Choose your report type:</ModalBodyRowHeader>
          <ModalBodyRowContent>
            <ReportTypes
              reportTypesData={reportTypesData}
              selectedReportType={selectedReportType}
              onChangeFn={changeReportType}
              disableDownloadBtn={disableDownloadBtn}
            />
          </ModalBodyRowContent>
        </ModalBodyRow>
        <RowBorder />
        <ModalBodyRow>
          <DropDown
            selectedReportType={selectedReportType}
            selectedTargetRun={selectedTargetRun}
            setTargetRun={setTargetRun}
            disableDownloadBtn={disableDownloadBtn}
            setTargetRunCode={setTargetRunCode}
          />
        </ModalBodyRow>
        <RowBorder />
        <ModalBodyRow>
          <ModalBodyRowHeader>Choose your file format:</ModalBodyRowHeader>
          <ModalBodyRowContent>
            <FileFormats
              selectedReportType={selectedReportType}
              fileFormatsData={fileFormatsData}
              selectedFileFormat={selectedFileFormat}
              onChangeFn={setFileFormat}
            />
          </ModalBodyRowContent>
        </ModalBodyRow>
        <RowBorder />
      </BodyContent>
    );
  };

  const handleCloseGenerateReportModal = () => {
    disableDownloadBtn(false);
    selectedReportType === 'Comparison' && setTargetRun('Select Run');
    props.dispatch(closeGenerateReportModal());
  };
  const handleGenerateReport = () => {
    const runCode = props.selectedRunCode; // runCode selected to trigger modal
    // if detailed reportType radio button is selected then passing the sliced name 'detail'
    const modifiedReportType =
      selectedReportType === 'Detailed'
        ? selectedReportType.slice(0, -2)
        : selectedReportType;
    const selectedFormatAndType =
      selectedFileFormat.toLowerCase() + '-' + modifiedReportType.toLowerCase();

    const selectedLocationNamesWithoutAll =
      props.selectedLocationsForDropdown &&
      props.selectedLocationsForDropdown.filter((item: string) => item !== 'All');

    const selectedLocationsDetails =
      props.locationsDropdownData &&
      props.locationsDropdownData.filter((locationObj: ILocations) =>
        selectedLocationNamesWithoutAll.includes(locationObj.name),
      );

    const selectedLocationCodes = isLocationDetailsPage()
      ? props.locationDetails.code
      : selectedLocationsDetails.map(item => item.code).join();

    const downloadedfileName =
      runCode + '-' + modifiedReportType.toLowerCase() + '_report';
    const downloadedfileExt =
      selectedFileFormat === 'Excel'
        ? 'xls'
        : selectedFileFormat === 'PDF'
        ? 'pdf'
        : 'csv';
    const downloadedfileType =
      selectedFileFormat === 'Excel'
        ? 'application/vnd.ms-excel'
        : selectedFileFormat === 'PDF'
        ? 'application/pdf'
        : 'text/csv';

    selectedReportType === 'Comparison'
      ? props.dispatch(
          comparisonGenerateReportThunkAction(
            selectedFileFormat.toLowerCase(),
            runCode,
            selectedTargetRunCode,
            downloadedfileExt,
            downloadedfileName,
            downloadedfileType,
          ),
        )
      : props.dispatch(
          generateReportThunkAction(
            runCode,
            selectedFormatAndType,
            selectedLocationCodes,
            downloadedfileExt,
            downloadedfileName,
            downloadedfileType,
          ),
        );
  };

  const footerConfig = {
    confirmBtnText: 'Download',
    disableConfirmBtn: isDownloadBtnDisable,
    closeFn: handleCloseGenerateReportModal,
    confirmFn: handleGenerateReport,
  };
  return (
    <StyledModal
      title={'Generate Report'}
      isOpen={props.isOpen}
      height={495}
      width={584}
      footer={footerConfig}
    >
      {renderModalBody()}
    </StyledModal>
  );
};

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    locationsDropdownData: getLocationsDropdownData(state),
    locationDetails: getInventoryLocationDetails(state),
    isOpen: state.physicalInventory.generateReportModal.isOpen,
    selectedLocationsForDropdown:
      state.physicalInventory.generateReportModal.selectedLocations,
    selectedRunCode: state.physicalInventory.generateReportModal.selectedRunCode,
    comparisonRunDropdownOptions: getComparisonRunDropdownOptions(state),
  };
};

/** export Connected Generate Report Modal */
export const ConnectedGenerateReportModal = connect<IStateProps, IDispatchProp, {}>(
  mapStateToProps,
)(GenerateReportModal);
