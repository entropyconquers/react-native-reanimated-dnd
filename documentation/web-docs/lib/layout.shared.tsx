import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/images/logo.svg"
            alt="React Native Reanimated DnD"
            width={140}
            height={28}
            className="hidden dark:block"
          />
          <Image
            src="/images/logo-dark.svg"
            alt="React Native Reanimated DnD"
            width={140}
            height={28}
            className="block dark:hidden"
          />
        </>
      ),
    },
    githubUrl: 'https://github.com/entropyconquers/react-native-reanimated-dnd',
    links: [
      {
        text: 'Documentation',
        url: '/docs/intro',
      },
      {
        text: 'API Reference',
        url: '/docs/api/overview',
      },
    ],
  };
}
