export const OverallLossesFilters = [
    {
        type: "Date Of Loss",
        groups: [{ displayName: "Month", value: "By Month" }, { displayName: "Year", value: "By Year" }]
    },
    {
        type: "Location Of Loss",
        groups: [{ displayName: "Area", value: "By Area" }, { displayName: "Country", value: "By Country" }]
    },
    {
        type: "Type Of Loss",
        groups: [{ displayName: "Cause", value: "By Cause" }, { displayName: "Category 1", value: "By Category 1" }, { displayName: "Category 2", value: "By Category 2" }]
    },
    {
        type: "Actual Cost Categories",
        groups: [{ displayName: "PD", value: "By PD Cost Categories - Actual" }, { displayName: "OEE", value: "By OEE Cost Categories - Actual" }, { displayName: "Total", value: "By Total Cost Categories - Actual" }]
    },
    {
        type: "Indexed Cost Categories",
        groups: [{ displayName: "PD", value: "By PD Cost Categories - Indexed" }, { displayName: "OEE", value: "By OEE Cost Categories - Indexed" }, { displayName: "Total", value: "By Total Cost Categories - Indexed" }]
    },
    {
        type: "Well Details",
        groups: [{ displayName: "Depth Category", value: "By Depth Category" }]
    },
    {
        type: "Full List By Year",
        groups: [{ displayName: "No Split", value: "Full List By Year - No Split" }, { displayName: "Split PD/OEE/BI", value: "Full List By Year - Split PD/OEE/BI" }, { displayName: "Split PD/BI", value: "Full List By Year - Split PD/BI" }]
    },
    {
        type: "Full List By Value",
        groups: [{ displayName: "No Split", value: "Full List By Value - No Split" }, { displayName: "Split PD/OEE/BI", value: "Full List By Value - Split PD/OEE/BI" }, { displayName: "Split PD/BI", value: "Full List By Value - Split PD/BI" }]
    }
];