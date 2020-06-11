import { inventoryRunsSchema } from 'modules/entities/schemas/physical-inventory/inventoryRuns.schema';
import getSearchResults from 'modules/entities/selectors/page-search';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { getSelectedAccountForPageKey } from 'modules/page-filters/page-filters.selectors';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import IGlobalState from 'types/global-state';

const inventoryRunSchema = {
  name: 'string',
  code: 'string',
  accountName: 'string',
  b2bUnitId: 'string',
};

/** Get Search term from state */
const getSearchTerm = (state: IGlobalState) =>
  state.pageFilters[PageKey.INVENTORY_RUN]
    ? state.pageFilters[PageKey.INVENTORY_RUN].searchTerm
    : '';

const getEntities = (state: IGlobalState) => state.entities;

/** Get Selected Account for the Create run Modal */
export const getSelectedAccountForCreateRunModal = (state: IGlobalState) => {
  const selectedAccount =
    state.physicalInventory.inventoryRuns.selectedNewRunAccount;
  const newaccount = selectedAccount ? selectedAccount : getSelectedAccount(state);
  return newaccount;
};

/** Get Selected Account for the Inventory run */
export const getSelectedAccount = (state: IGlobalState) => {
  const selectedAccount = getSelectedAccountForPageKey(state, PageKey.INVENTORY_RUN);
  return selectedAccount;
};
/** get all exceptions */
export const getAllInventoryRuns = createSelector(getEntities, entities => {
  return denormalize(
    Object.keys(entities.inventoryRuns),
    [inventoryRunsSchema],
    entities,
  );
});

/** Get Filter Runs based on search term from state */
export const getSortedInitialRun = createSelector(
  getAllInventoryRuns,
  getSearchTerm,
  (allInventoryRuns, searchTerm) => {
    return searchTerm
      ? getSearchResults(allInventoryRuns, searchTerm, inventoryRunSchema)
      : allInventoryRuns;
  },
);

/** Get Sorted Runs from state */
export const getInventoryRuns = createSelector(
  getSortedInitialRun,
  inventoryRuns => {
    return inventoryRuns;
  },
);
