import React from 'react';
import {StyleSheet, View, FlatList, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {CustomHeader} from '../components/ui/CustomHeader';
import {CONST} from '../const';
import {TimerTiles} from '../components/TimerTiles';
import {Timer} from '../components/Timer';
import {TimePicker} from '../components/TimePicker';

export const TimerScreen = ({navigation}) => {
	const language = useSelector(state => state.language);
	const theme = useSelector(state => state.theme);

	const timerData = [
		{
			id: '1',
			title: `${CONST.timer.time1 / 60000} ${language.timer.mins}`,
			duration: CONST.timer.time1,
		},
		{
			id: '2',
			title: `${CONST.timer.time2 / 60000} ${language.timer.mins}`,
			duration: CONST.timer.time2,
		},
		{
			id: '3',
			title: `${CONST.timer.time3 / 60000} ${language.timer.mins}`,
			duration: CONST.timer.time3,
		},
		{
			id: '4',
			title: `${CONST.timer.time4 / 60000} ${language.timer.mins}`,
			duration: CONST.timer.time4,
		},
		{
			id: '5',
			title: `${CONST.timer.time5 / 3600000} ${language.timer.hour}`,
			duration: CONST.timer.time5,
		},
		{
			id: '6',
			title: `${CONST.timer.time6 / 3600000} ${language.timer.hours}`,
			duration: CONST.timer.time6,
		},
		{
			id: '7',
			title: language.timer.individual,
			duration: 0,
		},
	];

	const renderItem = ({item}) => {
		return (
			<TimerTiles id={item.id} title={item.title} duration={item.duration} />
		);
	};

	return (
		<View style={styles.container}>
			{Platform.OS === 'ios' && <TimePicker />}
			<CustomHeader
				navigation={navigation}
				label={language.headerTitle.timer}
			/>
			<LinearGradient
				colors={theme.BACKGROUNDCOLOR_LG}
				style={CONST.MAIN_BACKGROUNDSTYLES}>
				<FlatList
					horizontal={false}
					numColumns={CONST.timer.numberColumns}
					contentContainerStyle={styles.screen}
					data={timerData}
					renderItem={renderItem}
					keyExtractor={item => item.id.toString()}
					ListFooterComponent={
						<View style={{justifyContent: 'center', alignItems: 'center'}}>
							<Timer on={true} />
							{Platform.OS === 'android' && <TimePicker />}
							<View
								style={{
									width: '100%',
									height: 130,
								}}></View>
						</View>
					}
				/>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	screen: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30,
	},
});
