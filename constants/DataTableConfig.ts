export const DataTableConfig = {
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
  ...DataTableConfig,
  'sort-by': ['totals.kills'],
}

export const AlertLoadoutLeaderboardConfig = {
  ...DataTableConfig,
  'items-per-page': 24,
  'footer-props': {
    itemsPerPageOptions: [24],
  },
}

export const StatisticsServerLeaderboardConfig = {
  ...DataTableConfig,
  'sort-by': ['kd'],
  'hide-default-footer': true,
}

export const StatisticsFactionLeaderboardConfig = {
  ...DataTableConfig,
  'sort-by': ['kd'],
  'items-per-page': 28,
  'multi-sort': true,
  'must-sort': false,
  'footer-props': {
    itemsPerPageOptions: [28],
  },
}

export const StatisticsVehicleLeaderboardConfig = {
  ...DataTableConfig,
  'sort-by': ['totals.kd'],
}

export const StatisticsLoadoutLeaderboardConfig = {
  ...DataTableConfig,
  'sort-by': ['kd'],
  'items-per-page': 24,
  'footer-props': {
    itemsPerPageOptions: [24],
  },
}

export const StatisticsLoadoutServerMetricsLeaderboardConfig = {
  ...DataTableConfig,
  'sort-by': ['kd'],
  'multi-sort': true,
  'must-sort': false,
}
