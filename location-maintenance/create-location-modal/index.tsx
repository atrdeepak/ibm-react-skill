import { ModalWorkflow } from 'components/modal/workflow';
import { Fonts } from 'hss_components';
import { closeCreateLocationModal } from 'modules/physical-inventory/location-maintenance/act.location-maintenance';
import { LocationDetails } from 'modules/physical-inventory/location-maintenance/create-location-modal/location-details';
import { SearchAndSelectAccount } from 'modules/physical-inventory/location-maintenance/create-location-modal/search-and-select-account';
import {
  createLocation,
  createLocationAndAddToRun,
  editLocation,
} from 'modules/physical-inventory/location-maintenance/thunk.location-maintenance';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { ICreateLocationReq } from 'types/inventory-run-details';

interface IOwnProps {
  /**
   * true to create a locaiton and add it to a run
   */
  addNewLocationToRun?: boolean;
}

interface IStateProps {
  /**
   * is learn barcode modal open
   */
  isModalOpen: boolean;
  /**
   * Create/Add/Edit Location details request
   */
  createLocationReq: ICreateLocationReq;
}

type IProps = IStateProps & IDispatchProp & IOwnProps;

interface IModalConfig {
  title: string;
  subtitle: string;
  accSelectionSubtitle: string;
  confirmCreateBtnText: string;
  confirmCreateFn: () => any;
}

enum ModalContext {
  Create = 'create',
  CreateAndAdd = 'createAndAdd',
  Edit = 'edit',
}

const Subtitle = styled(Fonts.Body16)`
  color: ${props => props.theme.colors.grey6};
  margin-top: 12px;
`;

class UnconnectedEditLocationModal extends React.PureComponent<IProps, {}> {
  initialValue = {};

  modalConfig: {
    [key: string]: IModalConfig;
  } = {
    create: {
      title: 'Create New Location',
      subtitle: 'Enter the location name and unit of measure.',
      accSelectionSubtitle:
        'Select which account you want to associate this location with.',
      confirmCreateBtnText: 'Create',
      confirmCreateFn: () => this.props.dispatch(createLocation()),
    },
    createAndAdd: {
      title: 'Create New Location',
      subtitle:
        'Enter the location name and unit of measure. The new location will be added to your current run, as well as the Location Maintenance page.',
      accSelectionSubtitle:
        'Select which account you want to associate this location with.',
      confirmCreateBtnText: 'Create',
      confirmCreateFn: () => this.props.dispatch(createLocationAndAddToRun()),
    },
    edit: {
      title: 'Edit Location',
      subtitle: 'Edit the location name and unit of measure.',
      accSelectionSubtitle:
        'Select which account you want to associate this location with.',
      confirmCreateBtnText: 'Save',
      confirmCreateFn: () => this.props.dispatch(editLocation()),
    },
  };

  closeFn = () => {
    this.props.dispatch(closeCreateLocationModal());
  };

  updateSelectedAccount = (changedAccount: string) => {
    this.props.dispatch(null);
  };

  render() {
    const modalContext = this.props.addNewLocationToRun
      ? ModalContext.CreateAndAdd
      : !!this.props.createLocationReq.code
      ? ModalContext.Edit
      : ModalContext.Create;

    const disableLocationDetaisConfirmBtn = !this.props.createLocationReq
      .enableNextButton;

    return (
      <ModalWorkflow
        isOpen={this.props.isModalOpen}
        pageCount={2}
        initialValue={this.initialValue}
        height={634}
      >
        {({ value, setValue, setPageNumber, getPreviousPage }) => {
          const confirmNextFn = () => {
            setPageNumber(2);
          };
          const steps = [];
          steps.push({
            title: this.modalConfig[modalContext].title,
            subtitle: <Subtitle>{this.modalConfig[modalContext].subtitle}</Subtitle>,
            footer: {
              confirmBtnText: 'Next',
              confirmFn: confirmNextFn,
              closeFn: this.closeFn,
              disableConfirmBtn: disableLocationDetaisConfirmBtn,
            },
            body: <LocationDetails />,
          });

          steps.push({
            title: this.modalConfig[modalContext].title,
            subtitle: (
              <Subtitle>
                {this.modalConfig[modalContext].accSelectionSubtitle}
              </Subtitle>
            ),
            footer: {
              confirmBtnText: this.modalConfig[modalContext].confirmCreateBtnText,
              confirmFn: this.modalConfig[modalContext].confirmCreateFn,
              closeFn: this.closeFn,
            },
            body: <SearchAndSelectAccount />,
          });

          return steps.reduce(
            (stepsObject: any, step, i) => ({
              ...stepsObject,
              [i + 1]: step,
            }),
            {},
          );
        }}
      </ModalWorkflow>
    );
  }
}

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    isModalOpen:
      state.physicalInventory.locationMaintenance.isCreateLocationModalOpen,
    createLocationReq: state.physicalInventory.locationMaintenance.createLocationReq,
  };
};

/** */
export const CreateLocationModal = connect<IStateProps, IDispatchProp, {}>(
  mapStateToProps,
)(UnconnectedEditLocationModal);
