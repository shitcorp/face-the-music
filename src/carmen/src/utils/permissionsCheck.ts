export default (
  allocatedPerms: string[],
  requiredPerms: string[],
) => {
  const permsMissing: string[] = [];

  // loop through all channel perms
  perms.forEach((perm) => {
    // if doesn't have the permission
    if (!permsMissing.has(perm)) permsMissing.push(perm);
  });

  if (perms.length > 0) {
    return perms;
  }
  return true;
};
