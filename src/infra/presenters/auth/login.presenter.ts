import { BasePresenter } from '../base-presenter';

type LoginPresenterPayload = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export class LoginPresenter extends BasePresenter {
  static toHttp(data: LoginPresenterPayload) {
    return this.safeParse(
      data,
      (data) => ({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      }),
      'LoginPresenter',
    );
  }
}
