export type WithSharedProps<T> = {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
} & T;
