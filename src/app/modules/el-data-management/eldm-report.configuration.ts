export const ELReportConfiguration =
    [
        {
            reportName: 'OEE - Full List by Year - OEE Actual',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Type', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Location', key: 'location', operation: '', showTotal: false },
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'Land / Offshore', key: 'onOffshore', operation: '', showTotal: false },
                { displayName: 'Rating Area', key: 'ratingArea', operation: '', showTotal: false },
                { displayName: 'Well Type', key: 'wellType', operation: '', showTotal: false },
                { displayName: 'UGBO', key: 'ugbo', operation: '', showTotal: false },
                { displayName: 'Depth at loss (feet)', key: 'depthAtLoss', operation: '', showTotal: false },
                { displayName: 'ProjTD (feet)', key: 'ptd', operation: '', showTotal: false },
                { displayName: 'Total Actual OEE US$', key: 'oeeClaim', operation: 'sum', showTotal: true }
            ],
            orderBy: { columns: ["dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Overall - Type of Loss - by Category 1',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Category 1', key: 'category1', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Overall - Type of Loss - by Category 2',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Category 2', key: 'category2', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Overall - Type of Loss - by Category 3',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Category 3', key: 'category3', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Overall Losses– by Area',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Area', key: 'area', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Overall Losses– by Country',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Country', key: 'country', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'Overall Losses– by Year',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Year', key: 'year', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false },
                { displayName: 'Average Actual US$', key: 'averageActual', operation: 'divide', numerator: 'totalClaim', denominator: 'incidents', showTotal: true },
                { displayName: 'Total Indexed US$', key: 'indexedTotalClaim', operation: 'sum', showTotal: true },
                { displayName: 'Average Indexed US$', key: 'averageIndexed', operation: 'divide', numerator: 'indexedTotalClaim', denominator: 'incidents', showTotal: true }
            ],
            orderBy: { columns: ["dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
        {
            reportName: 'WILLIS ENERGY LOSS DATABASE -  Analysis by UP/DOWN/POWER - Actual',
            showTotalRow: true,
            showExpandAndCollapseAllRowBtn: false,
            columns: [
                { displayName: 'Up/Down/Power', key: 'upDownStream', operation: '', showTotal: false },
                { displayName: 'Incidents', key: 'incidents', operation: 'count', showTotal: true },
                { displayName: 'Total Actual US$', key: 'totalClaim', operation: '', showTotal: false }
            ],
            orderBy: { columns: ["dateOfLoss"], orders: ["desc", "asc"] },
            groups: []
        },
    ];