import { hasOnlyNumbers } from 'modules/forms/validators';
import Router from 'next/router';
import { ILocationEntry } from 'types/inventory-location-details';

/** Hard end date limit */
export const lastDatePossible = new Date('2099-12-31');

/** Hard start date limit */
export const startDatePossible = new Date('1900-01-01');

/** physicai inventory run landing page path name */
export const getInventoryRunsPagePathName = () => '/physical-inventory';

/** navigate to Inventory Runs landing page */
export const navigateToInventoryRunsPage = () => {
  return Router.push(getInventoryRunsPagePathName());
};

/** Runs details landing page path name */
export const getRunsDetailsLandingPagePathName = (runCode: string) =>
  '/physical-inventory/run-details?runCode=' + runCode;

/** Navigate to Run Details page */
export const navigateToRunDetailsPage = (runCode: string) => {
  return Router.push(getRunsDetailsLandingPagePathName(runCode));
};

/** TODO: Add comment */
export const getMultiUserModalTitle = (exceptionType: string) => {
  switch (exceptionType) {
    case 'RunDeletedError':
      return 'Run Does Not Exist';
    case 'RUN_DELETED_EXCEPTION':
      return 'Run Does Not Exist';
    case 'LOCATION_DELETED_EXCEPTION':
      return 'Location Does Not Exist';
    case 'ENTRY_DELETED_EXCEPTION':
      return 'Product No Longer Exists';
    case 'The run you are trying to edit has been deleted':
      return 'Run Does Not Exist';
    case 'Locations already deleted or does not exist!':
      return 'Source Location Does Not Exist';
    case 'The location you are trying to copy to has been deleted.':
      return 'Destination Location Does Not Exist';
    case 'ENTRY_DELETED_EXCEPTION_LOCATION_DETAILS_PAGE':
      return 'Products Not Refreshed';
    default:
      return '';
  }
};

/** TODO: Add comment */
export const getMultiUserModalBodyText = (exceptionType: string, code: string) => {
  switch (exceptionType) {
    case 'RunDeletedError':
      return `${code} does not exist. It has been deleted by another user.`;
    case 'RUN_DELETED_EXCEPTION':
      return `This run does not exist. It has been deleted by another user.`;
    case 'LOCATION_DELETED_EXCEPTION':
      return 'This location does not exist. It has been deleted by another user.';
    case 'ENTRY_DELETED_EXCEPTION':
      return 'The product you are trying to edit has been deleted.';
    case 'The run you are trying to edit has been deleted':
      return 'This run does not exist. It has been deleted by another user.';
    case 'Locations already deleted or does not exist!':
      return 'The source location does not exist. It has been deleted by another user.';
    case 'The location you are trying to copy to has been deleted.':
      return 'The destination location does not exist. It has been deleted by another user.';
    case 'ENTRY_DELETED_EXCEPTION_LOCATION_DETAILS_PAGE':
      return 'Product(s) does not exist in this location. Product(s) deleted by another user.';
    default:
      return '';
  }
};
/** Check if Location Details Page */
export const isLocationDetailsPage = () => {
  const isLocationDetails = window.location.href.includes(
    '/physical-inventory/location-details',
  );
  return isLocationDetails;
};

/** whether multi user exception thrown or not while opening generate report modal in location details page */
export const isLocationDeletedExceptionForGenerateReport = (e: any) => {
  const exceptionErrorsRef = e.response && e.response.data && e.response.data[0];
  const exceptionMessage = exceptionErrorsRef && e.response.data[0].runMessage;
  const multiUserExceptionList = ['Locations already deleted or does not exist!'];
  const isLocationDeleted =
    exceptionMessage && multiUserExceptionList.includes(exceptionMessage);
  return !!isLocationDeleted;
};

const locationDeletedExceptionTypes = ['LOCATION_DELETED_EXCEPTION'];
const entryDeletedExceptionTypes = ['ENTRY_DELETED_EXCEPTION'];
const runDeletedExceptionTypes = ['RUN_DELETED_EXCEPTION'];

/** whether multi user exception thrown or not */
export const isLocationDeletedException = (e: any) => {
  const exceptionData =
    e.response && e.response.data && e.response.data[0].exceptionData;
  const exceptionType = exceptionData && exceptionData[0].exceptionType;
  const isLocationDeleted =
    exceptionType && locationDeletedExceptionTypes.includes(exceptionType);
  return !!isLocationDeleted;
};

