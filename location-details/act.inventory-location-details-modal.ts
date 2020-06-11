import * as Actions from 'modules/physical-inventory/location-details/location-details-types';
import { IAddToast } from 'modules/toast/types';

/** Open Products Search modal */
export const openProductsSearchModal = (): Actions.IOpenProductsSearchModal => ({
  type: 'OPEN_PRODUCTS_SEARCH_MODAL',
});

/** Closes Products Search modal */
export const closeProductsSearchModal = (): Actions.ICloseProductsSearchModal => ({
  type: 'CLOSE_PRODUCTS_SEARCH_MODAL',
});

/** Action to trigger success toast */
export const triggerSuccessToast = (title: string, body: string): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title,
    body,
    iconType: 'success',
    duration: 6,
  },
});

/** Action to trigger copy location all products success toast */
export const triggerCopyLocationAllProductsSuccessToast = (
  locationName: string,
  locationCode: string,
  title: string,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title,
    body: `view ${locationName} >`,
    iconType: 'success',
    url: `/physical-inventory/location-details?locationCode=${locationCode}`,
    disableNavigation: false,
    duration: 6,
  },
});

/** Action to trigger copy location selected products success toast */
export const triggerCopyLocationSelectedProductsSuccessToast = (
  title: string,
  exceptionMessage: string,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title,
    body: `${exceptionMessage}`,
    iconType: 'success',
    disableNavigation: false,
    duration: 6,
  },
});

/** Action to trigger Add Product success toast */
export const triggerAddProductSuccessToast = (productName: string): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Product Added',
    body: `Product ${productName} successfully added`,
    iconType: 'success',
    duration: 6,
  },
});
/** Action to trigger delete products success toast */
export const triggerProductsDeleteSuccessToast = (): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Delete product(s)',
    body: `Products deleted successfully`,
    iconType: 'success',
    duration: 6,
  },
});

/** Action to trigger delete products success(partial) toast */
export const triggerProductsDeletePartialSuccessToast = (
  count: number,
): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Products deleted successfully',
    body: `${
      count === 1
        ? 'Product deleted successfully'
        : 'Some products were deleted successfully'
    }?`,
    iconType: 'success',
    duration: 6,
  },
});

/** Action to trigger Refresh Acquisition Cost for products success toast */
export const triggerProductsRefreshAcquisitionCostSuccessToast = (): IAddToast => ({
  type: 'ADD_TOAST',
  payload: {
    title: 'Acquisition Cost Refreshed',
    body: `Products refreshed successfully`,
    iconType: 'success',
    duration: 6,
  },
});
