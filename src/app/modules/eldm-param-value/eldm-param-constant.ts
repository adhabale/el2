export class EldmParamConstant {
    public static ParamType: any[] = [
        { case: 1, html: 'general' },
        { case: 2, html: 'category' },
        { case: 3, html: 'range' }
    ];
    public static UdpCases: any[] = [
        { case: 1, table: 'LossType' },
        { case: 2, table: 'Cause' },
        { case: 3, table: 'Category1,Category2,Category3' }
    ];
    public static RangeCases: any[] = [
        { case: 1, table: 'Cost Category' },
        { case: 2, table: 'Depth Category' },
        { case: 3, table: 'Platform Asset Category' }
    ];
};