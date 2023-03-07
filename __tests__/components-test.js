import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow, mount } from 'enzyme';
import { View, Text } from 'react-native';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

//##########################
// COMPONENTS of text

import BrandText from '../src/components/BrandText';
import SystemText from '../src/components/SystemText';
import TextInput from '../src/components/TextInput';
import TouchableText from '../src/components/TouchableText';
import TextField from '../src/components/TextField';
import RoundedTextInput from '../src/components/RoundedTextInput';
import VoudText from '../src/components/VoudText';

//##########################
// REST OF COMPONENTS

import Button from '../src/components/Button';
import BrandContainer from '../src/components/BrandContainer';
import CardButton from '../src/components/CardButton';
import CheckBox from '../src/components/CheckBox';
import CheckBoxField from '../src/components/CheckBoxField';
import CircleTransition from '../src/components/CircleTransition';
import CollapsibleCard from '../src/components/CollapsibleCard';
import ConfigError from '../src/components/ConfigError';
import ContentPlaceholder from '../src/components/ContentPlaceholder';
import CPFField from '../src/components/CPFField';
import Dialog from '../src/components/Dialog';
import FacebookButton from '../src/components/FacebookButton';
import FadeInView from '../src/components/FadeInView';
import GradientButton from '../src/components/GradientButton';
import IconButton from '../src/components/IconButton';
import InfoModal from '../src/components/InfoModal';
import KeyboardAvoidingView from '../src/components/KeyboardAvoidingView';
import KeyboardDismissView from '../src/components/KeyboardDismissView';
import KeyValueItem from '../src/components/KeyValueItem';
import Loader from '../src/components/Loader';
import LoadMask from '../src/components/LoadMask';
import MessageBox from '../src/components/MessageBox';
import NewButton from '../src/components/NewButton';
import NewFacebookButton from '../src/components/NewFacebookButton';
import NotificationBadge from '../src/components/NotificationBadge';
import PaymentCardNumberField from '../src/components/PaymentCardNumberField';
import Picote from '../src/components/Picote';
import PredictionItem from '../src/components/PredictionItem';
import Progress from '../src/components/Progress';
import RequestError from '../src/components/RequestError';
import RequestFeedback from '../src/components/RequestFeedback';
import RequestFeedbackSmall from '../src/components/RequestFeedbackSmall';
import ScreenWithCardHeader from '../src/components/ScreenWithCardHeader';
import SearchForm from '../src/components/SearchForm';
import SelectionButton from '../src/components/SelectionButton';
import SelectionButtonsField from '../src/components/SelectionButtonsField';
import SelectionButtonOptions from '../src/components/SelectionButtonOptions';
import SelectionButtonsFieldOptions from '../src/components/SelectionButtonsFieldOptions';
import Spinner from '../src/components/Spinner';
// import SupportedPaymentCardBrands from '../src/components/SupportedPaymentCardBrands';
import Swipper from '../src/components/Swipper';
import Switch from '../src/components/Switch';
// import Toast from '../src/components/Toast';
import TouchableListItem from '../src/components/TouchableListItem';
import TouchableNative from '../src/components/TouchableNative';
import TouchableOpacity from '../src/components/TouchableOpacity';
import TransportCardSm from '../src/components/TransportCardSm';
// import UsageTerms from '../src/components/UsageTerms';
import ZoomableImage from '../src/components/ZoomableImage';

//##########################
// REST OF COMPONENTS IN FOLDERS
import Dots from '../src/components/Dots/index';
import { headerActionTypes } from '../src/components/Header';
import HeaderIOS from '../src/components/Header/HeaderIOS';
import HeaderMD from '../src/components/Header/HeaderMD';
import DiscountItemList from '../src/components/DiscountItemList/index';
import ActionSheet from '../src/components/ActionSheet/index';
import ActionSheetItem from '../src/components/ActionSheet/Item';
import InfoListItem from '../src/components/InfoList/InfoListItem';
import Modal from '../src/components/Modal/index';
import NotificationBadgeIndex from '../src/components/NotificationBadge/index';
import TransportCardBadgesList from '../src/components/TransportCardBadgesList/index';
import TransportCardBadge from '../src/components/TransportCardBadgesList/TransportCardBadge';
import { adyenEncrypt } from '../src/utils/crypto-util';
import { actionsAddTransCard } from '../src/redux/transport-card';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

