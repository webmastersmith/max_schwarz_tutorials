import type { NextPage } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import { PostType } from 'types'
import 'highlight.js/styles/mono-blue.css'

interface Props extends PostType {
  components: any
}

export const MDX: NextPage<Props> = ({ post, components = {} }) => {
  return <MDXRemote {...post} components={components} />
}
