import * as React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {UrbanAirship} from 'urbanairship-react-native';

import styles from '../Styles';

function ChannelCell(props: {channelId: string}) {
  return (
    <Text style={styles.channel}>
      Channel ID {'\n'}
      {props.channelId}
    </Text>
  );
}

export default function HomeScreen() {
  const [channelId, setChannelId] = React.useState<string | null>(null);

  React.useEffect(() => {
    UrbanAirship.getChannelId().then(id => {
      if (id) {
        setChannelId(id);
      }
    });
  }, []);

  let channelcell = null;
  if (channelId) {
    channelcell = <ChannelCell channelId={channelId} />;
  }

  return (
    <View style={styles.backgroundContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image
          style={{width: 300, height: 38, marginTop: 50, alignItems: 'center'}}
          source={require('./../img/urban-airship-sidebyside.png')}
        />
        <View style={{height: 75}}></View>
        {channelcell}
      </ScrollView>
      <View style={styles.bottom}>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    </View>
  );
}
