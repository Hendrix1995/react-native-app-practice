import {View, Pressable, Text} from 'react-native';
import React from 'react';

export default function Settings() {
  return (
    <View>
      <Pressable onPress={() => console.log('클릭')}>
        <Text>설정</Text>
      </Pressable>
    </View>
  );
}
