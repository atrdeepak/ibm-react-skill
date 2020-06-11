import Permissions from 'components/permissions';
import Toggleable from 'components/toggleable';
import {
  ExpandingRoundActionButtonGroup,
  Fonts,
  ImportOrderButton,
  NewOrderButton,
  Tooltip,
} from 'hss_components';
import {
  PageSearchFilter,
  PageSelectActiveAccount,
} from 'modules/page-filters/filters';
import { PageKey } from 'modules/page-filters/page-filter-enums';
import { PageFilters } from 'modules/page-filters/page-filter-provider';
import {
  openRunImportModal,
  showOrHideCreateRunModal,
} from 'modules/physical-inventory/runs/thunk.inventory-runs';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import { IPermissionActions, Permission } from 'types/permissions';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 25px 0;
  width: 1184px;
`;

const TabName = styled(Fonts.Display32)`
  flex: none;
  padding-right: 16px;
  border-right: 1px solid ${props => props.theme.colors.grey3};
`;

const StyledRunPageFilters = styled(PageFilters)`
  justify-content: space-between;
  margin-left: 16px;
  width: 100%;
  align-items: flex-end;
`;
const StyledPageSelectActiveAccount = styled.div`
  padding-bottom: 2px;
  display: flex;
`;

const SearchAndFilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const StyledAddRunButton = styled(ExpandingRoundActionButtonGroup)`
  height: 48px;
  width: 48px;
`;

const StyledToolTip = styled(Tooltip.TooltipRegular)`
  position: absolute;
`;

const StyledCreateNewRunButton = styled(NewOrderButton)``;

type IProps = IDispatchProp;

/** Inventory Runs Header Component */
const InventoryRunsHeaderComponent: React.SFC<IProps> = props => {
  const renderPageSelectActiveAccount = (enabled: boolean, disabled: boolean) => {
    return (
      <PageSelectActiveAccount
        disable={disabled}
        title={'Select account to view associated Inventory Runs.'}
      />
    );
  };

  const renderWithPermissionsPageSelectActiveAccount = (
    <Permissions hasPermissions={[Permission.PI_RUN_ACCOUNT_SEELECTOR]}>
      {({
        [Permission.PI_RUN_ACCOUNT_SEELECTOR]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) && renderPageSelectActiveAccount(enabled, disabled)
      }
    </Permissions>
  );

  const renderPageSearchFilter = (enabled: boolean, disabled: boolean) => {
    return (
      <PageSearchFilter
        disabled={disabled}
        shouldDebounce
        placeholder="Search Runs.."
      />
    );
  };

  const renderWithPermissionsPageSearchFilter = (
    <Permissions hasPermissions={[Permission.PI_RUN_ACCOUNT_SEELECTOR]}>
      {({
        [Permission.PI_RUN_ACCOUNT_SEELECTOR]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) && renderPageSearchFilter(enabled, disabled)
      }
    </Permissions>
  );

  const renderRunPageHeader = () => {
    return (
      <StyledRunPageFilters pageKey={PageKey.INVENTORY_RUN}>
        <StyledPageSelectActiveAccount>
          {renderWithPermissionsPageSelectActiveAccount}
        </StyledPageSelectActiveAccount>
        <SearchAndFilterContainer>
          {renderWithPermissionsPageSearchFilter}
        </SearchAndFilterContainer>
      </StyledRunPageFilters>
    );
  };
  const openCreateRunModal = () => {
    props.dispatch(showOrHideCreateRunModal());
  };

  const openImportRunModal = () => {
    props.dispatch(openRunImportModal());
  };

  const renderCreateRunButton = (enabled: boolean, disabled: boolean) => {
    return (
      <StyledCreateNewRunButton
        className="btn-fab-icon-1"
        isDisabled={disabled}
        data-tip
        data-for="create-new-run-tooltip"
        border
        onClick={openCreateRunModal}
        useHoverEffects
      />
    );
  };

  const renderWithPermissionsCreateRunButton = (
    <Permissions hasPermissions={[Permission.PI_RUN_FAB_CREATE_RUN]}>
      {({
        [Permission.PI_RUN_FAB_CREATE_RUN]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) && renderCreateRunButton(enabled, disabled)
      }
    </Permissions>
  );

  const renderImportOrderButton = (enabled: boolean, disabled: boolean) => {
    return (
      <ImportOrderButton
        className="btn-fab-icon-2"
        isDisabled={disabled}
        data-tip
        data-for="import-run-tooltip"
        border
        onClick={openImportRunModal}
      />
    );
  };

  const renderWithPermissionsImportOrderButton = (
    <Permissions hasPermissions={[Permission.PI_RUN_FAB_IMPORT_RUN]}>
      {({
        [Permission.PI_RUN_FAB_IMPORT_RUN]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) && renderImportOrderButton(enabled, disabled)
      }
    </Permissions>
  );

  const renderCreateRunTooltip = (enabled: boolean, disabled: boolean) => {
    return (
      <StyledToolTip
        className="fab-icon-tooltip"
        disable={disabled}
        hideTail={true}
        id="create-new-run-tooltip"
        placement="left"
      >
        Create New Run
      </StyledToolTip>
    );
  };

  const renderWithPermissionsCreateRunTooltip = (
    <Permissions hasPermissions={[Permission.PI_RUN_FAB_CREATE_RUN]}>
      {({
        [Permission.PI_RUN_FAB_CREATE_RUN]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) && renderCreateRunTooltip(enabled, disabled)
      }
    </Permissions>
  );

  const renderImportRunTooltip = (enabled: boolean, disabled: boolean) => {
    return (
      <StyledToolTip
        disable={disabled}
        hideTail={true}
        id="import-run-tooltip"
        placement="left"
      >
        Import Run
      </StyledToolTip>
    );
  };

  const renderWithPermissionsImportRunTooltip = (
    <Permissions hasPermissions={[Permission.PI_RUN_FAB_IMPORT_RUN]}>
      {({
        [Permission.PI_RUN_FAB_IMPORT_RUN]: { enabled, disabled },
      }: IPermissionActions) =>
        (enabled || disabled) && renderImportRunTooltip(enabled, disabled)
      }
    </Permissions>
  );

  const renderCreateNewRunButton = () => {
    return (
      <Toggleable>
        {({ on, toggle }) => (
          <div data-tip data-for="expand-button-tooltip">
            <StyledAddRunButton isOpen={on} onClick={toggle}>
              {renderWithPermissionsCreateRunButton}
              {renderWithPermissionsImportOrderButton}
              {renderWithPermissionsCreateRunTooltip}
              {renderWithPermissionsImportRunTooltip}
            </StyledAddRunButton>
          </div>
        )}
      </Toggleable>
    );
  };

  return (
    <HeaderContainer>
      <TabName>Inventory Runs</TabName>
      {renderRunPageHeader()}
      {renderCreateNewRunButton()}
    </HeaderContainer>
  );
};

/** Export Inventory Runs Header Component */
export const InventoryRunsHeader = connect<{}, IDispatchProp, {}>(null)(
  InventoryRunsHeaderComponent,
);
