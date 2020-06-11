import assetPrefix from 'helpers/asset-prefix';
import {
  CheckboxWithLabel,
  Fonts,
  Modal,
  SingleSelectDropdown,
} from 'hss_components';
import {
  closeInventoryRunImportModal,
  setImportRunSelectedFileFormat,
  toggleInventoryRunImportIncludeHeaders,
  updateInventoryRunFileSelectText,
} from 'modules/physical-inventory/runs/act.inventory-runs';
import { uploadInventoryRunFile } from 'modules/physical-inventory/runs/thunk.inventory-runs';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { IImportExportFormat } from 'types/import-export-format';
import IDefaultProps from 'types/styled-component-props';

interface IStateProps {
  /*
   *  Boolean that controls if modal is showing or not
   */
  isOpen: boolean;
  /*
   * Boolean for if the include headers is checked or not
   */
  isIncludeHeaders?: boolean;

  /*
   * Text to show in file import text field
   */
  importFileText?: string;
  /**
   * Import export formats
   */
  importExportFormats: IImportExportFormat[];
  /**
   * Selected Import format
   */
  selectedImportId: string;
}

type IProps = IDefaultProps & IStateProps & IDispatchProp;

let fileInputElement: HTMLInputElement;

const StyledSubHeader = styled(Fonts.Body16)`
  color: ${props => props.theme.colors.grey6};
`;

const StyledBodyText = styled.div``;

const StyledFileInputContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  height: 30px;
  margin-top: 20px;

  input[type='file'] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    :hover {
      border: 1px solid ${props => props.theme.colors.brandLightBlue};
    }
  }

  input[type='text'] {
    box-sizing: border-box;
    height: 34px;
    width: 400px;
    border: 1px solid ${props => props.theme.colors.borderGrey};
    border-radius: 5px;
    color: ${props => props.theme.colors.grey6};
    font-family: 'Work Sans';
    font-size: 14px;
    line-height: 16px;
  }

  p {
    height: 14px;
    width: 63px;
    color: ${props => props.theme.colors.brandBlue};
    font-family: 'Work Sans';
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    text-align: center;
    margin: 8px auto 0 auto;
    :hover {
      color: ${props => props.theme.colors.brandLightBlue};
    }
  }

  label {
    height: 30px;
    width: 110px;
    margin-left: 7px;
    border: 1px solid ${props => props.theme.colors.brandBlue};
    border-radius: 2px;
    cursor: pointer;
    :hover {
      border: 1px solid ${props => props.theme.colors.brandLightBlue};
    }
  }
`;

const StyledLink = styled(Fonts.Link16)`
  height: 13px;
  margin-top: 30px;
  a.template-link {
    height: 13px;
    width: 115px;
    color: ${props => props.theme.colors.brandBlue};
    font-family: 'Work Sans';
    font-size: 12px;
    line-height: 13px;
    font-weight: 500;
    text-decoration: none;
    margin-left: 2px;
  }
`;

const CheckBoxContainer = styled.div`
  align-items: center;
  margin-top: 16px;
  margin-left: 2px;
  div[class*='with-label__CheckBoxText'] {
    margin-left: 0px;
  }
`;

const StyledCheckboxLabel = styled(Fonts.Body12)`
  color: ${props => props.theme.colors.grey5};
  margin-top: 2px;
`;

const FileFormatContainer = styled.div`
  margin-top: 16px;
  height: 60px;
`;

const FileFormatLabel = styled(Fonts.Body12)``;

const StyledFileFormatDropdown = styled(SingleSelectDropdown)`
  position: absolute;
  height: 44px;
  width: 264px;
`;

const StandardFileFormatType = styled(Fonts.Body16)`
  margin-top: 8px;
