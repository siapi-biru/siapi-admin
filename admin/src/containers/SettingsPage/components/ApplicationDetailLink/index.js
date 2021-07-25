import React, { memo } from 'react';
import { Text } from '@buffetjs/core';
import { FormattedMessage } from 'react-intl';
import { useGlobalContext } from 'siapi-helper-plugin';
import Icon from './Icon';
import Link from './Link';
import Notif from './Notif';
import Wrapper from './Wrapper';

const ApplicationDetailLink = () => {
  const { shouldUpdateSiapi } = useGlobalContext();

  return (
    <Wrapper>
      <Link to="/settings/application-infos">
        <Icon />
        <Text lineHeight="34px">
          <FormattedMessage id="Settings.application.title" />
        </Text>
        {shouldUpdateSiapi && <Notif />}
      </Link>
    </Wrapper>
  );
};

export default memo(ApplicationDetailLink);
