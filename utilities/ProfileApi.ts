import ApiRequest from '~/api-request'
import { Endpoints } from '~/constants/Endpoints'
import {
  ProfileAlertsPageInterface,
  ProfileMembersPageInterface,
  ProfileSummaryInterface,
  ProfileTimelineRowInterface,
  ProfileType,
  TimelineGranularity,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { World } from '~/ps2alerts-constants/world'

export interface ProfileScope {
  type: ProfileType
  id: string
  world?: World | null
  days?: number | null
}

const scopeParams = (scope: ProfileScope): Record<string, string | number> => {
  const params: Record<string, string | number> = {}

  if (scope.world) {
    params.world = scope.world
  }

  if (scope.days) {
    params.days = scope.days
  }

  return params
}

const endpoint = (template: string, scope: ProfileScope): string =>
  template.replace('{type}', scope.type).replace('{id}', scope.id)

// Thin client for the API's /profiles endpoints
export const profileApi = {
  summary(scope: ProfileScope): Promise<ProfileSummaryInterface> {
    return new ApiRequest().get<ProfileSummaryInterface>(
      endpoint(Endpoints.PROFILE_SUMMARY, scope),
      scopeParams(scope)
    )
  },
  timeline(
    scope: ProfileScope,
    granularity: TimelineGranularity
  ): Promise<ProfileTimelineRowInterface[]> {
    return new ApiRequest().get<ProfileTimelineRowInterface[]>(
      endpoint(Endpoints.PROFILE_TIMELINE, scope),
      { ...scopeParams(scope), granularity }
    )
  },
  alerts(
    scope: ProfileScope,
    page: number,
    pageSize: number,
    sortBy: string,
    order: 'asc' | 'desc'
  ): Promise<ProfileAlertsPageInterface> {
    return new ApiRequest().get<ProfileAlertsPageInterface>(
      endpoint(Endpoints.PROFILE_ALERTS, scope),
      { ...scopeParams(scope), page, pageSize, sortBy, order }
    )
  },
}

export const outfitMembers = (
  id: string,
  world: World | null | undefined,
  page: number,
  pageSize: number,
  sortBy: string,
  order: 'asc' | 'desc'
): Promise<ProfileMembersPageInterface> =>
  new ApiRequest().get<ProfileMembersPageInterface>(
    Endpoints.PROFILE_OUTFIT_MEMBERS.replace('{id}', id),
    { ...(world ? { world } : {}), page, pageSize, sortBy, order }
  )

export const profileLink = (
  type: ProfileType,
  id: string,
  world?: World | null
): string => {
  const path = type === 'character' ? `/player/${id}` : `/outfit/${id}`
  return world ? `${path}?world=${world}` : path
}
