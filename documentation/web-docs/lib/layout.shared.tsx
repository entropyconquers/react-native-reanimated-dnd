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
            width={200}
            height={40}
            className="logo-light"
          />
          <Image
            src="/images/logo-dark.svg"
            alt="React Native Reanimated DnD"
            width={200}
            height={40}
            className="logo-dark"
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
