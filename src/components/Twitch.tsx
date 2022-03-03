import {NavigationProp, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';
import {useGlobal} from '../hooks/useGlobal';
import Focusable from './Focusable';
import {Flex} from './Layout';
import Text from './Text';

const VideoContainer = styled.View`
  height: 300px;
  background-color: #000;
  flex-grow: 1;
`;

const VideoStyled = styled(Video)`
  height: 300px;
  width: 100%;
`;

const Title = styled(Flex)`
  border-left-width: 4px;
  border-left-color: #e70625;
  padding-left: 8px;
  margin: 24px 4px;
  justify-content: space-between;
  align-items: center;
`;

export default () => {
  const [channelInput, setChannelInput] = useState('thebs_chen');
  // const [channel, setChannel] = useState('esl_csgo');
  const [channel, setChannel] = useState('thebs_chen');
  const [list, setList] = useState<any[]>([]);
  const [source, setSource] = useState(null);
  const {page} = useGlobal();

  useEffect(() => {
    loadTwitch();
  }, [channel]);

  const loadTwitch = async () => {
    try {
      const {data} = await axios.request({
        url:
          'http://service-dekb3ykq-1251277120.hk.apigw.tencentcs.com/twitch?channel=' +
          channel,
      });

      if (Array.isArray(data) && data.length > 0) {
        setList(data);
        setSource(data[0].link);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  if (!source) return null;

  return (
    <View>
      <Title>
        <Text size={24}>Twitch直播</Text>
      </Title>

      <Flex style={{width: '100%', height: 300}}>
        <VideoContainer>
          <Focusable
            onPress={() => {
              nav.navigate({
                name: 'Twitch',
                params: {
                  url: source,
                },
              });
            }}>
            <VideoStyled
              paused={page === 'Twitch'}
              source={{
                uri: source,
              }}
              resizeMode="contain"
            />
          </Focusable>
        </VideoContainer>
        <View style={{width: 200, padding: 10}}>
          {list.map(i => {
            return (
              <Focusable
                shadow={false}
                radius={40}
                style={{marginRight: 12}}
                key={i.link}
                onPress={() => {
                  setSource(i.link);
                }}>
                <Text
                  size={12}
                  numberOfLines={1}
                  color={i.link === source ? '#e70625' : '#FFFFFF'}>
                  {i.link === source ? '✓ ' : ' '}
                  {i.quality}
                </Text>
              </Focusable>
            );
          })}

          {/* <Flex>
            <Text color="#e70625">房间号：</Text>
            <TextInput
              value={channelInput}
              style={{color: '#FFFFFF'}}
              focusable
              onChangeText={text => {
                setChannelInput(text);
              }}
            />
          </Flex> */}
        </View>
      </Flex>
    </View>
  );
};
