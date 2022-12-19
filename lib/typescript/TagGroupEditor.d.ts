/**
 * Tag group operation.
 * @hidden
 */
export interface TagGroupOperation {
    /**
     * The operation name
     */
    operationType: string;
    /**
     * The tag group name
     */
    group: string;
    /**
     * An array of tags.
     */
    tags: string[];
}
/**
 * Editor for tag groups.
 */
export declare class TagGroupEditor {
    onApply: (operations: TagGroupOperation[]) => void;
    operations: TagGroupOperation[];
    /**
     * TagGroupEditor constructor
     *
     * @hidden
     * @param onApply The apply function
     */
    constructor(onApply: (operations: TagGroupOperation[]) => void);
    /**
     * Adds tags to a tag group.
     *
     * @param tagGroup The tag group.
     * @param tags Tags to add.
     * @return The tag group editor instance.
     */
    addTags(group: string, tags: string[]): TagGroupEditor;
    /**
     * Removes tags from the tag group.
     *
     * @param tagGroup The tag group.
     * @param tags Tags to remove.
     * @return The tag group editor instance.
     */
    removeTags(group: string, tags: string[]): TagGroupEditor;
    /**
     * Overwrite the current set of tags on the Tag Group.
     *
     * @param tagGroup The tag group.
     * @param tags Tags to set.
     * @return The tag group editor instance.
     */
    setTags(group: string, tags: Array<string>): TagGroupEditor;
    /**
     * Applies the tag changes.
     */
    apply(): void;
}
