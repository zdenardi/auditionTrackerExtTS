export interface Audition {
  [index: number]: string;
  orderNo: string;
  projectName: string;
  submittedDate: string;
  role: string;
  castingDirector: string;
  submitter: string;
  source: string;
  projectType: string;
  status: string;
  lastUpdated: string;
  submittedPhoto?: string;
}
export interface AABrowserReq {
  audition: Audition;
}
export interface IFoundFile {
  id?: string;
  found: boolean;
}

export interface ICommandReq {
  type: string;
  category: string;
  success: boolean;
}

export interface IDataSend extends ICommandReq {
  data: Audition;
}
