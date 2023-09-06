import { useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';
import { Platform } from 'react-native';

// 사실 변수를 밖에서 선언해서 사용하는건 안 좋은 행동이지만, socket을 단 한번만 연결되는것을 저장하기 위해서 피치못하게 사용하는 경우임
let socket: Socket | undefined;

const useSocket = (): [typeof socket, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);

  // socket 조건문 없으면 socket 연결이 되어 있는 상태임에도 불구하고, 계속 연결이 됨
  if (!socket) {
    socket = io(`${Platform.OS === 'android' ? Config.ANDROID_API_URL : Config.IOS_API_URL}`, {
      transports: ['websocket'],
    });
  }
  return [socket, disconnect];
};

export default useSocket;
