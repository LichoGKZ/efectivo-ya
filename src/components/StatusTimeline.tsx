// src/components/StatusTimeline.tsx
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export type TimelineStep = {
  label: string;
  detail?: string;
  done: boolean;
  active?: boolean;
};

type Props = {
  steps: TimelineStep[];
};

export default function StatusTimeline({ steps }: Props) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <View key={index} style={styles.stepRow}>
            {/* Line + dot */}
            <View style={styles.lineCol}>
              <View
                style={[
                  styles.dot,
                  step.done && styles.dotDone,
                  step.active && styles.dotActive,
                ]}
              >
                {step.done && !step.active && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
                {step.active && <View style={styles.dotInner} />}
              </View>
              {!isLast && (
                <View style={[styles.line, step.done && styles.lineDone]} />
              )}
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text
                style={[
                  styles.label,
                  step.done && styles.labelDone,
                  step.active && styles.labelActive,
                  !step.done && !step.active && styles.labelPending,
                ]}
              >
                {step.label}
              </Text>
              {step.detail ? (
                <Text style={styles.detail}>{step.detail}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  lineCol: {
    alignItems: 'center',
    width: 24,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dotActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 32,
    backgroundColor: COLORS.border,
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelDone: {
    color: COLORS.text,
  },
  labelActive: {
    color: COLORS.primary,
  },
  labelPending: {
    color: COLORS.textMuted,
  },
  detail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
