import semver from 'semver';

const checkLatestSiapiVersion = (currentPackageVersion, latestPublishedVersion) => {
  if (!semver.valid(currentPackageVersion) || !semver.valid(latestPublishedVersion)) {
    return false;
  }

  return semver.lt(currentPackageVersion, latestPublishedVersion);
};

export default checkLatestSiapiVersion;
