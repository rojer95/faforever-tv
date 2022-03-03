import {RouteProp, useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import Video from 'react-native-video';
import styled from 'styled-components/native';
import {Page} from '../components/Layout';

const VideoStyled = styled(Video)`
  height: 100%;
  width: 100%;
`;

export default () => {
  const route = useRoute<RouteProp<RootStackParamList>>();
  return (
    <Page pageId="Twitch">
      <VideoStyled
        source={{
          uri: route.params?.url,
        }}
        resizeMode="contain"
      />
    </Page>
  );
};
