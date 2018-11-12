export const OEELossesFilters = [
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
        groups: [{ displayName: "OEE", value: "By Cost Categories - Actual" }]
    },
    {
        type: "Indexed Cost Categories",
        groups: [{ displayName: "OEE", value: "By Cost Categories - Indexed" }]
    },
    {
        type: "Well Details",
        groups: [{ displayName: "Depth Category", value: "By Depth Category" }, { displayName: "Status", value: "By Status" }, { displayName: "Rating Area", value: "By Rating Area" }, { displayName: "Well Type", value: "By Well Type" }]
    },
    {
        type: "Full List By Year",
        groups: [{ displayName: "All Losses", value: "Full List By Year - All Losses" }, { displayName: "OEE Actual", value: "Full List By Year - Actual" }, { displayName: "OEE Indexed", value: "Full List By Year - Indexed" }]
    },
    {
        type: "Full List By Value",
        groups: [{ displayName: "All Losses", value: "Full List By Value - All Losses" }, { displayName: "OEE Actual", value: "Full List By Value - Actual" }, { displayName: "OEE Indexed", value: "Full List By Value - Indexed" }]
    }
];