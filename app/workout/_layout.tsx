import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="active" />
      <Stack.Screen name="summary" />
      <Stack.Screen
        name="exercise-picker"
        options={{ animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
