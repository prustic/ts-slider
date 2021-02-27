import { ReactNode } from "react";

export type SlideProps = {
    child: ReactNode;
    sliderWidth: number;
    sliderHeight: number;
    scaleOnDrag: boolean;
}