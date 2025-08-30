import { Link } from 'wouter';
import { Category } from '@shared/schema';

interface CategoryCardProps {
  category: Category;
  adCount?: number;
}

export function CategoryCard({ category, adCount = 0 }: CategoryCardProps) {
  const getIconBgColor = (slug: string) => {
    const colors = {
      'cars': 'bg-blue-50',
      'properties': 'bg-green-50',
      'mobiles': 'bg-purple-50',
      'jobs': 'bg-orange-50',
      'fashion': 'bg-pink-50',
      'books-sports': 'bg-teal-50',
      'bikes': 'bg-red-50',
      'electronics': 'bg-indigo-50',
      'commercial': 'bg-yellow-50'
    };
    return colors[slug as keyof typeof colors] || 'bg-gray-50';
  };

  const getIconColor = (slug: string) => {
    const colors = {
      'cars': 'text-blue-500',
      'properties': 'text-green-500',
      'mobiles': 'text-purple-500',
      'jobs': 'text-orange-500',
      'fashion': 'text-pink-500',
      'books-sports': 'text-teal-500',
      'bikes': 'text-red-500',
      'electronics': 'text-indigo-500',
      'commercial': 'text-yellow-500'
    };
    return colors[slug as keyof typeof colors] || 'text-gray-500';
  };

  // Map category slugs to provided image URLs
  const imageBySlug: Record<string, string> = {
    cars: 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2Ff616e47a8e9b42edb8398aec824f32e6?format=webp&width=256',
    properties: 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2F4564f940ba5348f190795c2ac4c347e1?format=webp&width=256',
    mobiles: 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2F448e8b17c3324f58834f66a0cae71adb?format=webp&width=256',
    jobs: 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2F311741588603473dab8fefaca976b825?format=webp&width=256',
    fashion: 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2F87952a405ef049f49faf3db5b858c61e?format=webp&width=256',
    'books-sports': 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2F87d4406977ca49efb0e476da088ca460?format=webp&width=256',
    bikes: 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2F2108fb22c8d64e68ab4026dd6503c445?format=webp&width=256',
    electronics: 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2F6b0bc2e983b0471db14b3f93c34d36ef?format=webp&width=256',
    commercial: 'https://cdn.builder.io/api/v1/image/assets%2F10403533cf314100a836b80ad6ee216d%2F0ec248ea1bd843ed8ec7acef5f08dfd3?format=webp&width=256',
  };

  const imageSrc = imageBySlug[category.slug];

  return (
    <Link to={`/category/${category.slug}`} data-testid={`link-category-${category.slug}`}>
      <div className="category-hover bg-white rounded-xl p-6 text-center shadow-sm border border-border hover:shadow-md transition-all">
        <div className={`w-16 h-16 ${getIconBgColor(category.slug)} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {imageSrc ? (
            <img src={imageSrc} alt={`${category.name} icon`} className="w-12 h-12 object-contain" />
          ) : (
            <i className={`${category.icon} ${getIconColor(category.slug)} text-2xl`}></i>
          )}
        </div>
        <h3 className="font-semibold text-foreground mb-1" data-testid={`text-category-name-${category.slug}`}>
          {category.name}
        </h3>
        <p className="text-xs text-muted-foreground" data-testid={`text-category-count-${category.slug}`}>
          {adCount}+ ads
        </p>
      </div>
    </Link>
  );
}
