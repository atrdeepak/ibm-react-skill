import { Fonts, PrimaryIcons } from 'hss_components';
import React from 'react';
import styled from 'styled-components';
import IDefaultProps from 'types/styled-component-props';

interface IHeaderColumnPros extends IDefaultProps {
  /**
   *  Width of the column header
   */
  width?: string;

  /**
   * unique id
   */
  id: string;
  /**
   *  Currently selected option in Sort By dropdown
   */
  sortId?: string;

  /**
   * True if Sort items in descending order.
   * This means arranging from the highest value to the lowest (e.g. z-a, 9-0).
   */
  isSortDesc?: boolean;

  /**
   *  Callback action coluomn header click
   */
  onClick?: (sortId: string, isSortDesc: boolean) => void;

  /**
   * Is Column Selected
   */
  isSelected?: boolean;

  /**
   *  True if default is Descending for the column
   *  Default sort is Ascending .
   */
  isDefaultSortDesc?: boolean;
}

const DescendingCarat = styled(PrimaryIcons.DownSortCarat)`
  align-self: center;
  margin-left: 8px;
  path {
    stroke: ${props => props.theme.colors.grey2};
  }
`;

const AscendingCarat = styled(PrimaryIcons.UpSortCarat)`
  align-self: center;
  margin-left: 8px;
  path {
    stroke: ${props => props.theme.colors.grey2};
  }
`;

const TableCellElement = styled(Fonts.Body12)`
  width: ${(props: IHeaderColumnPros) =>
    props.width ? `${props.width}px` : 'auto'};
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 8px 0px;
  background-color: ${props =>
    props.isSelected ? props.theme.colors.grey2 : props.theme.colors.grey1};
  overflow: hidden;
`;

/** List Head Cell */
export const ListHeadCell: React.SFC<IHeaderColumnPros> = ({
  className,
  children,
  onClick,
  sortId,
  isSortDesc,
  id,
  isDefaultSortDesc,
  ...props
}) => {
  const isSelected = sortId === id;
  const renderSortCarat = () =>
    isSelected && (isSortDesc ? <DescendingCarat /> : <AscendingCarat />);
  const handleHeaderClick = () =>
    onClick(id, isSelected ? !isSortDesc : !!isDefaultSortDesc);

  return (
    <TableCellElement
      className={className}
      isSelected={isSelected}
      onClick={handleHeaderClick}
      {...props}
    >
      {children}
      {renderSortCarat()}
    </TableCellElement>
  );
};
