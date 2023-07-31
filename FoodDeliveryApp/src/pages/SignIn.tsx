import {View, Text, TextInput, Pressable, Alert} from 'react-native';
import React, {useCallback, useState} from 'react';
import tw from 'twrnc';

export default function SignIn() {
  const onSubmit = useCallback(() => {
    Alert.alert('알림', '안녕~');
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canGoNext = email && password;

  const loginButton = tw`rounded-2 py-4 px-10 ${
    canGoNext ? `bg-blue-500` : `bg-gray-500`
  }`;

  const buttonText = tw`text-white text-center`;
  const inputLabel = tw`font-medium`;

  return (
    <View>
      <View>
        <Text style={inputLabel}>이메일</Text>
        <TextInput
          placeholder="이메일을 입력해주세요."
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View>
        <Text style={inputLabel}>비밀번호</Text>
        <TextInput
          placeholder="비밀번호를 입력해주세요."
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={tw`flex gap-4 items-center`}>
        <Pressable onPress={onSubmit} style={loginButton} disabled={!canGoNext}>
          <Text style={buttonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={onSubmit}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </View>
  );
}