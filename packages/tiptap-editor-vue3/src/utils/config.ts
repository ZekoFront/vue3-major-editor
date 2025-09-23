import { ImageDisplay } from "./image"


export const DEFAULT_TITLE = '7'

export const FONT_SIZE_TITLE: Record<number, string> = {
    1: '2em',
    2: '1.5em',
    3: '1.17em',
    4: '1em',
    5: '0.83em',
    6: '0.67em',
    7: '16px',
}

export const DEFAULT_TITLE_COLOR = "#333333"

export const PRIMARY_COLOR = '#18a058'

export const DEFAULT_IMAGE_WIDTH = 380
export const DEFAULT_IMAGE_HEIGHT = 153
export const DEFAULT_IMAGE_DISPLAY = ImageDisplay.INLINE;
export const DEFAULT_IMAGE_URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;