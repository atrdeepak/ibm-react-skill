import { Fonts, RadioButton } from 'hss_components';
import React from 'react';
import styled from 'styled-components';

interface IOwnProps {
  /** selected Report Type */
  selectedReportType: string;
  /** Report File Formats data for rendering */
  fileFormatsData: any;
  /** selected file format */
  selectedFileFormat: string;
  /** Func triggered on change of file format radio btn selection */
  onChangeFn: (newSelectedFileFormat: string) => void;
}
const StyledRadioButton = styled(RadioButton)`
  margin-right: 20px;
`;

const FileFormats: React.SFC<IOwnProps> = props => {
  const handleFileFormats = (e: any) => {
    props.onChangeFn(e.target.value);
  };
  return (
    <>
      <StyledRadioButton
        name="fileFormatRadios"
        value={props.fileFormatsData.excel}
        onChange={handleFileFormats}
        checked={props.fileFormatsData.excel === props.selectedFileFormat}
      >
        <Fonts.Body14>{props.fileFormatsData.excel}</Fonts.Body14>
      </StyledRadioButton>
      <StyledRadioButton
        name="fileFormatRadios"
        value={props.fileFormatsData.pdf}
        onChange={handleFileFormats}
        checked={props.fileFormatsData.pdf === props.selectedFileFormat}
      >
        <Fonts.Body14>{props.fileFormatsData.pdf}</Fonts.Body14>
      </StyledRadioButton>
      {props.selectedReportType === 'Detailed' && (
        <StyledRadioButton
          name="fileFormatRadios"
          value={props.fileFormatsData.csv}
          onChange={handleFileFormats}
          checked={props.fileFormatsData.csv === props.selectedFileFormat}
        >
          <Fonts.Body14>{props.fileFormatsData.csv}</Fonts.Body14>
        </StyledRadioButton>
      )}
    </>
  );
};
/** Generate Report Select File Format component */
export default FileFormats;
