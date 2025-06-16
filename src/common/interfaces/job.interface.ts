export interface IEmailJob {
  email: string;
  userName?: string;
}

export interface IVerifyEmailJob extends IEmailJob {
  token: string;
}

export interface IAfterVerifyEmailJob extends IEmailJob {
  userName: string;
}
