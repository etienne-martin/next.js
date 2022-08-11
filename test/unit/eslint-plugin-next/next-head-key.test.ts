import rule from '@next/eslint-plugin-next/lib/rules/next-head-key'
import { RuleTester } from 'eslint'
;(RuleTester as any).setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
})

const errorMessage =
  'Tags in `next/head` must use the `key` property to make sure they are only rendered once. See: https://nextjs.org/docs/messages/next-head-key'

const ruleTester = new RuleTester()

ruleTester.run('next-head-key', rule, {
  valid: [
    {
      code: `import Head from 'next/head';

      export default function TestPage() {
        return (
          <Head>
            <title>My page title</title>
            <link rel="canonical" href="https://example.com" key="canonical" />
          </Head>
        )
      }`,
    },
    {
      code: `import Head from 'next/head';

      export default function TestPage() {
        return (
          <Head>
            <>
              <title>My page title</title>
              <link rel="canonical" href="https://example.com" key="canonical" />
            </>
          </Head>
        )
      }`,
    },
    {
      code: `import Head from 'next/head';

      export default function TestPage() {
        return (
          <Head>
            {[
              <title>My page title</title>,
              <link rel="canonical" href="https://example.com" key="canonical" />
            ]}
          </Head>
        )
      }`,
    },
  ],
  invalid: [
    {
      code: `import Head from 'next/head';

      export default function TestPage() {
        return (
          <Head>
            <title>My page title</title>
            <link rel="canonical" href="https://example.com" />
          </Head>
        )
      }`,
      errors: [
        {
          message: errorMessage,
          type: 'JSXElement',
        },
      ],
    },
    {
      code: `import Head from 'next/head';

      export default function TestPage() {
        return (
          <Head>
            <title>My page title</title>
            <link rel="canonical" href="https://example.com" key />
          </Head>
        )
      }`,
      errors: [
        {
          message: errorMessage,
          type: 'JSXElement',
        },
      ],
    },
    {
      code: `import Head from 'next/head';

      export default function TestPage() {
        return (
          <Head>
            <>
              <title>My page title</title>
              <link rel="canonical" href="https://example.com" />
            </>
          </Head>
        )
      }`,
      errors: [
        {
          message: errorMessage,
          type: 'JSXElement',
        },
      ],
    },
    {
      code: `import Head from 'next/head';

      export default function TestPage() {
        return (
          <Head>
            {[
              <title>My page title</title>,
              <link rel="canonical" href="https://example.com" />,
            ]}
          </Head>
        )
      }`,
      errors: [
        {
          message: errorMessage,
          type: 'JSXElement',
        },
      ],
    },
  ],
})
