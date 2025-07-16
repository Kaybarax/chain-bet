import { cn } from '../index';

describe('cn utility', () => {
  it('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional class names', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('handles array of class names', () => {
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
  });

  it('handles object of class names', () => {
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
  });

  it('merges Tailwind classes correctly', () => {
    expect(cn('p-4 bg-red-500', 'p-8')).toBe('bg-red-500 p-8');
    expect(cn('text-sm text-gray-500', 'text-lg')).toBe('text-gray-500 text-lg');
  });

  it('handles undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });

  it('handles empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });

  it('handles complex combinations', () => {
    const condition = true;
    expect(
      cn(
        'class1',
        condition && 'class2',
        ['class3', condition ? 'class4' : 'class5'],
        { class6: condition, class7: !condition }
      )
    ).toBe('class1 class2 class3 class4 class6');
  });
});
