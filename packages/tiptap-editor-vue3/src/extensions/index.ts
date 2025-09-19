import { TaskList } from '@tiptap/extension-list';
import {Clear} from './Clear'
import {History} from './History'
import {BackgroundColor} from './BackgroundColor'
import {Image} from './Image'
import {LineHeight} from './LineHeight'
import {Heading} from './Heading'
import {Bold} from './Bold'
import {Italic} from './Italic'
import {Strike} from './Strike'
import {Underline} from './Underline'
import {Code} from './Code'
// ExtCodeBlockLowlight替换了ExtCodeBlock
import {CodeBlock} from './CodeBlock'
import {Subscript} from './Subscript'
import {Superscript} from './Superscript'
import {OrderedList} from './OrderedList'
import {BulletList} from './BulletList'
import {HorizontalRule} from './HorizontalRule'
import {Blockquote} from './Blockquote'
import {Highlight} from './Highlight'
import {Color} from './Color'
import {CodeBlockLowlight} from './CodeBlockLowlight'
import {Table} from './Table'
import {Link} from './Link'
import {TextAlignment} from './TextAlignment'
import {TaskItem} from './TaskItem'
import { Emojis } from './Emoji'

export const extensionsArray  = [
    History,
    Bold,
    Italic,
    Strike,
    Underline,
    Highlight,
    Color,
    BackgroundColor,
    Heading,
    TextAlignment,
    LineHeight,
    Code,
    CodeBlockLowlight,
    Subscript,
    Superscript,
    OrderedList,
    BulletList,
    HorizontalRule,
    Blockquote,
    Table,
    Link,
    Image,
    // TaskList,
    TaskItem,
    Emojis,
    Clear
]

export * from './Clear'
export * from './History'
export * from './BackgroundColor'
export * from './Image'
export * from './LineHeight'
export * from './Heading'
export * from './Bold'
export * from './Italic'
export * from './Strike'
export *  from './Underline'
export * from './Code'
export * from './CodeBlock'
export * from './Subscript'
export * from './Superscript'
export * from './OrderedList'
export * from './BulletList'
export * from './HorizontalRule'
export * from './Blockquote'
export * from './Highlight'
export * from './Color'
export * from './CodeBlockLowlight'
export * from './Table'
export *  from './Link'
export * from './TextAlignment'
export * from './TaskItem'
export * from './Emoji'