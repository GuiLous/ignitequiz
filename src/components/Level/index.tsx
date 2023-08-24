import { useEffect } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { THEME } from '../../styles/theme';
import { styles } from './styles';

const PressableAnimated = Animated.createAnimatedComponent(Pressable)

const TYPE_COLORS = {
  EASY: THEME.COLORS.BRAND_LIGHT,
  HARD: THEME.COLORS.DANGER_LIGHT,
  MEDIUM: THEME.COLORS.WARNING_LIGHT,
}

type Props = PressableProps & {
  title: string;
  isChecked?: boolean;
  type?: keyof typeof TYPE_COLORS;
}

export function Level({ title, type = 'EASY', isChecked = false, ...rest }: Props) {
  const scale = useSharedValue(1)
  const checked = useSharedValue(1)

  const COLOR = TYPE_COLORS[type];

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(checked.value, [0, 1], ['transparent', COLOR])
    }
  })

  const animateTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(checked.value, [0, 1], [COLOR, THEME.COLORS.GREY_100])
    }
  })

  function onPressIn() {
    scale.value = withTiming(1.1, { easing: Easing.bounce })
  }

  function onPressOut() {
    scale.value = withTiming(1, { easing: Easing.bounce })
  }

  useEffect(() => {
    checked.value = isChecked ? 1 : 0
  }, [isChecked])

  return (
    <PressableAnimated onPressIn={onPressIn} onPressOut={onPressOut} style={
      [
        styles.container,
        animatedContainerStyle,
        { borderColor: COLOR }
      ]
    } {...rest}>
      <Animated.Text style={
        [
          styles.title,
          animateTextStyle,
        ]}>
        {title}
      </Animated.Text>
    </PressableAnimated>
  );
}