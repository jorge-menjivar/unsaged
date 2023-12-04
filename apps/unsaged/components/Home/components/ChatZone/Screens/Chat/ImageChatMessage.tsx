import { FC } from "react";

interface Props {
    src: string | undefined;
    alt?: string | undefined;
    width?: string | number | undefined;
    height?: string | number | undefined;
}

export const ImageChatMessage: FC<Props> = ({ src, alt, width, height }) => {
    if (!width && !height) {
        width = '1024px';
        height = '1024px';
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src!}
            alt={alt!}
            width={parseInt(width as string)}
            height={parseInt(height as string)}
            className="m-1"
        />
    );
};