const store = mockStore({});

describe('Test Render AllComponents #1 ', () => {

	it('should /src/components/TransportCardBadge render correctly', () => {
		const wrapper = shallow(<TransportCardBadge type={actionsAddTransCard.CARRO} onPress={jest.fn()} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/TransportCardBadgesList render correctly', () => {
		const wrapper = shallow(
			<TransportCardBadgesList
				data={[{layoutType: actionsAddTransCard.CARRO}]}
				ui={{
					error: '',
					isFetching: false
				}}
				onCardPress={jest.fn()}
				onAddPress={jest.fn()}
				onRetry={jest.fn()}
				style={{}}
				contentStyle={{}}
			/>
		);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/NotificationBadgeIndex render correctly', () => {
		const wrapper = shallow(<NotificationBadgeIndex />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/Modal render correctly', () => {
		const wrapper = shallow(
			<Modal
				animationType="slide"
				swipeDirection="down"
				transparent={false}
				visible={true}
				avoidKeyboard={false}
				useNativeDriver={false}
				transparent={false}
				onRequestClose={jest.fn()}
			/>
		);
		const wrapperInverse = shallow(
			<Modal
				animationIn={{}}
				animationInTiming={200}
				animationOut={{}}
				animationOutTiming={234}
				avoidKeyboard={true}
				backdropColor=""
				backdropOpacity={1}
				backdropTransitionInTiming={200}
				backdropTransitionOutTiming={350}
				children={{}}
				isVisible={true}
				onModalShow={jest.fn()}
				onBackdropPress={jest.fn()}
				onBackButtonPress={jest.fn()}
				useNativeDriver={true}
				style={{}}
				swipeDirection="up"
				transparent={true}
				visible={true}
				swipeDirection={true}
				onRequestClose={jest.fn()}
			/>
		);
		const wrapperInverseWithChild = shallow(
			<Modal
				animationType="slide"
				swipeDirection="down"
				transparent={false}
				visible={true}
				avoidKeyboard={false}
				useNativeDriver={false}
				transparent={false}
				onRequestClose={jest.fn()}
			>
				<View>
					<Text>Teste</Text>
				</View>
			</Modal>
		);
		expect(toJson(wrapper)).toMatchSnapshot();
		expect(toJson(wrapperInverse)).toMatchSnapshot();
	});

	it('should /src/components/InfoListItem render correctly', () => {
		const wrapper = shallow(<InfoListItem itemContent={'Cota atual '} isHeader />);

		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/ActionSheet | ActionSheetItem render correctly', () => {
		const wrapper = shallow(
			<ActionSheet isVisible={true} onDismiss={jest.fn()}>
				<ActionSheetItem key="delete" icon="delete" label="Excluir notificação" onPress={jest.fn()} />
			</ActionSheet>
		);

		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/HeaderDiscountItemListIOS render correctly', () => {
		const wrapper = shallow(
			<DiscountItemList activeDiscounts={{}} isFetching={false} error={[]} onRetry={jest.fn()} />
		);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/HeaderIOS render correctly', () => {
		const wrapper = shallow(
			<HeaderIOS
				title="Atualize seus dados"
				left={{
					type: headerActionTypes.BACK,
					onPress: jest.fn()
				}}
				isRequestCard
			/>
		);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/HeaderMD render correctly', () => {
		const wrapper = shallow(
			<HeaderMD
				title="Atualize seus dados"
				left={{
					type: headerActionTypes.BACK,
					onPress: jest.fn()
				}}
				isRequestCard
			/>
		);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/Dots render correctly', () => {
		const wrapper = shallow(<Dots index={2} total={10} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/Spinner render correctly', () => {
		const wrapper = shallow(<Spinner />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/ZoomableImage render correctly', () => {
		const wrapper = shallow(<ZoomableImage />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/TransportCardSm render correctly', () => {
		const wrapper = shallow(<TransportCardSm />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	// it('should /src/components/UsageTerms render correctly', () => {
	// 	const wrapper = shallow(<UsageTerms />);
	// 	expect(toJson(wrapper)).toMatchSnapshot();
	// });

	it('should /src/components/TouchableOpacity render correctly', () => {
		const wrapper = shallow(<TouchableOpacity />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	// it('should /src/components/NotificationBadge render correctly', () => {
	// 	const wrapper = shallow(
	// 		<PaymentCardNumberField />
	// 	);
	// 	expect(toJson(wrapper)).toMatchSnapshot();
	// });

	it('should /src/components/TouchableNative render correctly', () => {
		const wrapper = shallow(<TouchableNative />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/TouchableListItem render correctly', () => {
		const wrapper = shallow(<TouchableListItem item={{ name: 'teste' }} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	// it('should /src/components/Toast render correctly', () => {
	// 	const wrapper = shallow(<Toast />);
	// 	expect(toJson(wrapper)).toMatchSnapshot();
	// });

	it('should /src/components/Switch render correctly', () => {
		const wrapper = shallow(<Switch />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/Swipper render correctly', () => {
		const wrapper = shallow(<Swipper />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	// it('should /src/components/SupportedPaymentCardBrands render correctly', () => {
	// 	const wrapper = shallow(<SupportedPaymentCardBrands />);
	// 	expect(toJson(wrapper)).toMatchSnapshot();
	// });

	// it('should /src/components/SelectionButtonsFieldOptions render correctly', () => {
	// 	const wrapper = shallow(<SelectionButtonsFieldOptions />);
	// 	expect(toJson(wrapper)).toMatchSnapshot();
	// });

	it('should /src/components/SelectionButtonsField render correctly', () => {
		const wrapper = shallow(<SelectionButtonsField />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/SelectionButtonOptions render correctly', () => {
		const wrapper = shallow(<SelectionButtonOptions />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/SelectionButton render correctly', () => {
		const wrapper = shallow(<SelectionButton />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/SearchForm render correctly', () => {
		const wrapper = shallow(<SearchForm />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	// it('should /src/components/ScreenWithCardHeader render correctly', () => {
	// 	const wrapper = shallow(<ScreenWithCardHeader />);
	// 	expect(toJson(wrapper)).toMatchSnapshot();
	// });

	it('should /src/components/RequestFeedbackSmall render correctly', () => {
		const wrapper = shallow(<RequestFeedbackSmall />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/RequestFeedbackSmall render correctly', () => {
		const wrapper = shallow(<RequestFeedbackSmall />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/RequestFeedback render correctly', () => {
		const wrapper = shallow(<RequestFeedback />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/RequestError render correctly', () => {
		const wrapper = shallow(<RequestError />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/Progress render correctly', () => {
		const wrapper = shallow(<Progress />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/Picote render correctly', () => {
		const wrapper = shallow(<Picote />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/PredictionItem render correctly', () => {
		const wrapper = shallow(<PredictionItem />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/NotificationBadge render correctly', () => {
		const wrapper = shallow(<NotificationBadge />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/NewFacebookButton render correctly', () => {
		const wrapper = shallow(<NewFacebookButton />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/MessageBox render correctly', () => {
		const wrapper = shallow(<MessageBox />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/LoadMask render correctly', () => {
		const wrapper = shallow(<LoadMask />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/Loader render correctly', () => {
		const wrapper = shallow(<Loader />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/KeyValueItem render correctly', () => {
		const wrapper = shallow(<KeyValueItem />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/KeyboardDismissView render correctly', () => {
		const wrapper = shallow(<KeyboardDismissView />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/KeyboardAvoidingView render correctly', () => {
		const wrapper = shallow(<KeyboardAvoidingView />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/InfoModal render correctly', () => {
		const wrapper = shallow(<InfoModal isVisible={true} onDismiss={() => {}} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/IconButton render correctly', () => {
		const wrapper = shallow(<IconButton iconName={'home'} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/GradientButton render correctly', () => {
		const wrapper = shallow(<GradientButton />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/FadeInView render correctly', () => {
		const wrapper = shallow(<FadeInView />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/FacebookButton render correctly', () => {
		const wrapper = shallow(
			<FacebookButton
				buttonText="teste facebook"
				disabled={true}
				onPress={() => {}}
				style={{}}
				isRoundFacebookButton={true}
			/>
		);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/Dialog render correctly', () => {
		const wrapper = shallow(<Dialog />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/CPFField render correctly', () => {
		const wrapper = shallow(
			<CPFField
				{...{
					input: {
						onPress: jest.fn(),
						onChange: jest.fn(),
						onBlur: jest.fn(),
						onFocus: jest.fn()
					}
				}}
				meta={{ error: '', touched: '' }}
				style={{}}
			/>
		);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/ContentPlaceholder render correctly', () => {
		const wrapper = shallow(<ContentPlaceholder />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/CollapsibleCard render correctly', () => {
		const wrapper = shallow(<CollapsibleCard />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('should /src/components/CircleTransition render correctly', () => {
		const wrapperCircleTransition = shallow(<CircleTransition />);
		expect(toJson(wrapperCircleTransition)).toMatchSnapshot();
	});

	it('should /src/components/CheckBoxField render correctly', () => {
		const wrapperCheckBoxField = shallow(
			<CheckBoxField
				{...{
					input: {
						onPress: jest.fn(),
						onChange: jest.fn(),
						onBlur: jest.fn(),
						onFocus: jest.fn()
					}
				}}
			/>
		);
		expect(toJson(wrapperCheckBoxField)).toMatchSnapshot();
	});

	it('should /src/components/CheckBox render correctly', () => {
		const wrapperCheckBox = shallow(<CheckBox />);
		expect(toJson(wrapperCheckBox)).toMatchSnapshot();
	});

	it('should /src/components/CardButton render correctly', () => {
		const wrapperCardButton = shallow(
			<CardButton
				{...{
					iconName: '',
					text: '',
					onPress: jest.fn()
				}}
			/>
		);
		expect(toJson(wrapperCardButton)).toMatchSnapshot();
	});

	it('should /src/components/BrandContainer render correctly', () => {
		const wrapperBrandContainer = shallow(<BrandContainer />);

		expect(toJson(wrapperBrandContainer)).toMatchSnapshot();
	});

	it('should /src/components/Button render correctly', () => {
		const wrapperButton = shallow(<Button>BrandText</Button>);

		expect(toJson(wrapperButton)).toMatchSnapshot();
	});

	it('should /src/components/VoudText render correctly', () => {
		const wrapperVoudText = shallow(<VoudText>BrandText</VoudText>);

		expect(toJson(wrapperVoudText)).toMatchSnapshot();
	});

	it('should /src/components/RoundedTextInput render correctly', () => {
		const wrapperRoundedTextInput = shallow(
			<RoundedTextInput
				{...{
					input: {
						onPress: jest.fn(),
						onChange: jest.fn(),
						onBlur: jest.fn(),
						onFocus: jest.fn()
					}
				}}
			>
				BrandText
			</RoundedTextInput>
		);

		expect(toJson(wrapperRoundedTextInput)).toMatchSnapshot();
	});

	it('should /src/components/BrandText render correctly', () => {
		const wrapperBrandText = shallow(<BrandText>BrandText</BrandText>);

		expect(toJson(wrapperBrandText)).toMatchSnapshot();
	});

	it('should  /src/components/SystemText render correctly', () => {
		const wrapperSystemText = shallow(<SystemText>SystemText</SystemText>);

		expect(toJson(wrapperSystemText)).toMatchSnapshot();
	});
});
describe('Test Render TextComponents with Dependecies | SystemText | Icon | BrandText | TouchableOpacity ', () => {
	it('should  /src/components/TextInput render correctly', () => {
		const wrapperTextInput = shallow(<TextInput />);

		expect(toJson(wrapperTextInput)).toMatchSnapshot();
	});

	it('should  /src/components/TouchableText render correctly', () => {
		const wrapperTouchableText = shallow(
			<TouchableText displayName="teste" textStyle={{}} onPress={() => {}}>
				Ocorreu um erro ao carregar seus descontos e isenções ativas.{' '}
				<BrandText style={{}}>Tentar novamente</BrandText>
			</TouchableText>
		);

		expect(toJson(wrapperTouchableText)).toMatchSnapshot();
	});

	it('should  /src/components/TextField | render correctly', () => {
		const isOrigin = true;
		const wrapperTextField = shallow(
			<TextField
				{...{
					input: {
						onPress: jest.fn(),
						onChange: jest.fn(),
						onBlur: jest.fn(),
						onFocus: jest.fn()
					}
				}}
				meta={{ error: '', touched: '' }}
				label={isOrigin ? 'Qual é o seu local de partida?' : 'E o seu destino?'}
				style={{}}
			/>
		);

		expect(toJson(wrapperTextField)).toMatchSnapshot();
	});
});
