import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducer';
import useSocket from '@/hooks/useSocket';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { Alert, Platform } from 'react-native';
import { useAppDispatch } from './src/store';
import userSlice from '@/slices/user';
import orderSlice from '@/slices/order';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: { orderId: string };
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  const [socket, disconnect] = useSocket();

  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };

    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }

    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [dispatch, isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    // * useEffect 안에서는 async 함수를 실행할 수 없어서 안에서 함수를 만들어 마지막에 실행 시켜 주는 형식을 취한다.
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        console.log(token);
        if (!token) {
          return;
        }
        const response = await axios.post(
          `${Platform.OS === 'android' ? Config.ANDROID_API_URL : Config.IOS_API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        if ((error as any).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      } finally {
        // TODO : 스플래시 스크린 없애기
      }
    };
    // * 여기서 실행시켜 줌
    getTokenAndRefresh();

    // dispatch는 안넣어줘도 상관없음. 불변성이 보장되기 때문 (불변성 : 참조값이 절대 바뀌지 않는 값)
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen name='Orders' component={Orders} options={{ title: '오더 목록' }} />
          <Tab.Screen name='Delivery' component={Delivery} options={{ headerShown: false }} />
          <Tab.Screen name='Settings' component={Settings} options={{ title: '내 정보' }} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name='SignIn' component={SignIn} options={{ title: '로그인' }} />
          <Stack.Screen name='SignUp' component={SignUp} options={{ title: '회원가입' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
