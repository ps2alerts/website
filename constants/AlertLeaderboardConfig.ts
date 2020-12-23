export const AlertLeaderboardConfig = {
  dark: true,
  dense: true,
  'sort-by': ['kills'],
  'sort-desc': [true],
  'single-expand': true,
  'items-per-page': 20,
  'must-sort': true,
  'footer-props': {
    itemsPerPageOptions: [10, 20, 50, 100],
    showCurrentPage: true,
    showFirstLastPage: true,
  },
}

export const AlertVehicleLeaderboardConfig = {
  ...AlertLeaderboardConfig,
  'sort-by': ['totals.kills'],
}

export const AlertLoadoutLeaderboardConfig = {
  ...AlertLeaderboardConfig,
  'items-per-page': 24,
  'footer-props': {
    itemsPerPageOptions: [24],
  },
}

export const StatisticsServerLeaderboardConfig = {
  ...AlertLeaderboardConfig,
  'sort-by': ['totals.kd'],
  'hide-default-footer': true,
  'must-sort': true,
}

export const StatisticsFactionLeaderboardConfig = {
  ...AlertLeaderboardConfig,
  'sort-by': ['kd'],
  'items-per-page': 28,
  'must-sort': false,
  'multi-sort': true,
  'footer-props': {
    itemsPerPageOptions: [28],
  },
}

export const StatisticsVehicleLeaderboardConfig = {
  ...AlertLeaderboardConfig,
  'sort-by': ['totals.kd'],
}
