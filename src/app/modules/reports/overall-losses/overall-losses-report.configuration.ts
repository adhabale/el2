export const OverallReportConfiguration =
    [
        {
            reportName: 'By Month',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
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
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
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
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
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
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
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
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
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
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
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
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["category2", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'category2', level: 1, displayName: "Category 2" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By PD Cost Categories - Actual',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual PD US$', key: 'pdLiabClaim', operation: 'sum', showTotal: true }
            ],
            orderBy: { columns: ["actualPDLiabCategory", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'actualPDLiabCategory', level: 1, displayName: "Actual PD Claim" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By OEE Cost Categories - Actual',
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
            reportName: 'By Total Cost Categories - Actual',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: 'sum', showTotal: true }
            ],
            orderBy: { columns: ["actualTotalCategory", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'actualTotalCategory', level: 1, displayName: "Actual Total Claim" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By PD Cost Categories - Indexed',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Indexed PD US$', key: 'indexedPDLiabClaim', operation: 'sum', showTotal: true }
            ],
            orderBy: { columns: ["indexedPDLiabCategory", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'indexedPDLiabCategory', level: 1, displayName: "Indexed PD Claim" },
                { name: 'year', level: 2, displayName: "Year" }
            ]
        },
        {
            reportName: 'By OEE Cost Categories - Indexed',
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
            reportName: 'By Total Cost Categories - Indexed',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: true,
            columns: [
                { displayName: '', key: 'name', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true }
            ],
            orderBy: { columns: ["indexedTotalCategory", "year", "dateOfLoss"], orders: ["asc", "asc", "asc"] },
            groups: [
                { name: 'indexedTotalCategory', level: 1, displayName: "Indexed Total Claim" },
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
            reportName: 'Full List By Year - No Split',
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
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["year", "totalClaim", "dateOfLoss"], orders: ["asc", "desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Year - Split PD/OEE/BI',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Cause', key: 'cause', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'PD Actual US$', key: 'pdLiabClaim', operation: '', showTotal: false },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: '', showTotal: false },
                { displayName: 'BI Actual US$', key: 'biClaim', operation: '', showTotal: false },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["year", "totalClaim", "dateOfLoss"], orders: ["asc", "desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Year - Split PD/BI',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Cause', key: 'cause', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'PD Actual US$', key: 'pdLiabClaim', operation: '', showTotal: false },
                { displayName: 'BI Actual US$', key: 'biClaim', operation: '', showTotal: false },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["year", "totalClaim", "dateOfLoss"], orders: ["asc", "desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Value - No Split',
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
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["totalClaim", "dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Value - Split PD/OEE/BI',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Cause', key: 'cause', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'PD Actual US$', key: 'pdLiabClaim', operation: '', showTotal: false },
                { displayName: 'OEE Actual US$', key: 'oeeClaim', operation: '', showTotal: false },
                { displayName: 'BI Actual US$', key: 'biClaim', operation: '', showTotal: false },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["totalClaim", "dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Full List By Value - Split PD/BI',
            showTotalRow: false,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Cause', key: 'cause', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'PD Actual US$', key: 'pdLiabClaim', operation: '', showTotal: false },
                { displayName: 'BI Actual US$', key: 'biClaim', operation: '', showTotal: false },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["totalClaim", "dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        }
    ];