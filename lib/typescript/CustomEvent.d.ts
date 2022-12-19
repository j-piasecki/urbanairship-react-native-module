import { JsonObject, JsonValue } from './Json';
/**
 * Custom event
 */
export declare class CustomEvent {
    _name: string;
    _value?: number;
    _properties: JsonObject;
    _transactionId?: string;
    /**
     * Custom event constructor.
     *
     * @param name The event name.
     * @param value The event value.
     */
    constructor(name: string, value?: number);
    /**
     * Gets the event's transaction ID.
    */
    get transactionId(): string | undefined;
    /**
     * Sets the event's transaction ID.
     */
    set transactionId(value: string | undefined);
    /**
     * Adds a property to the custom event.
     *
     * @param name The property name.
     * @param value The property value.
     */
    addProperty(name: string, value: JsonValue): void;
}
