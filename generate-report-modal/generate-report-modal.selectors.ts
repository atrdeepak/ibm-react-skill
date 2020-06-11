import { inventoryLocationSchema } from 'modules/entities/schemas/physical-inventory/inventory-locations-schema';
import { inventoryRunsSchema } from 'modules/entities/schemas/physical-inventory/inventoryRuns.schema';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import IGlobalState from 'types/global-state';
import { IInventoryRuns } from 'types/inventory-runs';

const getEntities = (state: IGlobalState) => state.entities;

/** export generate report modal selector */
export const getLocationsDropdownData = createSelector(getEntities, entities => {
  return denormalize(
    Object.keys(entities.inventoryLocations || []),
    [inventoryLocationSchema],
    entities,
  );
});

/** selector for getting all the locations names for Generate report dropdown options */
export const getLocationListDropdownOptions = createSelector(
  getLocationsDropdownData,
  locationObjectsArr => {
    const locationNames =
      locationObjectsArr &&
      locationObjectsArr.map((locationObj: any) => locationObj.name);
    const AllLocationNames = locationNames.length
      ? ['All'].concat(locationNames)
      : [];
    return AllLocationNames;
  },
);

/** export generate report modal selector */
export const getComparisonRunDropdownData = createSelector(getEntities, entities => {
  return denormalize(
    Object.keys(entities.inventoryRuns || []),
    [inventoryRunsSchema],
    entities,
  );
});

const getSelectedRunCode = (state: IGlobalState) =>
  state.physicalInventory.generateReportModal.selectedRunCode;

/** get the all possible target run Names as dropdown options for comparison report Modal  */
export const getComparisonRunDropdownOptions = createSelector(
  getComparisonRunDropdownData,
  getSelectedRunCode,
  (allRuns, selectedRunCode) => {
    const runsDataForDropdown =
      allRuns.length > 1 // to ensure target run is available
        ? allRuns.filter((item: IInventoryRuns) => item.code !== selectedRunCode)
        : [];
    return (
      runsDataForDropdown &&
      runsDataForDropdown.map((runObject: IInventoryRuns) => runObject.name)
    );
  },
);
