import { Fonts, RadioButton } from 'hss_components';
import React from 'react';
import styled from 'styled-components';

interface IOwnProps {
  /** Report Types data for rendering */
  reportTypesData: any;
  /** selected Report Type */
  selectedReportType: string;
  /** Func triggered on change of report type radio btn selection */
  onChangeFn: (newSelectedReportType: string) => void;
  /** Func to toggle the disable state of download report btn */
  disableDownloadBtn: (isDisable: boolean) => void;
}
const StyledRadioButton = styled(RadioButton)`
  margin-right: 20px;
`;

const ReportTypes: React.SFC<IOwnProps> = props => {
  const handleReportTypes = (e: any) => {
    props.onChangeFn(e.target.value);
    e.target.value === 'Comparison'
      ? props.disableDownloadBtn(true)
      : props.disableDownloadBtn(false);
  };
  return (
    <>
      <StyledRadioButton
        name="reportTypeRadios"
        value={props.reportTypesData.detailed}
        onChange={handleReportTypes}
        checked={props.reportTypesData.detailed === props.selectedReportType}
      >
        <Fonts.Body14>{props.reportTypesData.detailed}</Fonts.Body14>
      </StyledRadioButton>
      <StyledRadioButton
        name="reportTypeRadios"
        value={props.reportTypesData.summary}
        onChange={handleReportTypes}
        checked={props.reportTypesData.summary === props.selectedReportType}
      >
        <Fonts.Body14>{props.reportTypesData.summary}</Fonts.Body14>
      </StyledRadioButton>
      <StyledRadioButton
        name="reportTypeRadios"
        value={props.reportTypesData.comparison}
        onChange={handleReportTypes}
        checked={props.reportTypesData.comparison === props.selectedReportType}
      >
        <Fonts.Body14>{props.reportTypesData.comparison}</Fonts.Body14>
      </StyledRadioButton>
    </>
  );
};

/** Generate Report Select Report Type component */
export default ReportTypes;