`;
const PhysicalInventoryImportModal: React.SFC<IProps> = props => {
  const handleImportButtonClick = () => {
    props.dispatch(
      uploadInventoryRunFile({
        file: fileInputElement.files[0],
        headerIncluded: props.isIncludeHeaders,
        uploadType: 'PHYSICALINVENTORY',
      }),
    );
  };

  const handleCloseAndResetModal = () => {
    fileInputElement.value = '';
    props.dispatch(closeInventoryRunImportModal());
  };

  const footerConfig = {
    cancelBtnText: 'Cancel',
    closeFn: handleCloseAndResetModal,
    confirmBtnText: 'Import',
    confirmFn: handleImportButtonClick,
    disableConfirmBtn:
      !fileInputElement || !fileInputElement.files || !fileInputElement.files[0],
    solidCancelBtn: true,
    wideConfirmBtn: true,
  };

  const fileNameText: string =
    props.importFileText !== '' ? `   ${props.importFileText}` : '';

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = e.target.value
      .split('/')
      .pop()
      .split('\\')
      .pop();

    props.dispatch(updateInventoryRunFileSelectText(fileName));
  };

  const onIncludeHeadersClick = () => {
    props.dispatch(toggleInventoryRunImportIncludeHeaders());
  };

  const setFileInputRef = (input: HTMLInputElement) => {
    fileInputElement = input;
  };

  const renderCheckBox = (
    <CheckBoxContainer>
      <CheckboxWithLabel
        onChange={onIncludeHeadersClick}
        checked={props.isIncludeHeaders}
      >
        <StyledCheckboxLabel>File contains header line</StyledCheckboxLabel>
      </CheckboxWithLabel>
    </CheckBoxContainer>
  );

  const isStandardFileFormat = props.selectedImportId === 'standardCSV';

  const renderStandardFileTemplate = (
    <StyledLink>
      {isStandardFileFormat && (
        <a
          href={`${assetPrefix}/static/template-files/import_physical_inventory_template.csv`}
          className="template-link"
          download
        >
          Standard .CSV File Template
        </a>
      )}
    </StyledLink>
  );
  const importsDropdown = () => {
    const currentFormat = props.importExportFormats.find(
      format =>
        format.partnerId.toLowerCase() === props.selectedImportId.toLowerCase(),
    );
    const importFormatTypes = props.importExportFormats.map(
      format => format.partnerName,
    );
    const handleImportFormatChange = (selected: string) => {
      const currentFormat2 = props.importExportFormats.find(
        format => format.partnerName === selected,
      );
      props.dispatch(setImportRunSelectedFileFormat(currentFormat2.partnerId));
    };
    return (
      <StyledFileFormatDropdown
        options={importFormatTypes}
        dropdownText={currentFormat ? currentFormat.partnerName : ''}
        onChange={handleImportFormatChange}
      />
    );
  };
  const standardFileFormat = (
    <StandardFileFormatType>Standard CSV</StandardFileFormatType>
  );
  const renderFileFormat = () => {
    const renderimportsDropdown =
      props.importExportFormats && props.importExportFormats.length > 1;
    return (
      <FileFormatContainer>
        <FileFormatLabel>File Format:</FileFormatLabel>
        {!renderimportsDropdown && standardFileFormat}
        {renderimportsDropdown && importsDropdown()}
      </FileFormatContainer>
    );
  };

  const fileInput = (
    <div>
      <StyledFileInputContainer>
        <input
          type="text"
          readOnly
          value={fileNameText}
          placeholder="   Select a file..."
        />
        <label htmlFor="file-upload" className="custom-file-upload">
          <p>Select File</p>
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileSelectChange}
          ref={setFileInputRef}
          accept=".txt, .csv, .x12, .xml"
        />
      </StyledFileInputContainer>
      {isStandardFileFormat && renderCheckBox}
    </div>
  );

  const bodyText = (
    <StyledBodyText>
      <StyledSubHeader>
        All imported data will be added to the designated run. File import status and
        log can be viewed in Uploads.
      </StyledSubHeader>
      {renderFileFormat()}
      {renderStandardFileTemplate}
      {fileInput}
    </StyledBodyText>
  );

  return (
    <Modal
      title="Import Run"
      contentLabel="Import Inventory Run"
      isOpen={props.isOpen}
      height={407}
      width={580}
      footer={footerConfig}
    >
      <Fonts.Body16>{bodyText}</Fonts.Body16>
    </Modal>
  );
};

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    isOpen: state.physicalInventory.inventoryRuns.isImportModalOpen,
    importFileText: state.physicalInventory.inventoryRuns.importFileText,
    isIncludeHeaders: state.physicalInventory.inventoryRuns.isIncludeHeaders,
    importExportFormats: state.physicalInventory.inventoryRuns.importExportFormats,
    selectedImportId: state.physicalInventory.inventoryRuns.selectedFileFormat,
  };
};

/** Inventory Run Import Modal */
export default connect<IStateProps, IDispatchProp, {}>(mapStateToProps)(
  PhysicalInventoryImportModal,
);
