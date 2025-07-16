# UI Web

React component library for the Todo app web interface.

## Development

### Storybook

This package uses Storybook to develop and test components in isolation.

To start Storybook:

```bash
# From the package directory
npm run storybook

# Or from the monorepo root
npm run storybook --workspace=@todo/ui-web
```

### Chromatic

This package uses Chromatic for visual testing and UI review.

To publish to Chromatic:

```bash
# Set your Chromatic project token
export CHROMATIC_PROJECT_TOKEN=your_project_token

# From the package directory
npm run chromatic

# Or from the monorepo root
npm run chromatic --workspace=@todo/ui-web
```

## Adding Stories

To add a story for a component:

1. Create a `ComponentName.stories.tsx` file in the component's directory
2. Define the stories using the Storybook CSF format

Example:

```tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import MyComponent from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // Add argTypes, etc.
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    // Component props
  },
};
```
