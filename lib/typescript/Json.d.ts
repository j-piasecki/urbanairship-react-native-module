export declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export declare type JsonObject = {
    [key: string]: JsonValue;
};
export declare type JsonArray = JsonValue[];
