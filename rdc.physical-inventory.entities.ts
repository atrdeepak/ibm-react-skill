import { omit } from 'lodash';
import { initialState, IState } from 'modules/entities/rdc.root';
import { Actions as InventoryGenerateReportModalActions } from 'modules/physical-inventory/generate-report-modal/act.generate-report-modal';
import { Actions as InventoryLocationDetailsActions } from 'modules/physical-inventory/location-details/location-details-types';
import { Actions as LocationMaintenanceActions } from 'modules/physical-inventory/location-maintenance/act.location-maintenance';
import { Actions as InventoryRunDetailsActions } from 'modules/physical-inventory/run-details/run-details.types';
import { Actions as InventoryRunsActions } from 'modules/physical-inventory/runs/act.inventory-runs';
import { ILocations } from 'types/inventory-run-details';
import { mapLocationEntries } from './helpers';

/** Export entity action for physical inventory */
export default (
  state: IState = initialState,
  action:
    | InventoryRunsActions
    | InventoryRunDetailsActions
    | LocationMaintenanceActions
    | InventoryLocationDetailsActions
    | InventoryGenerateReportModalActions,
): IState => {
  switch (action.type) {
    case 'SAVE_RESPONSE_RUNS_DATE_CHANGE-SUCCESS':
      const runCode = action.payload.data[0].code;
      const existingRunsDetail = state.inventoryRuns[runCode];
      return {
        ...state,
        inventoryRuns: {
          ...state.inventoryRuns,
          [runCode]: {
            ...existingRunsDetail,
            date: action.payload.data[0].date,
          },
        },
      };
    case 'SAVE_RESPONSE_RUN_NAME_CHANGE-SUCCESS':
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          name: action.payload.data[0].name,
        },
      };
    case 'RECEIVING_FETCH_RUN_DETAILS-SUCCESS':
      const inventoryRunDetails = action.payload.data.result[0];
      return {
        ...state,
        inventoryRunDetails,
      };
    case 'DELETE_INVENTORY_RUNS-SUCCESS':
      const updatedInventoryRuns =
        state.inventoryRuns && state.inventoryRuns[action.meta.code]
          ? omit(state.inventoryRuns, action.meta.code)
          : state.inventoryRuns;
      return { ...state, inventoryRuns: { ...updatedInventoryRuns } };
    case 'DELETE_INVENTORY_RUNS-FAILURE':
      const updatedInventoryRuns1 =
        state.inventoryRuns && state.inventoryRuns[action.meta.code]
          ? omit(state.inventoryRuns, action.meta.code)
          : state.inventoryRuns;
      return { ...state, inventoryRuns: { ...updatedInventoryRuns1 } };
    case 'DELETE_INVENTORY_LOCATION-SUCCESS':
      const inventoryRunDetailsData = state.inventoryRunDetails;
      const locations: any =
        inventoryRunDetailsData.locations &&
        Object.values(inventoryRunDetailsData.locations).filter(
          (item: ILocations) => {
            return item.code !== action.payload.data[0].code;
          },
        );
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          locations,
        },
      };
    case 'DELETE_INVENTORY_LOCATION-FAILURE':
      const inventoryRunDetailsData1 = state.inventoryRunDetails;
      const locationsData: any =
        inventoryRunDetailsData1.locations &&
        Object.values(inventoryRunDetailsData1.locations).filter(
          (item: ILocations) => {
            return item.code !== action.payload.response.data[0].code;
          },
        );
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          locations: locationsData,
        },
      };
    case 'REFRESH_ACQUISITION_COST-SUCCESS':
      const runCodeToUpdate = action.payload.data[0].code;
      const previousRunsData = state.inventoryRuns[runCodeToUpdate];
      return {
        ...state,
        inventoryRuns: {
          ...state.inventoryRuns,
          [runCodeToUpdate]: {
            ...previousRunsData,
            total: action.payload.data[0].total,
            totalValue: action.payload.data[0].total.value,
          },
        },
      };
    case 'FETCH_ASSOCIATED_RUN_LOCATIONS-FAILURE':
    case 'REFRESH_ACQUISITION_COST-FAILURE':
      const remodeRunCode = action.payload.response.data[0].code;
      const updatedRunsData = state.inventoryRuns[remodeRunCode]
        ? omit(state.inventoryRuns, remodeRunCode)
        : state.inventoryRuns;
      return { ...state, inventoryRuns: { ...updatedRunsData } };
    case 'UPDATE_UOM_FOR_LOCATION-SUCCESS':
      const runLocationData = state.inventoryRunDetails;
      const updatedLocationsArray: any =
        runLocationData.locations &&
        Object.values(runLocationData.locations).map((item: ILocations) => {
          if (item.code === action.payload.data[0].code) {
            item.unitOfMeasure = action.payload.data[0].unitOfMeasure;
          }
          return item;
        });
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          locations: updatedLocationsArray,
        },
      };
    case 'UPDATE_UOM_FOR_LOCATION-FAILURE':
      const locationData = state.inventoryRunDetails;
      const locationsArray: any =
        locationData.locations &&
        Object.values(locationData.locations).filter((item: ILocations) => {
          return item.code !== action.payload.response.data[0].code;
        });
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          locations: locationsArray,
        },
      };
    case 'REFRESH_LOCATION_ACQUISITION_COST-SUCCESS':
      const previousLocationData = state.inventoryRunDetails;
      const newLocationsArray: any =
        previousLocationData.locations &&
        Object.values(previousLocationData.locations).map((item: ILocations) => {
          if (item.code === action.payload.data[0].code) {
            item.total = action.payload.data[0].total;
          }
          return item;
        });
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          locations: newLocationsArray,
        },
      };
    case 'REFRESH_LOCATION_ACQUISITION_COST-FAILURE':
      const prevLocationData = state.inventoryRunDetails;
      const locationsArrayData: any =
        prevLocationData.locations &&
        Object.values(prevLocationData.locations).filter((item: ILocations) => {
          return item.code !== action.payload.response.data[0].code;
        });
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          locations: locationsArrayData,
        },
      };
    case 'ADD_EXISTING_LOCATIONS_MODAL_FETCH_LOCATIONS-SUCCESS':
      return {
        ...state,
        inventoryLocations: action.payload.data.entities.inventoryLocations,
      };

    case 'FETCH_LOCATION_DETAILS-SUCCESS':
      const inventoryLocationDetails = action.payload.data.result[0];
      const entries = mapLocationEntries(inventoryLocationDetails);
      return {
        ...state,
        inventoryLocationDetails: {
          ...inventoryLocationDetails,
          entries,
        },
      };
    case 'LOCATION_MAINTENANCE_FETCH_LOCATIONS-REQUEST':
      return {
        ...state,
        inventoryLocations: {},
      };
    case 'LOCATION_MAINTENANCE_DELETE_LOCATION-SUCCESS':
      const deletedLocationCode = action.payload.data[0].code;
      return {
        ...state,
        inventoryLocations: omit(state.inventoryLocations, deletedLocationCode),
      };
    case 'SAVE_LOCATION_NAME_CHANGE-SUCCESS':
      const updatedLocationName = action.payload.data[0].name;
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          name: updatedLocationName,
        },
      };
    case 'SAVE_SEQUENCE_NUMBER-SUCCESS':
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: mapLocationEntries(action.payload.data[0]),
        },
      };
    case 'SAVE_SEQUENCE_NUMBER-FAILURE':
      const prevInventoryLocationDetails = state.inventoryLocationDetails;
      const productsArrayData: any =
        prevInventoryLocationDetails.entries &&
        Object.values(prevInventoryLocationDetails.entries).filter(
          (product: any) => {
            return product.code !== action.meta.locationEntry.entries[0].code;
          },
        );
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: productsArrayData,
        },
      };
    case 'LOCATION_DETAILS_SET_SELECTED_PRODUCT_ITEMS':
      const existingLocationDetailsProducts = state.inventoryLocationDetails.entries;
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: existingLocationDetailsProducts,
        },
      };

    case 'DELETE_PRODUCTS-SUCCESS':
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: mapLocationEntries(action.payload.data[0]),
        },
      };

    case 'ADD-PRODUCT-BY-TENKEY-SUCCESS':
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: mapLocationEntries(action.payload.data[0]),
        },
      };
    case 'LOCATION_DETAILS_SET_ALL_SELECTED_PRODUCT_ITEMS':
      const existingLocationDetailsProductsData =
        state.inventoryLocationDetails.entries;
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: existingLocationDetailsProductsData,
        },
      };
    case 'REFRESH_PRODUCTS_ACQUISITION_COST-SUCCESS':
    case 'ADD_ABC_PRODUCTS-SUCCESS':
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: mapLocationEntries(action.payload.data[0]),
        },
      };
    case 'UPDATE_LOCATION_PRODUCT_DETAILS-SUCCESS':
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: mapLocationEntries(action.payload.data[0]),
        },
      };
    case 'CLOSE_PRODUCTS_SEARCH_MODAL':
    case 'CLOSE_MULTIPLE_PRODUCTS_MODAL':
      return {
        ...state,
        abcAndNonAbcProductDetails: {},
      };
    case 'LOCATION_DETAILS_FETCH_SEARCH_PRODUCT-SUCCESS':
      const abcAndNonAbcProductDetails =
        action.payload.data[0].productSearchDataList;
      return {
        ...state,
        abcAndNonAbcProductDetails,
      };
    case 'SEARCH_MULTI_PRODUCTS-SUCCESS':
      return {
        ...state,
        abcAndNonAbcProductDetails: action.payload.products,
      };
    case 'COPY-RUN-LOCATION-SUCCESS':
      const isDelete = action.meta.isDelete;
      const sourceCode = action.meta.source;
      const prevLocationsData = state.inventoryRunDetails;
      const locationsDataAfterDeleted: any =
        isDelete &&
        prevLocationsData.locations &&
        Object.values(prevLocationsData.locations).filter((item: ILocations) => {
          return item.code !== sourceCode;
        });
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          locations: isDelete
            ? locationsDataAfterDeleted
            : prevLocationsData.locations,
        },
      };
    case 'LOCATION_MAINTENANCE_CREATE_LOCATION_ADD_TO_RUN-SUCCESS':
      const newLocation = action.payload.data;
      const updatedLocations = (state.inventoryRunDetails.locations as any).concat(
        newLocation,
      );
      return {
        ...state,
        inventoryRunDetails: {
          ...state.inventoryRunDetails,
          locations: updatedLocations,
        },
      };
    case 'LOCATION_DETAILS_ADD_PRODUCT-SUCCESS':
      const inventoryLocationDetailsEntries = action.payload.data[0];
      const entriesData = mapLocationEntries(inventoryLocationDetailsEntries);
      return {
        ...state,
        inventoryLocationDetails: {
          ...state.inventoryLocationDetails,
          entries: entriesData,
        },
      };
    default:
      return state;
  }
};
