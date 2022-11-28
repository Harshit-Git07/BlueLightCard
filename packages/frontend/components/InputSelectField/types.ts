export interface InputSelectFieldProps {
    defaultOption?: string;
    options: {
        [value: string]: string | number | null;
    };
}
