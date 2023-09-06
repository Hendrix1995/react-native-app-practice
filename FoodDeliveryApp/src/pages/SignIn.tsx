import { View, Text, TextInput, Pressable, Alert, Platform } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import tw from '@/style';
import { RootStackParamList } from '../../AppInner';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, { AxiosError } from 'axios';
import { useAppDispatch } from '../store';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignIn({ navigation }: SignInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const canGoNext = email && password;
  const onSubmit = useCallback(async () => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${Platform.OS === 'android' ? Config.ANDROID_API_URL : Config.IOS_API_URL}/login`,
        {
          email,
          password,
        },
      );
      console.log(response.data);
      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', (errorResponse.data as any).message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const loginButton = tw`rounded-2 py-4 px-10 ${canGoNext ? `bg-primary` : `bg-gray-500`}`;
  const buttonText = tw`font-bold text-white text-center`;
  const inputLabel = tw`font-bold text-16 text-black`;

  return (
    <DismissKeyboardView>
      <View style={tw`p-5 flex gap-16`}>
        <View style={tw`flex gap-8`}>
          <View style={tw`flex gap-6`}>
            <Text style={inputLabel}>이메일</Text>
            <TextInput
              style={tw`pb-2 text-4 border-b border-[#Dfdfdf]`}
              placeholder='이메일을 입력해주세요.'
              value={email}
              onChangeText={text => setEmail(text)}
              importantForAutofill='yes'
              autoComplete='email'
              textContentType='emailAddress'
              returnKeyType='next'
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              ref={emailRef}
              clearButtonMode='while-editing' // 다 지우기 버튼 추가
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>
          <View style={tw`flex gap-6`}>
            <Text style={inputLabel}>비밀번호</Text>
            <TextInput
              style={tw`pb-2 text-4 border-b border-[#Dfdfdf]`}
              placeholder='비밀번호를 입력해주세요.'
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry // type password
              importantForAutofill='yes'
              autoComplete='password' // 인증문자도 바로 넣어주는 오토 컴플리트 (otp)
              textContentType='password'
              ref={passwordRef}
              onSubmitEditing={onSubmit} // Enter 쳤을때 효과
            />
          </View>
        </View>
        <View style={tw`flex gap-4 items-center`}>
          <Pressable onPress={onSubmit} style={loginButton} disabled={!canGoNext}>
            <Text style={buttonText}>로그인</Text>
          </Pressable>
          <Pressable onPress={toSignUp}>
            <Text>회원가입하기</Text>
          </Pressable>
        </View>
      </View>
    </DismissKeyboardView>
  );
}
