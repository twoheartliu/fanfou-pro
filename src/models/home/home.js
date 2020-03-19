import {ff} from '../../api';
import U from 'uprogress';

const defaultState = {
	loading: false,
	timleine: [],
	parameters: null
};

export const home = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters})
	},

	effects: dispatch => ({
		fetch: async parameters => {
			const u = new U();

			try {
				u.start();
				const timeline = await ff.get('/statuses/home_timeline', {...parameters});
				dispatch.home.setTimeline({timeline, parameters});
				u.done();
			} catch (error) {
				const body = await error.response.text();
				let errorMessage = error.message;

				try {
					const result = JSON.parse(body);
					if (result.error) {
						errorMessage = result.error;
					}
				} catch {}

				dispatch.message.notify(errorMessage);
				u.done();
			}
		}
	})
};
