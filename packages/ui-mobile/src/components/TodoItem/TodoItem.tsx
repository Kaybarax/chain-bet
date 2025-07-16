import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import theme from '../../theme';

export type TodoItemProps = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onPress?: (id: string) => void;
  style?: ViewStyle;
  priority?: 'low' | 'medium' | 'high';
};

export const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  description,
  completed,
  onToggle,
  onPress,
  style,
  priority,
}) => {
  const handleToggle = () => {
    onToggle(id);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return theme.colors.danger;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.medium;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <TouchableOpacity style={styles.checkboxContainer} onPress={handleToggle}>
        <View
          style={[
            styles.checkbox,
            completed && styles.checkboxChecked,
          ]}
        >
          {completed && <View style={styles.checkmark} />}
        </View>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              completed && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {priority && (
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor() },
              ]}
            />
          )}
        </View>

        {description ? (
          <Text
            style={[
              styles.description,
              completed && styles.completedText,
            ]}
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
    marginVertical: theme.spacing.xs,
  },
  checkboxContainer: {
    marginRight: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkmark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.colors.white,
    transform: [{ rotate: '-45deg' }],
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    flex: 1,
  },
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.medium,
    marginTop: theme.spacing.xs,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.round,
    marginLeft: theme.spacing.sm,
  },
});

export default TodoItem;
