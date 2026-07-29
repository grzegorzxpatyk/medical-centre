import Link from 'next/link'
import { Fragment } from 'react'

import { cn } from '@/lib/utils'

/**
 * Minimal renderer for Payload's serialised Lexical JSON.
 *
 * The web app intentionally has no Payload dependency (see the repo README), so
 * rather than pulling in @payloadcms/richtext-lexical just to render, we walk
 * the node tree for the handful of node types the editor produces.
 */

interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  fields?: { url?: string; newTab?: boolean; linkType?: string }
  [key: string]: unknown
}

/** Lexical stores inline formatting as a bitmask on text nodes */
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4

function renderText(node: LexicalNode, key: number) {
  const format = typeof node.format === 'number' ? node.format : 0
  let element: React.ReactNode = node.text ?? ''

  if (format & IS_CODE) {
    element = <code className="rounded bg-muted px-1 py-0.5 text-[0.9em]">{element}</code>
  }
  if (format & IS_BOLD) element = <strong>{element}</strong>
  if (format & IS_ITALIC) element = <em>{element}</em>
  if (format & IS_UNDERLINE) element = <u>{element}</u>
  if (format & IS_STRIKETHROUGH) element = <s>{element}</s>

  return <Fragment key={key}>{element}</Fragment>
}

function renderNodes(nodes: LexicalNode[] | undefined): React.ReactNode {
  if (!nodes?.length) return null

  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return renderText(node, index)

      case 'linebreak':
        return <br key={index} />

      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed last:mb-0">
            {renderNodes(node.children)}
          </p>
        )

      case 'heading': {
        const Tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        return (
          <Tag
            key={index}
            className="font-heading mt-8 mb-3 text-lg font-bold text-foreground first:mt-0"
          >
            {renderNodes(node.children)}
          </Tag>
        )
      }

      case 'quote':
        return (
          <blockquote
            key={index}
            className="mb-4 border-l-2 border-primary pl-4 text-muted-foreground italic"
          >
            {renderNodes(node.children)}
          </blockquote>
        )

      case 'list': {
        const ordered = node.tag === 'ol' || node.listType === 'number'
        const Tag = ordered ? 'ol' : 'ul'
        return (
          <Tag
            key={index}
            className={cn('mb-4 space-y-1 pl-6', ordered ? 'list-decimal' : 'list-disc')}
          >
            {renderNodes(node.children)}
          </Tag>
        )
      }

      case 'listitem':
        return <li key={index}>{renderNodes(node.children)}</li>

      case 'link': {
        const href = node.fields?.url ?? '#'
        const external = /^https?:\/\//.test(href)
        return external ? (
          <a
            key={index}
            href={href}
            target={node.fields?.newTab ? '_blank' : undefined}
            rel={node.fields?.newTab ? 'noreferrer' : undefined}
            className="text-primary underline underline-offset-2"
          >
            {renderNodes(node.children)}
          </a>
        ) : (
          <Link key={index} href={href} className="text-primary underline underline-offset-2">
            {renderNodes(node.children)}
          </Link>
        )
      }

      case 'horizontalrule':
        return <hr key={index} className="my-8" />

      default:
        // Unknown block (upload, table, …) — render its children rather than dropping content
        return node.children ? <Fragment key={index}>{renderNodes(node.children)}</Fragment> : null
    }
  })
}

/** Loose shape so this accepts the generated `content` field of any collection */
type RichTextValue = { root?: { children?: unknown } } | null | undefined

export function RichText({ content, className }: { content: RichTextValue; className?: string }) {
  const children = content?.root?.children as LexicalNode[] | undefined
  if (!children?.length) return null

  return <div className={cn('text-sm text-muted-foreground', className)}>{renderNodes(children)}</div>
}
