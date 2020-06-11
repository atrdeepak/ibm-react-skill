import { PageKey } from 'modules/page-filters/page-filter-enums';
import { copyRunLocationSelectedProducts } from 'modules/physical-inventory/location-details/thunk-inventory-location-details.ts';
import { ConnectedCopyLocationModal } from 'modules/physical-inventory/run-details/components/modals/copy-location-modal';
import { getCopyLocationsData } from 'modules/physical-inventory/run-details/inventory-run-details.selectors';
import {
  copyRunLocation,
  hideShowCopyLocationModal,
  toggleIsDeleteAfterCopy,
  updateDestinationLocation,
} from 'modules/physical-inventory/run-details/thunk.inventory-run-details';
import React from 'react';
import { connect } from 'react-redux';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';

interface IStateProps {
  /**
   * Show Create Run modal
   */
  showCopyLocationModal: boolean;
  /**
   * destination location code
   */
  destinationLocationCode: string;
  /**
   * is Delete Location radio
   */
  isDeleteLocation: boolean;
  /**
   * Selected Location code
   */
  selectedLocationCode: string;
  /**
   * destination location code to be copied
   */
  selectedDestinationCode: string;
  /**
   * location list
   */
  locationList: string[];
  /**
   * selected Product Ids list
   */
  selectedProductIds: string[];
}

type IProps = IStateProps & IDispatchProp;

const SharedCopyLocationModal: React.SFC<IProps> = props => {
  const deleteAfterCopyCheckFn = () => {
    props.dispatch(toggleIsDeleteAfterCopy(!props.isDeleteLocation));
  };

  const closeFn = () => {
    props.dispatch(hideShowCopyLocationModal(''));
  };

  const copyLocationFn = () => {
    props.selectedProductIds.length > 0
      ? props.dispatch(copyRunLocationSelectedProducts())
      : props.dispatch(copyRunLocation());
  };

  const updateSelectedLocationFn = (updatedLocationCode: string) => {
    props.dispatch(updateDestinationLocation(updatedLocationCode));
  };

  return (
    <ConnectedCopyLocationModal
      showModal={props.showCopyLocationModal}
      headerTitle={'Copy Products to a Location'}
      isDeleteLocation={props.isDeleteLocation}
      destinationLocationCode={props.destinationLocationCode}
      locationList={props.locationList}
      selectedLocationCode={props.selectedLocationCode}
      selectedDestinationCode={props.selectedDestinationCode}
      closeModal={closeFn}
      copyLocation={copyLocationFn}
      deleteAfterCopyCheck={deleteAfterCopyCheckFn}
      updateSelectedLocation={updateSelectedLocationFn}
      pageKey={PageKey.INVENTORY_RUN_DETAILS}
    />
  );
};

/**  Mapping State from Redux store with props */
const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    showCopyLocationModal:
      state.physicalInventory.inventoryRunDetails.showCopyLocationModal,
    destinationLocationCode:
      state.physicalInventory.inventoryRunDetails.destinationLocationCode,
    isDeleteLocation: state.physicalInventory.inventoryRunDetails.isDeleteLocation,
    locationList: getCopyLocationsData(state),
    selectedLocationCode:
      state.physicalInventory.inventoryRunDetails.sourceLocationCode,
    selectedDestinationCode:
      state.physicalInventory.inventoryRunDetails.destinationLocationCode,
    selectedProductIds:
      state.physicalInventory.inventoryLocationDetails.selectedProductIds,
  };
};

/** export Create Runs Modal Component */
export const ConnectedSharedCopyLocationModal = connect<
  IStateProps,
  IDispatchProp,
  {}
>(mapStateToProps)(SharedCopyLocationModal);
