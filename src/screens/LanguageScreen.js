import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {THEME} from '../theme';
import {CONST} from '../const';
import {CustomHeader} from '../components/ui/CustomHeader';
import {LanguageTiles} from '../components/LanguageTiles';

export const LanguageScreen = ({navigation}) => {
	const theme = useSelector(state => state.theme);
	const language = useSelector(state => state.language);

	return (
		<View style={styles.container}>
			<CustomHeader
				navigation={navigation}
				label={language.headerTitle.language}
			/>
			<LinearGradient
				colors={theme.BACKGROUNDCOLOR_LG}
				style={THEME.MAIN_BACKGROUNDSTYLES}>
				<FlatList
					horizontal={false}
					contentContainerStyle={styles.screen}
					data={CONST.language.data}
					renderItem={({item}) => (
						<LanguageTiles title={item.title} name={item.value} />
					)}
					keyExtractor={item => item.id.toString()}
					style={{width: '100%', height: '100%'}}
					ListFooterComponent={
						<View
							style={{
								width: '100%',
								height: 150,
							}}></View>
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
