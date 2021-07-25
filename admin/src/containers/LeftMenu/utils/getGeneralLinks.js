import cloneDeep from 'lodash/cloneDeep';
import checkPermissions from './checkPermissions';
import { SETTINGS_BASE_URL } from '../../../config';
import getSettingsMenuLinksPermissions from './getSettingsMenuLinksPermissions';

const getGeneralLinks = async (
  permissions,
  generalSectionRawLinks,
  settingsMenu,
  shouldUpdateSiapi
) => {
  const generalSectionPermissionsPromises = checkPermissions(permissions, generalSectionRawLinks);
  const generalSectionLinksPermissions = await Promise.all(generalSectionPermissionsPromises);

  const authorizedGeneralSectionLinks = generalSectionRawLinks.filter(
    (_, index) => generalSectionLinksPermissions[index]
  );

  const settingsLinkPermissions = getSettingsMenuLinksPermissions(settingsMenu);
  const settingsLinkIndex = authorizedGeneralSectionLinks.findIndex(
    obj => obj.destination === SETTINGS_BASE_URL
  );

  if (settingsLinkIndex === -1) {
    return [];
  }

  const hasPermission = settingsLinkPermissions.every(Boolean);

  if (!hasPermission) {
    return [];
  }

  const authorizedGeneralLinksClone = cloneDeep(authorizedGeneralSectionLinks);

  authorizedGeneralLinksClone[settingsLinkIndex].permissions = settingsLinkPermissions;
  authorizedGeneralLinksClone[settingsLinkIndex].notificationCount = shouldUpdateSiapi ? 1 : 0;

  return authorizedGeneralLinksClone;
};

export default getGeneralLinks;
