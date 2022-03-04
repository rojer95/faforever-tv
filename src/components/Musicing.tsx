import React from 'react';
import ImageSequence from 'react-native-image-sequence';
import styled from 'styled-components/native';
import {Image as RNImage} from 'react-native';

const Image = styled(ImageSequence)<Props>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

interface Props {
  height: number;
  width: number;
}

const i1 = require('../assets/gif_musicing_1.png');
const i2 = require('../assets/gif_musicing_2.png');
const i3 = require('../assets/gif_musicing_3.png');
const i4 = require('../assets/gif_musicing_4.png');
const i5 = require('../assets/gif_musicing_5.png');

export default ({width, height}: Props) => {
  return (
    <RNImage
      style={{width: width, height: height}}
      source={require('../assets/music.png')}
    />
  );
};
