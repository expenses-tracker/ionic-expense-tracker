export enum ToastType {
    primary = 'primary',
    success = 'success',
    warning = 'warning',
    danger = 'danger',
}

export enum ToastPosition {
    top = 'top',
    middle = 'middle',
    bottom = 'bottom'
}

export class ToasterInput {
    type: ToastType;
    title?: string;
    content: string;
    position?: ToastPosition;
}
