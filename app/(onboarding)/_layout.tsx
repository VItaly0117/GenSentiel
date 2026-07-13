import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="equipment" />
      <Stack.Screen name="goals" />
    </Stack>
  );
}
