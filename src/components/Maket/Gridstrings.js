import { GridLocaleText} from '@material-ui/data-grid';

const Gridstrings: GridLocaleText = {
  // Root
  rootGridLabel: 'grid',
  noRowsLabel: 'Нет макетов',
  errorOverlayDefaultLabel: 'An error occurred.',

  // Density selector toolbar button text
  toolbarDensity: 'Density',
  toolbarDensityLabel: 'Density',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Comfortable',

  // Columns selector toolbar button text
  toolbarColumns: 'Columns',
  toolbarColumnsLabel: 'Select columns',

  // Filters toolbar button text--------------------
  toolbarFilters: 'Filters',
  toolbarFiltersLabel: 'Show filters',
  toolbarFiltersTooltipHide: 'Hide filters',
  toolbarFiltersTooltipShow: 'Show filters',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} active filters` : `${count} active filter`,

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Download as CSV',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Найти колонку',//'Find column',
  columnsPanelTextFieldPlaceholder: 'Название колонки',
  columnsPanelDragIconLabel: 'Reorder column',
  columnsPanelShowAllButton: 'Показать все',
  columnsPanelHideAllButton: 'Скрыть  все',

  // Filter panel text
  filterPanelAddFilter: 'Add filter',
  filterPanelDeleteIconLabel: 'Delete',
  filterPanelOperators: 'Вид сравнения',
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: 'Колонка',//'Columns',
  filterPanelInputLabel: 'Значение',//'Value',
  filterPanelInputPlaceholder: 'Значение фильтра',

  // Filter operators text
  filterOperatorContains: 'содержит',
  filterOperatorEquals: 'равно',//'equals',
  filterOperatorStartsWith: 'начинается с',//'starts with',
  filterOperatorEndsWith: 'заканчивается на',//'ends with',
  filterOperatorIs: 'is',
  filterOperatorNot: 'is not',
  filterOperatorAfter: 'is after',
  filterOperatorOnOrAfter: 'is on or after',
  filterOperatorBefore: 'is before',
  filterOperatorOnOrBefore: 'is on or before',

  // Filter values text
  filterValueAny: 'any',
  filterValueTrue: 'true',
  filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Настройки колонок',
  columnMenuFilter: 'Фильтр',//'Filter',
  columnMenuHideColumn: 'Скрыть колонку',
  columnMenuUnsort: 'Отключить сортировку',
  columnMenuSortAsc: 'Сортировать по возрастанию',
  columnMenuSortDesc: 'Сортировать по убыванию',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} active filters` : `${count} active filter`,
  columnHeaderFiltersLabel: 'Show filters',
  columnHeaderSortIconLabel: 'Sort',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} rows selected`
      : `${count.toLocaleString()} row selected`,

  // Total rows footer text
  footerTotalRows: 'Total Rows:',

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Checkbox selection',

  // Boolean cell text
  booleanCellTrueLabel: 'true',
  booleanCellFalseLabel: 'false',
};


export default  Gridstrings;