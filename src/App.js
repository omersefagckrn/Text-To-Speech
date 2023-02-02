import * as React from 'react';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';
import { useSpeechSynthesis } from 'react-speech-kit';

import { addLink, getLinks, reset } from './redux/speech/speechSlice';

const App = ({ getLinks, addLink, reset, links, isLinksLoading, isAddLinkLoading, isAddLinkError, isAddLinkSuccess, isAddLinkMessage }) => {
	const [value, setValue] = React.useState('');
	const { speak } = useSpeechSynthesis();

	const handleSubmit = (e) => {
		e.preventDefault();
		setValue('');
		addLink({ link: value });
	};

	React.useEffect(() => {
		getLinks();
	}, [getLinks]);

	React.useEffect(() => {
		if (isAddLinkError) {
			toast.error(isAddLinkMessage);
		}

		if (isAddLinkSuccess) {
			toast.success('Link added successfully!');
			getLinks();
		}

		reset();
	}, [isAddLinkError, isAddLinkSuccess, isAddLinkMessage, getLinks, reset]);

	return (
		<>
			<div className='flex flex-col items-center justify-center min-h-screen bg-primary'>
				<form className='flex flex-col space-y-4'>
					<label className='text-xl font-sans font-bold text-center select-none mt-10 md:mt-0'>Enter URI</label>
					<input className='p-3 outline-none rounded-lg bg-slate-50' type='text' onChange={(e) => setValue(e.target.value)} value={value} placeholder='Please enter your link' />
					<button disabled={isAddLinkLoading} onClick={handleSubmit} type='submit' className='disabled:cursor-progress disabled:bg-red-700 disabled:border-red-700 disabled:text-white p-3 rounded-lg border border-blue-700 hover:border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white hover:transition-all transition-all'>
						{isAddLinkLoading ? 'Loading...' : 'Add Link'}
					</button>
				</form>
				{links.length === 0 && !links && <div className='text-center text-xl font-bold underline text-black select-none'>No data</div>}

				{isLinksLoading ? (
					<div className='fixed inset-0 flex items-center justify-center w-full bg-gray-200'>
						<div className='text-black text-2xl font-bold animate-pulse'>Loading...</div>
					</div>
				) : (
					<div className='grid md:grid-cols-2 gap-6 container p-4 md:mx-0'>
						{links &&
							links.map((item) => (
								<div key={item.id} className='flex flex-col'>
									<div
										className='font-bold font-montserrat text-red-700 underline cursor-pointer'
										onClick={() => {
											navigator.clipboard.writeText(item.id);
										}}>
										{item.link}
									</div>
									<div
										onClick={() => {
											speak({
												text: item.text
											});
										}}
										className='cursor-pointer p-3 h-20 overflow-y-auto bg-green-400 text-black shadow-lg rounded-lg text-center text-sm select-none'>
										{item.text}
									</div>
								</div>
							))}
					</div>
				)}
			</div>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		links: state.speech.linksData,
		isLinksLoading: state.speech.isLinksLoading,
		isLinksError: state.speech.isLinksError,
		isLinksMessage: state.speech.isLinksMessage,

		isAddLinkLoading: state.speech.isAddLinkLoading,
		isAddLinkError: state.speech.isAddLinkError,
		isAddLinkMessage: state.speech.isAddLinkMessage,
		isAddLinkSuccess: state.speech.isAddLinkSuccess
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getLinks: () => dispatch(getLinks()),
		addLink: (link) => dispatch(addLink(link)),
		reset: () => dispatch(reset())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
