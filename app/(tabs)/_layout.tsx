import {Tabs, Stack} from 'expo-router';
import React from 'react';

import {useColorScheme} from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {backgroundColor: 'rgb(40,99,99)'},
                headerTintColor: '#fff',
            }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Search flights',

                }}
            />

        </Stack>
    );
}
