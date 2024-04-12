'use client'

import { getPayload } from './getPayload'

export const validatePermission: (
  module: string,
  permission?: string
) => boolean = (module, permission) => {
  const token = getPayload()
  const modulePermissions = token?.permission?.[module]
  if (!modulePermissions) return false
  if (permission) return modulePermissions.includes(permission)
  else return true
}