/** whether multi user exception thrown or not for multiLocations deleted */
export const isMultiLocationDeletedException = (e: any) => {
  const exceptionResponse =
    e.response &&
    e.response.data &&
    e.response.data.filter((locObj: any) => locObj.hasOwnProperty('exceptionData'));
  const deletedLocationsCount = exceptionResponse.length;
  const areLocationsDeleted =
    deletedLocationsCount && deletedLocationsCount > 0 ? true : false;
  return [deletedLocationsCount, areLocationsDeleted];
};

/** whether location exception thrown or not */
export const exceptionTypeRun = (exception: any) => {
  const exceptionErrorsRef = exception.response.data[0].exceptionData;
  const exceptionMessage = exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
  const isRunDeleted =
    exceptionMessage &&
    runDeletedExceptionTypes.find(e => exceptionMessage.includes(e));
  return isRunDeleted;
};

/** whether location exception thrown or not */
export const exceptionTypeLocation = (exception: any) => {
  const exceptionErrorsRef = exception.response.data[0].exceptionData;
  const exceptionMessage = exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
  const isLocationDeleted =
    exceptionMessage &&
    locationDeletedExceptionTypes.find(e => exceptionMessage.includes(e));
  return isLocationDeleted;
};

/** whether entry exception thrown or not */
export const exceptionTypeEntry = (exception: any) => {
  const exceptionErrorsRef = exception.response.data[0].exceptionData;
  const exceptionMessage = exceptionErrorsRef && exceptionErrorsRef[0].exceptionType;
  const isEntryDeleted =
    exceptionMessage &&
    entryDeletedExceptionTypes.find(e => exceptionMessage.includes(e));
  return isEntryDeleted;
};

/** Check and remove Dollar Helper */
export const checkAndRemoveDollarSign = (val: string) => {
  return val.includes('$') ? val.replace('$', '') : val;
};

/** Check has numbers or decimals */
export const hasNumbersOrDecimalPoint = (val: string) => {
  return val.indexOf('.') > 0 ? /^\d+(?:\.\d{0,5})?$/.test(val) : true;
};

/** Validate value for acq cost */
export const acqCostValidator = (val: string) => {
  const acqValue = checkAndRemoveDollarSign(val);
  if (hasNumbersOrDecimalPoint(acqValue)) {
    return true;
  }
  return false;
};

/** get Image Urls */
export const getImageUrl = (entry: ILocationEntry) => {
  const incomingImages = entry.thumbnails
    ? entry.thumbnails
    : entry.pharmacyProduct.images;
  const images = [
    {
      url: incomingImages && incomingImages[0] && incomingImages[0].url,
    },
  ];
  return images;
};

/** Map all the location entries */
export const mapLocationEntries = (inventoryLocationDetails: any) => {
  return inventoryLocationDetails.entries.map((entry: ILocationEntry) => {
    if (entry.reasonCode && entry.reasonCode.code) {
      // changed this to 0 from -1 as total is getting effected.
      const exceptionQty = entry.quantity;
      entry.exceptionQty = exceptionQty;
      entry.quantity = 0;
      entry.price = 0;
      entry.total = 0;
      entry.abcSellingSize = '';
    }
    if (!entry.abcSellingSize) {
      entry.abcSellingSize = '';
    }
    if (entry.nonABCProduct) {
      entry.nonABCProduct.code = entry.nonABCProduct.customerItemNumber
        ? entry.nonABCProduct.customerItemNumber
        : entry.nonABCProduct.productId;
      entry.nonABCProduct.name = entry.nonABCProduct.description;
    }
    return entry;
  });
};
/** Exception Code */
export const getExceptionName = (code: string) => {
  if (code === 'MULTIPLE') {
    return 'Multiple Products';
  }
  return 'Unknown Product';
};
/** Sequence Validator */
export const sequenceValidator = (val: string) => {
  if (hasOnlyNumbers(val)) {
    return true;
  }
  return false;
};
/** Selling Size for Entry */
export const getSellingSize = (entry: ILocationEntry) => {
  return entry.pharmacyProduct
    ? entry.pharmacyProduct.abcSellingSize
    : entry.nonABCProduct
    ? entry.nonABCProduct.unitOfMeasure
    : '';
};

/** Form code Desc Size for Entry */
export const getFormCodeDesc = (entry: ILocationEntry) => {
  if (entry.nonABCProduct) {
    return entry.abcFormCodeDesc && entry.abcFormCodeDesc !== ''
      ? entry.abcFormCodeDesc
      : entry.nonABCProduct.unitOfMeasure;
  }
  return entry.abcFormCodeDesc;
};

/** Returns run name error message */
export const validationMsgFn = (): string =>
  'Run name cannot contain | ^ <> *  @ ~  \\ ';

/** Returns location name error message */
export const locationValidationMsgFn = (): string =>
  'Location name cannot contain | ^ <> *  @ ~  \\ ';
