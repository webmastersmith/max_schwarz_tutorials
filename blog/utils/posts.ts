import fs from 'fs'
import path from 'path'
import { uuid } from 'utils'
import { Post } from 'types'
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'

const POST_PATH = path.join(process.cwd(), 'posts')

export const getAllFileNames = (): string[] => {
  return fs.readdirSync(POST_PATH).reduce((acc: string[], file: string) => {
    if (/\.mdx$/.test(file)) {
      acc.push(file.replace(/\.mdx$/, ''))
    }
    return acc
  }, [])
}
export const getPost = async (slug: string): Promise<Post> => {
  const options = {
    remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeHighlight,
    ],
  }
  try {
    const source = fs.readFileSync(path.join(POST_PATH, slug + '.mdx'))

    const { content, data } = matter(source)
    const { compiledSource } = await serialize(content, {
      // @ts-ignore
      mdxOptions: options,
    })
    const { date, title, image, excerpt, isFeatured } = data as Post
    return {
      compiledSource,
      slug,
      image: image ?? '',
      excerpt: excerpt ?? '',
      isFeatured: isFeatured ?? false,
      date: date ?? new Date().toISOString().split('T')[0],
      title: title ?? slug,
      id: uuid(''),
    }
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getAllPosts = async (): Promise<Post[]> => {
  const fileNames = getAllFileNames()
  let posts: Post[] = []
  try {
    posts = await Promise.all(fileNames.map((fileName) => getPost(fileName)))
  } catch (error: any) {
    throw new Error(error)
  }
  posts.sort((aObj: Post, bObj: Post) => {
    const a = aObj.date
    const b = bObj.date
    return a < b ? -1 : a > b ? 1 : 0 //small to big
  })
  return posts
}
export const getFeaturedPosts = async (): Promise<Post[]> => {
  const fileNames = getAllFileNames()
  let _posts: Post[] = []
  try {
    _posts = await Promise.all(fileNames.map((fileName) => getPost(fileName)))
  } catch (error: any) {
    throw new Error(error)
  }
  _posts.sort((aObj: Post, bObj: Post) => {
    const a = aObj.date
    const b = bObj.date
    return a < b ? -1 : a > b ? 1 : 0 //small to big
  })
  const posts = _posts.filter((post) => post.isFeatured)
  return posts
}
