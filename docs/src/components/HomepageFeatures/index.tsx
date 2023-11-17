import styles from './styles.module.css';
import Heading from '@theme/Heading';
import clsx from 'clsx';

type FeatureItem = {
  title: string;
  Img: JSX.Element;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Wide-Range of AI Models',
    Img: <img src="/screenshots/models.png" />,
    description: (
      <>
        Switch between different AI models from a variety of providers with
        ease.
      </>
    ),
  },
  {
    title: 'Cloud Sync',
    Img: <img src="/screenshots/conversations.png" />,
    description: (
      <>
        Synchronize your conversations across different devices seamlessly with
        Supabase.
      </>
    ),
  },
  {
    title: 'System Prompts',
    Img: <img src="/screenshots/prompt.png" />,
    description: (
      <>
        Personalize your conversation context and the AI's personality with
        system prompts.
      </>
    ),
  },
];

function Feature({ title, Img, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">{Img}</div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
