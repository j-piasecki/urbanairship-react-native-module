/**
 * Attribute operation
 * @hidden
 */
export interface AttributeOperation {
    /**
     * The operation name.
     */
    action: string;
    /**
     * The attribute key.
     */
    key: string;
    /**
     * The attribute value, if avaialble.
     */
    value?: string | number | Date;
    /**
     * The attribute type, if available.
     */
    type?: "string" | "number" | "date";
}
/**
 * Editor for attributes.
 */
export declare class AttributeEditor {
    onApply: (operations: AttributeOperation[]) => void;
    operations: AttributeOperation[];
    /**
     * AttributeEditor constructor
     *
     * @hidden
     * @param onApply The apply function
     */
    constructor(onApply: (operations: AttributeOperation[]) => void);
    /**
     * Adds an attribute.
     *
     * @param value The attribute value.
     * @param name The attribute name.
     * @return The attribute editor instance.
     */
    setAttribute(name: string, value: string | number | boolean | Date): AttributeEditor;
    /**
     * Removes an attribute.
     * @param name The name of the attribute to remove.
     * @return The attribute editor instance.
     */
    removeAttribute(name: string): AttributeEditor;
    /**
     * Applies the attribute operations.
     */
    apply(): void;
}
