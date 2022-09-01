declare module "react-dom"{
    export function createPortal(children: ReactNode, container: Element, key?: null | string): ReactPortal;
}