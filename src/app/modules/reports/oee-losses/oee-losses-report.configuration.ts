export const OEEReportConfiguration =
    [
        {
            reportName: 'By Month',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["month", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'monthName', level: 1, displayName: "Month" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Year',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["year", "month", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'year', level: 1, displayName: "Year" },
                { name: 'monthName', level: 2, displayName: "Month" }
            ]
        },
        {
            reportName: 'By Area',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["area", "country", "location", "year", "dateOfLoss"], orders: ["asc", "asc", "asc", "asc", "asc"] },
            groups: [
                { name: 'area', level: 1, displayName: "Area" },
                { name: 'country', level: 2, displayName: "Country" },
                { name: 'location', level: 3, displayName: "Location" },
                { name: 'year', level: 4, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Country',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["country", "location", "year", "dateOfLoss"], orders: ["asc", "asc", "asc", "asc"] },
            groups: [
                { name: 'country', level: 1, displayName: "Country" },
                { name: 'location', level: 2, displayName: "Location" },
                { name: 'year', level: 3, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Cause',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["cause", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'cause', level: 1, displayName: "Cause" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Category 1',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["category1", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'category1', level: 1, displayName: "Category 1" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Category 2',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["category2", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'category2', level: 1, displayName: "Category 2" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Cost Categories - Actual',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual OEE US$', key: 'oeeClaim', operation: 'sum', showTotal: true }
            ],
            orderBy: { columns: ["actualOEECategory", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'actualOEECategory', level: 1, displayName: "Actual OEE Claim" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Cost Categories - Indexed',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Indexed OEE US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true }
            ],
            orderBy: { columns: ["indexedOEECategory", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'indexedOEECategory', level: 1, displayName: "Indexed OEE Claim" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Depth Category',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual OEE US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Total Indexed OEE US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true }
            ],
            orderBy: { columns: ["displayOrder", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'depthCategoryRange', level: 1, displayName: "Depth Category" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By Status',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: 'Status of Well', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["drillingStatus", "dateOfLoss"], orders: ["asc", "asc"] },
            groups: [
                { name: 'drillingStatus', level: 1, displayName: "Drilling Status" }
            ]
        },
        {
            reportName: 'By Rating Area',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: 'Rating Area', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["ratingArea", "dateOfLoss"], orders: ["asc", "asc"] },
            groups: [
                { name: 'ratingArea', level: 1, displayName: "Rating Area" }
            ]
        },
        {
            reportName: 'By Well Type',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: 'Well Type', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Actual US$', key: 'averageOEEActual', operation: 'divide', numerator: 'oeeClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average OEE Indexed US$', key: 'averageOEEIndexed', operation: 'divide', numerator: 'indexedOEEClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["wellType", "dateOfLoss"], orders: ["asc", "asc"] },
            groups: [
                { name: 'wellType', level: 1, displayName: "Well Type" }
            ]
        },
        {
            reportName: 'Full List By Year - All Losses',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Sub Category', key: 'category2', operation: '', showTotal: false },
                { displayName: 'Cause', key: 'cause', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'OP / CAR', key: 'caR_OP', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["year", "oeeClaim", "dateOfLoss"], orders: ["asc", "desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Year - Actual',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'Rating Area', key: 'ratingArea', operation: '', showTotal: false },
                { displayName: 'Well Status', key: 'drillingStatus', operation: '', showTotal: false },
                { displayName: 'UGBO', key: 'ugbo', operation: '', showTotal: false },
                { displayName: 'Depth (feet)', key: 'depthAtLoss', operation: '', showTotal: false },
                { displayName: 'ProjTD (feet)', key: 'ptd', operation: '', showTotal: false },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["year", "oeeClaim", "dateOfLoss"], orders: ["asc", "desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Year - Indexed',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'Rating Area', key: 'ratingArea', operation: '', showTotal: false },
                { displayName: 'Well Status', key: 'drillingStatus', operation: '', showTotal: false },
                { displayName: 'UGBO', key: 'ugbo', operation: '', showTotal: false },
                { displayName: 'Depth (feet)', key: 'depthAtLoss', operation: '', showTotal: false },
                { displayName: 'ProjTD (feet)', key: 'ptd', operation: '', showTotal: false },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["year", "indexedOEEClaim", "dateOfLoss"], orders: ["asc", "desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Value - All Losses',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Sub Category', key: 'category2', operation: '', showTotal: false },
                { displayName: 'Cause', key: 'cause', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'OP / CAR', key: 'caR_OP', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["oeeClaim", "dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Value - Actual',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'Rating Area', key: 'ratingArea', operation: '', showTotal: false },
                { displayName: 'Well Status', key: 'drillingStatus', operation: '', showTotal: false },
                { displayName: 'UGBO', key: 'ugbo', operation: '', showTotal: false },
                { displayName: 'Depth (feet)', key: 'depthAtLoss', operation: '', showTotal: false },
                { displayName: 'ProjTD (feet)', key: 'ptd', operation: '', showTotal: false },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["oeeClaim", "dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Value - Indexed',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'Rating Area', key: 'ratingArea', operation: '', showTotal: false },
                { displayName: 'Well Status', key: 'drillingStatus', operation: '', showTotal: false },
                { displayName: 'UGBO', key: 'ugbo', operation: '', showTotal: false },
                { displayName: 'Depth (feet)', key: 'depthAtLoss', operation: '', showTotal: false },
                { displayName: 'ProjTD (feet)', key: 'ptd', operation: '', showTotal: false },
                { displayName: 'OEE Indexed US$', key: 'indexedOEEClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["indexedOEEClaim", "dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        }
    ];