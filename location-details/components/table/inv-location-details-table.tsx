import EmptyState, { EmptyStateIcon } from 'components/empty-state';
import { LoadingSpinnerCentered } from 'components/loading-spinner-centered';
import { LocationTableRow } from 'modules/physical-inventory/location-details/components/table/inv-location-table-row';
import { getAllLocationEntries } from 'modules/physical-inventory/location-details/inventory-location-details-selectors';
import React from 'react';
import { connect } from 'react-redux';
import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  WindowScroller,
} from 'react-virtualized';
import styled from 'styled-components';
import { IDispatchProp } from 'types/dispatch-prop';
import IGlobalState from 'types/global-state';
import { ILocationEntry } from 'types/inventory-location-details';
import IDefaultProps from 'types/styled-component-props';

interface IStateProps {
  /**
   *  indicates if loading spinner is on the page
   */
  isLoading?: boolean;

  /**
   *  View type to toggle the exceptions
   */
  isExceptionsView: boolean;

  /**
   * all Location Entries
   */
  locationEntries: ILocationEntry[];
}

const StyledEmptyState = styled(EmptyState)`
  padding-top: 60px;
`;

const ListWrapper = styled.div`
  .ReactVirtualized__Grid {
    outline: none;
  }
`;

type IProps = IDefaultProps & IStateProps & IDispatchProp;

const LocationTableComponent: React.SFC<IProps> = props => {
  const locationEntriesCount = props.locationEntries
    ? props.locationEntries.length
    : 0;

  const cache = new CellMeasurerCache({
    defaultHeight: 100,
    fixedWidth: true,
  });

  const renderEmptyState = () => {
    const mainText =
      locationEntriesCount === 0
        ? props.isExceptionsView
          ? 'No Exceptions'
          : 'No Products'
        : 'This Location is Empty';
    const children =
      locationEntriesCount === 0 && !props.isExceptionsView
        ? 'Add products manually above'
        : null;

    return (
      <StyledEmptyState
        type={EmptyStateIcon.NO_PRODUCTS}
        mainText={mainText}
        children={children}
      />
    );
  };

  const renderLoadingSpinner = () => <LoadingSpinnerCentered />;

  const renderRow = ({ index, isScrolling, key, parent, style }: any) => {
    const entry = props.locationEntries[index];
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div key={entry.code} style={style}>
          <LocationTableRow entry={entry} />
        </div>
      </CellMeasurer>
    );
  };

  const renderList = () => {
    const rowCount = props.locationEntries.length;

    return (
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <List
            style={{ willChange: 'scroll-position', overflow: 'auto' }}
            autoHeight
            rowRenderer={renderRow}
            columnCount={1}
            onScroll={onChildScroll}
            scrollTop={scrollTop}
            isScrolling={isScrolling}
            height={height}
            rowCount={rowCount}
            width={1232}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
          />
        )}
      </WindowScroller>
    );
  };

  const renderLocationDetails = () =>
    props.isLoading
      ? renderLoadingSpinner()
      : locationEntriesCount > 0
      ? renderList()
      : renderEmptyState();

  return <ListWrapper>{renderLocationDetails()} </ListWrapper>;
};

const mapStateToProps = (state: IGlobalState): IStateProps => {
  return {
    isLoading: state.physicalInventory.inventoryLocationDetails.isLoading,
    isExceptionsView:
      state.physicalInventory.inventoryLocationDetails.isExceptionsView,
    locationEntries: getAllLocationEntries(state),
  };
};

/** export location Details Table Component */
export const LocationDetailsTable = connect<IStateProps, IDispatchProp>(
  mapStateToProps,
)(LocationTableComponent);
