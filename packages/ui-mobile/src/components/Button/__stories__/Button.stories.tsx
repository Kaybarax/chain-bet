import React from 'react';
import { View } from 'react-native';
import { Meta, StoryObj } from '@storybook/react-native';
import Button from '../Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    onPress: { action: 'pressed' },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  args: {
    title: 'Button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    title: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    title: 'Outline Button',
    variant: 'outline',
  },
};

export const Danger: Story = {
  args: {
    title: 'Danger Button',
    variant: 'danger',
  },
};

export const Small: Story = {
  args: {
    title: 'Small Button',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    title: 'Large Button',
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Button',
    loading: true,
  },
};
