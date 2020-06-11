import { colors, Fonts, IModalFooterProps } from 'hss_components';
import React from 'react';
import styled from 'styled-components';
import { ActionReturn } from 'types/redux';

/** Style for create department modal page number */
export const PageNumber = styled(Fonts.Body16)`
  align-self: flex-start;
  padding-top: 2px;
`;

/** Style for create department modal header */
export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: 'row';
  padding: 24px 29px 16px 24px;
`;

/** Style for create department modal sub header */
export const SubHeaderContainer = styled.div`
  padding: 10px 0px 0px 0px;
`;

/** Style for create department modal title */
export const TitleContainer = styled.div`
  flex-grow: 1;
`;

/** Create header for multi page modals */
export const renderModalHeader = (
  title: string,
  subtitle: string,
  pageNumber: string,
  totalPages: number,
) => (
  <HeaderContainer>
    <TitleContainer>
      <Fonts.Display24 color={colors.grey6}>{title}</Fonts.Display24>
      {subtitle.length > 0 && (
        <SubHeaderContainer>
          <Fonts.Body14 color={colors.grey6}>{subtitle}</Fonts.Body14>
        </SubHeaderContainer>
      )}
    </TitleContainer>
    {pageNumber.length > 0 && (
      <PageNumber color={colors.grey6}>
        {pageNumber} of {totalPages}
      </PageNumber>
    )}
  </HeaderContainer>
);

/**  configruation for modal footer */
export interface IFooterConfigMap {
  closeFn: (...args: any[]) => ActionReturn | void;
  backFn: (...args: any[]) => ActionReturn | void;
  confirmFn: (...args: any[]) => ActionReturn | void;
  disableConfirmBtn: boolean;
  confirmBtnText: string;
  showBackBtn: boolean;
}

/** Footer configuration for modal footer functionality */
export const FooterConfig = (config: IFooterConfigMap): IModalFooterProps => ({
  backgroundColor: 'grey1',
  closeFn: config.closeFn,
  confirmBtnText: config.confirmBtnText,
  confirmFn: config.confirmFn,
  showBackBtn: config.showBackBtn,
  backFn: config.backFn,
  wideCancelBtn: true,
  wideConfirmBtn: true,
  disableConfirmBtn: config.disableConfirmBtn,
});
