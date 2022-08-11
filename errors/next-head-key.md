# Next head key

> Enforce `key` property on tags inside `next/head`.

## Why This Error Occurred

Tags in `next/head` must use the `key` property to make sure they are only rendered once.

## Possible Ways to Fix It

Add a `key` property to the tags inside `next/head`.

```jsx
import Head from 'next/head'

function IndexPage() {
  return (
    <div>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <p>Hello world!</p>
    </div>
  )
}
```

## Useful links

- [Docs for Next.js Head component](https://nextjs.org/docs/api-reference/next/head)
