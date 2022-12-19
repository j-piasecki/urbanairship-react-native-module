import React from "react";
import { NativeSyntheticEvent } from "react-native";
/**
 * Enum of possible message load errors
 */
export declare enum MessageLoadError {
    /**
     * The message is not available.
     */
    NotAvailable = "MESSAGE_NOT_AVAILABLE",
    /**
     * Failed to fetch the message.
     */
    FetchFailed = "FAILED_TO_FETCH_MESSAGE",
    /**
     * Failed to load the message.
     */
    LoadFailed = "MESSAGE_LOAD_FAILED"
}
/**
 * Message load started event.
 */
export interface MessageLoadStartedEvent {
    /**
     * The message ID.
     */
    messageId: string;
}
/**
 * Message load finished event.
 */
export interface MessageLoadFinishedEvent {
    /**
     * The message ID.
     */
    messageId: string;
}
/**
 * Message load error event.
 */
export interface MessageLoadErrorEvent {
    /**
     * The message ID.
     */
    messageId: string;
    /**
     * Whether the failure is retryable.
     */
    retryable: boolean;
    /**
     * The error
     */
    error: MessageLoadError;
}
/**
 * Message closed event
 */
export interface MessageClosedEvent {
    /**
     * The message ID.
     */
    messageId: string;
}
/**
 * MessageView props
 */
export interface MessageViewProps {
    /**
     * A callback when the view starts loading a message.
     *
     * @param event: The message load started event.
     */
    onLoadStarted: (event: MessageLoadStartedEvent) => void;
    /**
     * A callback when the view finishes loading a message.
     *
     * @param event: The message load finished event.
     */
    onLoadFinished: (event: MessageLoadFinishedEvent) => void;
    /**
     * A callback when the view fails to load a message with an error.
     *
     * @param event: The message load error event.
     */
    onLoadError: (event: MessageLoadErrorEvent) => void;
    /**
     * A callback when the message is closed.
     *
     * @param event: The message closed event.
     */
    onClose: (event: MessageClosedEvent) => void;
    /**
     * The message Id.
     */
    messageId: string;
}
/**
 * Inbox message view component.
 */
export declare class MessageView extends React.Component<MessageViewProps> {
    _onLoadStarted: (event: NativeSyntheticEvent<MessageLoadStartedEvent>) => void;
    _onLoadFinished: (event: NativeSyntheticEvent<MessageLoadFinishedEvent>) => void;
    _onLoadError: (event: NativeSyntheticEvent<MessageLoadErrorEvent>) => void;
    _onClose: (event: NativeSyntheticEvent<MessageClosedEvent>) => void;
    render(): JSX.Element;
}
