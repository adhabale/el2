export class EldmMessage {
    public static Message: any[] = [
        { type: 'SomeError', msg: 'Some error occurred!' },
        { type: 'ValueAddedSuccess', msg: 'Value has been added successfully!' },
        { type: 'ValueUpdatedSuccess', msg: 'Value has been added successfully!' },
        { type: 'ValueExists', msg: 'Value is already exists!' }
    ];
};