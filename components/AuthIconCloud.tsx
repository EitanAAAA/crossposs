import React from 'react';
import { IconCloud } from '../registry/magicui/icon-cloud';

const platformSlugs = [
  'tiktok',
  'instagram',
  'youtubeshorts',
  'facebook',
  'x',
  'linkedin',
  'pinterest',
  'reddit',
];

const iconUrls: Record<string, string> = {
  instagram: 'https://static.cdnlogo.com/logos/i/32/instagram-icon.svg',
  linkedin: 'https://img.icons8.com/color/512/linkedin.png',
  tiktok: 'https://cdn.simpleicons.org/tiktok/000000',
  youtubeshorts: 'https://cdn.simpleicons.org/youtube/FF0000',
  facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
  x: 'https://cdn.simpleicons.org/x/000000',
  pinterest: 'https://cdn.simpleicons.org/pinterest/BD081C',
  reddit: 'https://cdn.simpleicons.org/reddit/FF4500',
};

const AuthIconCloud: React.FC = () => {
  const images = platformSlugs.map((slug) => iconUrls[slug] || `https://cdn.simpleicons.org/${slug}/${slug}`);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <IconCloud images={images} />
    </div>
  );
};

export default AuthIconCloud;


