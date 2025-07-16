# UI Mobile

React Native component library for the Todo app.

## Development

### Storybook

This package uses Storybook to develop and test components in isolation.

To start Storybook:

```bash
# From the package directory
npm run storybook

# Or from the monorepo root
npm run storybook --workspace=ui-mobile
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
npm run chromatic --workspace=ui-mobile
```

## Adding Stories

To add a story for a component:

1. Create a `__stories__` directory in the component's directory
2. Create a `ComponentName.stories.tsx` file
3. Define the stories using the Storybook CSF format

Example:

```tsx
import React from 'react';
import { View } from 'react-native';
import { Meta, StoryObj } from '@storybook/react-native';
import MyComponent from '../MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  // Add parameters, decorators, etc.
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    // Component props
  },
};
```
